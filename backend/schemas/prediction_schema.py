from typing import Optional, Union, Literal
from pydantic import BaseModel, Field, field_validator


class LoanApplicationRequest(BaseModel):
    """
    Loan Application Input Schema.
    Accepts human-readable values as well as legacy encoded field names
    for full backward compatibility.
    """
    gender: Literal["Male", "Female"] = Field(
        default="Male",
        description="Applicant gender: 'Male' or 'Female'"
    )
    married: Literal["Yes", "No"] = Field(
        default="Yes",
        description="Applicant marital status: 'Yes' or 'No'"
    )
    dependents: Union[int, str] = Field(
        default=0,
        description="Number of dependents: 0, 1, 2, or '3+' (or 3)"
    )
    education: Literal["Graduate", "Not Graduate"] = Field(
        default="Graduate",
        description="Applicant education level: 'Graduate' or 'Not Graduate'"
    )
    self_employed: Literal["Yes", "No"] = Field(
        default="No",
        description="Self employment status: 'Yes' or 'No'"
    )
    applicant_income: float = Field(
        ...,
        ge=0,
        description="Primary applicant monthly/annual income (must be non-negative)",
        examples=[5000.0]
    )
    coapplicant_income: float = Field(
        default=0.0,
        ge=0,
        description="Co-applicant monthly/annual income (must be non-negative)",
        examples=[1500.0]
    )
    loan_amount: float = Field(
        ...,
        gt=0,
        description="Loan amount in thousands (e.g. 120 represents 120k)",
        examples=[120.0]
    )
    loan_amount_term: float = Field(
        default=360.0,
        gt=0,
        description="Term of loan in months (e.g. 360 for 30 years, 180 for 15 years)",
        examples=[360.0]
    )
    credit_history: float = Field(
        ...,
        description="Credit history: 1.0 (meets credit guidelines / good credit) or 0.0 (poor credit)",
        examples=[1.0]
    )
    property_area: Literal["Urban", "Semiurban", "Rural"] = Field(
        default="Urban",
        description="Property location area: 'Urban', 'Semiurban', or 'Rural'"
    )

    # Legacy fields for backward compatibility with the original app.py
    Dependents: Optional[Union[int, str]] = None
    ApplicantIncome: Optional[float] = None
    CoapplicantIncome: Optional[float] = None
    LoanAmount: Optional[float] = None
    Loan_Amount_Term: Optional[float] = None
    Credit_History: Optional[float] = None
    Gender_Male: Optional[int] = None
    Married_Yes: Optional[int] = None
    Education_Not_Graduate: Optional[int] = None
    Self_Employed_Yes: Optional[int] = None
    Property_Area_Semiurban: Optional[int] = None
    Property_Area_Urban: Optional[int] = None

    @field_validator("dependents", mode="before")
    @classmethod
    def validate_dependents(cls, v):
        if isinstance(v, str):
            v_clean = v.strip().replace("+", "")
            try:
                val = int(v_clean)
                if val < 0:
                    raise ValueError("Dependents cannot be negative")
                return min(val, 3)
            except ValueError:
                raise ValueError("Dependents must be 0, 1, 2, or 3+")
        elif isinstance(v, int):
            if v < 0:
                raise ValueError("Dependents cannot be negative")
            return min(v, 3)
        return v

    @field_validator("credit_history", mode="before")
    @classmethod
    def validate_credit_history(cls, v):
        try:
            val = float(v)
            if val not in [0.0, 1.0]:
                # Allow boolean or binary int
                if val > 0.5:
                    return 1.0
                return 0.0
            return val
        except Exception:
            raise ValueError("Credit History must be 1.0 (good) or 0.0 (poor)")

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "gender": "Male",
                "married": "Yes",
                "dependents": 1,
                "education": "Graduate",
                "self_employed": "No",
                "applicant_income": 5000.0,
                "coapplicant_income": 1500.0,
                "loan_amount": 120.0,
                "loan_amount_term": 360.0,
                "credit_history": 1.0,
                "property_area": "Semiurban"
            }
        }
    }


class PredictionResponse(BaseModel):
    success: bool
    prediction: int = Field(description="1 for Approved, 0 for Not Approved")
    loan_status: str = Field(description="'Approved' or 'Not Approved'")
    confidence: Optional[float] = Field(
        default=None,
        description="Model confidence score for the predicted class between 0 and 1"
    )
    approval_probability: Optional[float] = Field(
        default=None,
        description="Probability of loan approval between 0 and 1"
    )
    rejection_probability: Optional[float] = Field(
        default=None,
        description="Probability of loan rejection between 0 and 1"
    )
    message: str = Field(
        description="Human-readable decision explanation or guidance"
    )


class ModelInfoResponse(BaseModel):
    model_name: str
    model_type: str
    algorithm: str
    scaling: str
    feature_count: int
    features_expected: list[str]
    performance_metrics: dict
    status: str
