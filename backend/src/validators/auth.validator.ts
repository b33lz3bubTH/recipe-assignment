import { Joi, Segments } from 'celebrate';

export const registerSchema = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
};

export const loginSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
};

export const refreshSchema = {
  [Segments.BODY]: Joi.object().keys({
    refreshToken: Joi.string().required(),
  })
};

export const verifySchema = {
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required(),
  })
}; 