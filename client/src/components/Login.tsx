//#region 📖 Imports
import { useState, useCallback, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import {
  EyeFilledIcon,
  UserIcon,
  EyeSlashFilledIcon,
  PasswordIcon,
  EmailIcon,
} from "./Icons";
import {
  isFieldLengthInvalid,
  useLoginValidation,
  setTokenWithExpiry,
} from "../utils";
import { loginUser } from "../services";
import { CustomMessage, LoginFormData } from "../interfaces";
import { FormField } from "./Shared";
import Container from "./Shared/Container";

export default function Login() {
  const navigate = useNavigate();

  //#region ✏️ Declarations
  useEffect(() => {
    document.title = "Inicio de sesión";
  }, []);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<CustomMessage>({
    type: "success",
    text: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const { isEmailInvalid, isPasswordInvalid } = useLoginValidation(formData);

  const submitDisabled =
    !formData.email ||
    !formData.password ||
    isFieldLengthInvalid(formData.email) ||
    isFieldLengthInvalid(formData.password) ||
    isEmailInvalid ||
    isPasswordInvalid ||
    isSubmitting;

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      setMessage({ type: "success", text: "Sesión iniciada con éxito" });

      setFormData({
        email: "",
        password: "",
      });
      setTokenWithExpiry(response.token, 1);
      navigate("/chat");
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
              type="email"
              label="Correo Electrónico"
              description="No se mostrará tu correo electrónico en tu perfil"
              isRequired
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
                  onClick={togglePasswordVisibility}
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
            />{" "}
          </div>
        </FormField>
        {message?.text && message.type === "error" ? (
          <p className="text-red-500">{message.text}</p>
        ) : message?.text && message.type === "success" ? (
          <p className="text-green-500">{message.text}</p>
        ) : null}
        {
          //#region 👌 - Sumit Button
        }
        <div className="flex justify-end mt-5">
          <Button
            type="submit"
            aria-label="Register"
            color={submitDisabled ? "default" : "success"}
            disabled={submitDisabled}
            isLoading={isSubmitting}
            endContent={<UserIcon />}
          >
            Iniciar Sesión
          </Button>
        </div>
      </form>
    </Container>
  );
}
