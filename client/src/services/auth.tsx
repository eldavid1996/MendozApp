import { ApiResponse, LoginFormData, RegisterFormData } from "../interfaces";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const registerUser = async (formData: RegisterFormData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return await response.json();
};

export const loginUser = async (
  formData: LoginFormData
): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return response.json();
};
