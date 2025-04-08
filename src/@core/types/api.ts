export interface RegisterRequest {
  firstname: string;
  lastname: string;
  contact: string;
  user_role: string;
  email: string;
  password: string;
}

export interface ActivationRequest {
  email: string;
  otp_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: number;
  new_password: string;
  confirm_password: string;
}
