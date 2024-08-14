//#region 📖 Imports
import { useState, useCallback, ChangeEvent, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import { isFieldLengthInvalid, useRegisterValidation } from "../utils";
import {
  EmailIcon,
  EyeFilledIcon,
  EyeSlashFilledIcon,
  PasswordIcon,
  UserIcon,
  ConfirmPasswordIcon,
} from "./Icons";
import { registerUser } from "../services";
import { CustomMessage, RegisterFormData } from "../interfaces";
import { FormField } from "./Shared";
import Container from "./Shared/Container";

export default function Register() {
  //#region ✏️ Declarations
  useEffect(() => {
    document.title = "Registro de Usuarios";
  }, []);

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<CustomMessage>({
    type: "success",
    text: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = (field: "password" | "confirmPassword") =>
    field === "password"
      ? setIsPasswordVisible(!isPasswordVisible)
      : setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const {
    isUsernameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isConfirmPasswordInvalid,
  } = useRegisterValidation(formData);

  const submitDisabled =
    !formData.username ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    isFieldLengthInvalid(formData.username) ||
    isFieldLengthInvalid(formData.email) ||
    isFieldLengthInvalid(formData.password) ||
    isFieldLengthInvalid(formData.confirmPassword) ||
    isPasswordInvalid ||
    isConfirmPasswordInvalid ||
    isEmailInvalid ||
    isSubmitting;

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await registerUser(formData);
      setMessage({ type: "success", text: "Usuario creado con éxito" });

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      let errorMessage: string = "Error desconocido";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  //#region ⚙️ Components
  return (
    <Container>
      <form onSubmit={handleRegister}>
        {
          //#region 👨 - Username
        }
        <FormField>
          <div className="flex items-center gap-2">
            <UserIcon width={33} height={33} className="max-sm:mb-10 md:mb-5" />
            <Input
              id="username"
              name="username"
              variant="bordered"
              isRequired
              type="text"
              label="Nombre de Usuario"
              description="Nombre con el que te verán los usuarios"
              value={formData.username}
              onChange={handleChange}
              isInvalid={isFieldLengthInvalid(formData.username)}
              errorMessage={
                isFieldLengthInvalid(formData.username)
                  ? "Máximo 255 caracteres"
                  : ""
              }
              color={
                isUsernameInvalid === undefined
                  ? undefined
                  : isUsernameInvalid
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </FormField>
        {
          //#region 📧 - Email
        }
        <FormField>
          <div className="flex items-center gap-2">
            <EmailIcon
              width={33}
              height={33}
              className="max-sm:mb-10 md:mb-5"
            />
            <Input
              id="email"
              name="email"
              variant="bordered"
              isRequired
              type="email"
              label="Correo Electrónico"
              description="No se mostrará tu correo electrónico en tu perfil"
              value={formData.email}
              onChange={handleChange}
              isInvalid={isEmailInvalid || isFieldLengthInvalid(formData.email)}
              errorMessage={
                isEmailInvalid
                  ? "Ingresa un email válido"
                  : isFieldLengthInvalid(formData.email)
                  ? "Máximo 255 caracteres"
                  : ""
              }
              color={
                isEmailInvalid === undefined
                  ? undefined
                  : isEmailInvalid
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </FormField>
        {
          //#region ✳️ - Password
        }
        <FormField>
          <div className="flex items-center gap-2">
            <PasswordIcon
              width={33}
              height={33}
              className="max-sm:mb-14 md:mb-10"
            />
            <Input
              name="password"
              variant="bordered"
              isRequired
              type={isPasswordVisible ? "text" : "password"}
              label="Contraseña"
              description="Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial"
              value={formData.password}
              onChange={handleChange}
              endContent={
                <button
                  tabIndex={-1}
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  aria-label="toggle password visibility"
                >
                  {isPasswordVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                  )}
                </button>
              }
              isInvalid={
                isFieldLengthInvalid(formData.password) || isPasswordInvalid
              }
              errorMessage={
                isPasswordInvalid
                  ? "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial"
                  : isFieldLengthInvalid(formData.password)
                  ? "Máximo 255 caracteres"
                  : ""
              }
              color={
                isPasswordInvalid === undefined
                  ? undefined
                  : isPasswordInvalid
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </FormField>
        {
          //#region ✳️ - Password x2
        }
        <FormField>
          <div className="flex items-center gap-2">
            <ConfirmPasswordIcon
              width={33}
              height={33}
              className="max-sm:mb-6 md:mb-6"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              variant="bordered"
              isRequired
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirmar Contraseña"
              description="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              endContent={
                <button
                  tabIndex={-1}
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label="toggle confirm password visibility"
                >
                  {isConfirmPasswordVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                  )}
                </button>
              }
              isInvalid={isConfirmPasswordInvalid}
              errorMessage={
                isConfirmPasswordInvalid ? "Las contraseñas no coinciden" : ""
              }
              color={
                isConfirmPasswordInvalid === undefined
                  ? undefined
                  : isConfirmPasswordInvalid
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </FormField>
        {message?.text && message.type === "error" ? (
          <p className="text-red-500">{message.text}</p>
        ) : message?.text && message.type === "success" ? (
          <p className="text-green-500">{message.text}</p>
        ) : null}
        {
          //#region 👌 - Sumit Button
        }{" "}
        <div className="flex justify-end mt-5">
          <Button
            type="submit"
            aria-label="Register"
            className="max-w-xs"
            color={submitDisabled ? "default" : "success"}
            disabled={submitDisabled}
            isLoading={isSubmitting}
            endContent={<UserIcon />}
          >
            Crear Usuario
          </Button>
        </div>
      </form>
    </Container>
  );
}
