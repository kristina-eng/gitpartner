const Joi = require("@hapi/joi");


// проверка на валидность регистрации
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    org: Joi.string().min(4).required(),
    inn: Joi.string().min(6).required(),
    kpp: Joi.string().min(6).required(),
    ogrn: Joi.string().min(6).required(),
    ua: Joi.string().min(6).required(),
    phone: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};


// проверка на валидность авторизации
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
