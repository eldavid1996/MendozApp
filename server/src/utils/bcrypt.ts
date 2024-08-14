import { compare, hash } from "bcryptjs";

export const encrypt = async (password: string) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const verified = async (password: string, hashedPassword: string) => {
  const isCorrect = await compare(password, hashedPassword);
  return isCorrect;
};
