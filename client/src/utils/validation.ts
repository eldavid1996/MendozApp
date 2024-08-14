import { useMemo } from "react";

export const isFieldLengthInvalid = (field: string) => field.length > 255;

export const validateEmail = (value: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

export const validatePassword = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);

export const useRegisterValidation = (formData: {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}) => {
  const isUsernameInvalid = useMemo(() => {
    if (formData.username === "") return undefined;
    return isFieldLengthInvalid(formData.username);
  }, [formData.username]);

  const isEmailInvalid = useMemo(() => {
    if (formData.email === "") return undefined;
    return !validateEmail(formData.email);
  }, [formData.email]);

  const isPasswordInvalid = useMemo(() => {
    if (formData.password === "") return undefined;
    return !validatePassword(formData.password);
  }, [formData.password]);

  const isConfirmPasswordInvalid = useMemo(() => {
    if (formData.confirmPassword === "") return undefined;
    return formData.password !== formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  return {
    isUsernameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isConfirmPasswordInvalid,
  };
};

export const useLoginValidation = (formData: {
  email: string;
  password: string;
}) => {
  const isEmailInvalid = useMemo(() => {
    if (formData.email === "") return undefined;
    return !validateEmail(formData.email);
  }, [formData.email]);

  const isPasswordInvalid = useMemo(() => {
    if (formData.password === "") return undefined;
    return !validatePassword(formData.password);
  }, [formData.password]);

  return {
    isEmailInvalid,
    isPasswordInvalid,
  };
};
