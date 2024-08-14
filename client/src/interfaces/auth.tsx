export interface ApiResponse {
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface CustomMessage {
  type: "error" | "success";
  text: string;
}
