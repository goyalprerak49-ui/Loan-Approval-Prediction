import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Dict, Any

# Ensure both backend/ and project root are in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
for p in [str(CURRENT_DIR), str(PARENT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.schemas.prediction_schema import (
        LoanApplicationRequest,
        PredictionResponse,
        ModelInfoResponse,
    )
    from backend.services.prediction_service import prediction_service, EXPECTED_FEATURE_NAMES
    from backend.utils.logger import get_logger
except ImportError:
    from schemas.prediction_schema import (
        LoanApplicationRequest,
        PredictionResponse,
        ModelInfoResponse,
    )
    from services.prediction_service import prediction_service, EXPECTED_FEATURE_NAMES
    from utils.logger import get_logger

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = get_logger("loan_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load ML model and scaler once on startup.
    """
    logger.info("Initializing Loan Approval Prediction API...")
    try:
        prediction_service.load_artifacts()
        logger.info("Model and Scaler loaded successfully.")
    except Exception as e:
        logger.error(f"FATAL: Failed to load ML model or scaler: {e}")
    yield
    logger.info("Shutting down Loan Approval Prediction API...")


app = FastAPI(
    title="Loan Approval Prediction API",
    description="Production-grade AI/ML API for real-time automated loan approval decisions.",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """
    Custom validation error handler returning clear, user-friendly messages.
    """
    errors = []
    for err in exc.errors():
        field_loc = " -> ".join([str(loc) for loc in err.get("loc", []) if loc != "body"])
        errors.append({
            "field": field_loc,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error"),
        })
    logger.warning(f"Validation error on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "message": "Invalid loan application parameters provided.",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc: Exception):
    """
    Catch-all handler to avoid exposing raw stack traces.
    """
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request. Please try again later.",
        },
    )


@app.get("/", tags=["Health"])
def root() -> Dict[str, Any]:
    """
    Root status endpoint.
    """
    return {
        "success": True,
        "message": "Loan Approval Prediction API is running",
        "version": "2.0.0",
        "docs_url": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check() -> Dict[str, Any]:
    """
    Health check endpoint verifying model and scaler availability.
    """
    is_ready = prediction_service.is_loaded
    return {
        "status": "healthy" if is_ready else "degraded",
        "model_loaded": is_ready,
        "scaler_loaded": is_ready,
        "service": "Loan Approval ML Service",
    }


@app.get("/model-info", response_model=ModelInfoResponse, tags=["Model"])
def model_info() -> ModelInfoResponse:
    """
    Returns safe, publicly verifiable metadata regarding the trained model.
    Does not expose sensitive internal paths.
    """
    return ModelInfoResponse(
        model_name="Loan Approval Classifier",
        model_type="Binary Classification",
        algorithm="Logistic Regression (Tuned via RandomizedSearchCV)",
        scaling="StandardScaler (12 features)",
        feature_count=len(EXPECTED_FEATURE_NAMES),
        features_expected=EXPECTED_FEATURE_NAMES,
        performance_metrics={
            "accuracy": "86.18%",
            "precision": "84.00%",
            "recall": "98.82%",
            "roc_auc": "0.8483",
        },
        status="ready" if prediction_service.is_loaded else "unavailable",
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_loan(data: LoanApplicationRequest) -> PredictionResponse:
    """
    Receive loan applicant details, apply exact preprocessing and scaling,
    and return approval decision with probability confidence.
    """
    if not prediction_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not loaded. Please contact server administrator.",
        )

    try:
        response = prediction_service.predict(data)
        return response
    except ValueError as ve:
        logger.warning(f"Invalid input data: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as e:
        logger.error(f"Inference error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error computing loan approval prediction.",
        )
