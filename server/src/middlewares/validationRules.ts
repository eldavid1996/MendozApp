import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }
  return next();
};

export const registerValidationRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 255 })
      .withMessage("Username must be less than 255 characters")
      .trim()
      .escape(),
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ max: 255 })
      .withMessage("Email must be less than 255 characters")
      .isEmail()
      .withMessage("Invalid email address")
      .trim()
      .escape(),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .isLength({ max: 255 })
      .withMessage("Password must be less than 255 characters")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&#]/)
      .withMessage("Password must contain at least one special character")
      .trim()
      .escape(),
    (req: Request, res: Response, next: NextFunction) => {
      validateResult(req, res, next);
    },
  ];
};

export const loginValidationRules = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ max: 255 })
      .withMessage("Email must be less than 255 characters")
      .isEmail()
      .withMessage("Invalid email address")
      .trim()
      .escape(),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .isLength({ max: 255 })
      .withMessage("Password must be less than 255 characters")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&#]/)
      .withMessage("Password must contain at least one special character")
      .trim()
      .escape(),
    (req: Request, res: Response, next: NextFunction) => {
      validateResult(req, res, next);
    },
  ];
};
