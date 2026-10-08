import os
import sys
from pathlib import Path
import warnings
import joblib
import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, Optional

# Ensure both backend/ and project root are in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
ROOT_DIR = BACKEND_DIR.parent
for p in [str(CURRENT_DIR), str(BACKEND_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.schemas.prediction_schema import LoanApplicationRequest, PredictionResponse
    from backend.utils.logger import get_logger
except ImportError:
    from schemas.prediction_schema import LoanApplicationRequest, PredictionResponse
    from utils.logger import get_logger

logger = get_logger("prediction_service")

# Suppress scikit-learn version mismatch warning when unpickling
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

EXPECTED_FEATURE_NAMES = [
    "Dependents",
    "ApplicantIncome",
    "CoapplicantIncome",
    "LoanAmount",
    "Loan_Amount_Term",
    "Credit_History",
    "Gender_Male",
    "Married_Yes",
    "Education_Not Graduate",
    "Self_Employed_Yes",
    "Property_Area_Semiurban",
    "Property_Area_Urban",
]


class PredictionService:
    def __init__(self, models_dir: Optional[Path] = None):
        if models_dir is None:
            # Default to backend/models relative to this file
            self.models_dir = Path(__file__).resolve().parent.parent / "models"
        else:
            self.models_dir = Path(models_dir)

        self.model_path = self.models_dir / "loan_logistic_model.pkl"
        self.scaler_path = self.models_dir / "scaler.pkl"

        self.model = None
        self.scaler = None
        self.is_loaded = False

    def load_artifacts(self) -> None:
        """
        Load trained model and scaler once on application startup.
        """
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {self.model_path}. Please check backend/models/ directory."
            )
        if not self.scaler_path.exists():
            raise FileNotFoundError(
                f"Scaler file not found at {self.scaler_path}. Please check backend/models/ directory."
            )

        logger.info(f"Loading model from: {self.model_path.name}")
        self.model = joblib.load(self.model_path)

        logger.info(f"Loading scaler from: {self.scaler_path.name}")
        self.scaler = joblib.load(self.scaler_path)

        self.is_loaded = True
        logger.info("Successfully loaded ML model and Scaler artifacts.")

    def preprocess_input(self, data: LoanApplicationRequest) -> pd.DataFrame:
        """
        Transform applicant data into the exact 12-feature structure
        expected by the scaler and model.
        Handles both modern high-level input and legacy encoded input.
        """
        # Resolve Dependents
        if data.Dependents is not None:
            dep_val = str(data.Dependents).replace("+", "").strip()
            dependents = min(int(dep_val), 3)
        else:
            dep_val = str(data.dependents).replace("+", "").strip()
            dependents = min(int(dep_val), 3)

        # Resolve Numerical Inputs
        applicant_income = float(
            data.ApplicantIncome if data.ApplicantIncome is not None else data.applicant_income
        )
        coapplicant_income = float(
            data.CoapplicantIncome if data.CoapplicantIncome is not None else data.coapplicant_income
        )
        loan_amount = float(
            data.LoanAmount if data.LoanAmount is not None else data.loan_amount
        )
        loan_term = float(
            data.Loan_Amount_Term if data.Loan_Amount_Term is not None else data.loan_amount_term
        )
        credit_history = float(
            data.Credit_History if data.Credit_History is not None else data.credit_history
        )

        # Resolve Gender_Male (drop_first: Female dropped, Male = 1, Female = 0)
        if data.Gender_Male is not None:
            gender_male = int(data.Gender_Male)
        else:
            gender_male = 1 if data.gender == "Male" else 0

        # Resolve Married_Yes (drop_first: No dropped, Yes = 1, No = 0)
        if data.Married_Yes is not None:
            married_yes = int(data.Married_Yes)
        else:
            married_yes = 1 if data.married == "Yes" else 0

        # Resolve Education_Not Graduate (drop_first: Graduate dropped, Not Graduate = 1, Graduate = 0)
        if data.Education_Not_Graduate is not None:
            edu_not_graduate = int(data.Education_Not_Graduate)
        else:
            edu_not_graduate = 1 if data.education == "Not Graduate" else 0

        # Resolve Self_Employed_Yes (drop_first: No dropped, Yes = 1, No = 0)
        if data.Self_Employed_Yes is not None:
            self_employed_yes = int(data.Self_Employed_Yes)
        else:
            self_employed_yes = 1 if data.self_employed == "Yes" else 0

        # Resolve Property_Area (drop_first: Rural dropped -> Semiurban, Urban)
        if data.Property_Area_Semiurban is not None and data.Property_Area_Urban is not None:
            prop_semiurban = int(data.Property_Area_Semiurban)
            prop_urban = int(data.Property_Area_Urban)
        else:
            prop_semiurban = 1 if data.property_area == "Semiurban" else 0
            prop_urban = 1 if data.property_area == "Urban" else 0

        feature_dict = {
            "Dependents": [dependents],
            "ApplicantIncome": [applicant_income],
            "CoapplicantIncome": [coapplicant_income],
            "LoanAmount": [loan_amount],
            "Loan_Amount_Term": [loan_term],
            "Credit_History": [credit_history],
            "Gender_Male": [gender_male],
            "Married_Yes": [married_yes],
            "Education_Not Graduate": [edu_not_graduate],
            "Self_Employed_Yes": [self_employed_yes],
            "Property_Area_Semiurban": [prop_semiurban],
            "Property_Area_Urban": [prop_urban],
        }

        # Create DataFrame adhering to exact feature order
        df = pd.DataFrame(feature_dict, columns=EXPECTED_FEATURE_NAMES)
        return df

    def predict(self, data: LoanApplicationRequest) -> PredictionResponse:
        """
        Execute prediction pipeline:
        1. Preprocess & validate input
        2. Scale features via StandardScaler
        3. Predict class & probability via tuned Logistic Regression
        4. Construct clean response
        """
        if not self.is_loaded or self.model is None or self.scaler is None:
            raise RuntimeError("ML model or scaler has not been initialized.")

        # Preprocessing to 12 features
        df_features = self.preprocess_input(data)

        # Scale features
        scaled_features = self.scaler.transform(df_features)

        # Generate prediction
        prediction_val = int(self.model.predict(scaled_features)[0])
        loan_status = "Approved" if prediction_val == 1 else "Not Approved"

        # Safely compute probabilities if model supports predict_proba
        confidence = None
        approval_prob = None
        rejection_prob = None

        if hasattr(self.model, "predict_proba"):
            try:
                probabilities = self.model.predict_proba(scaled_features)[0]
                rejection_prob = round(float(probabilities[0]), 4)
                approval_prob = round(float(probabilities[1]), 4)
                confidence = approval_prob if prediction_val == 1 else rejection_prob
            except Exception as e:
                logger.warning(f"Error extracting probabilities: {e}")

        # Human-readable contextual message
        if prediction_val == 1:
            msg = (
                f"Loan Application is Approved with an estimated confidence of "
                f"{round(confidence * 100, 1) if confidence else 'high'}%. "
                f"Applicant financial indicators and credit history meet risk parameters."
            )
        else:
            msg = (
                f"Loan Application is Not Approved with an estimated risk confidence of "
                f"{round(confidence * 100, 1) if confidence else 'high'}%. "
                f"Key factors such as credit history or debt-to-income balance require review."
            )

        return PredictionResponse(
            success=True,
            prediction=prediction_val,
            loan_status=loan_status,
            confidence=confidence,
            approval_probability=approval_prob,
            rejection_probability=rejection_prob,
            message=msg,
        )


# Global singleton instance
prediction_service = PredictionService()
