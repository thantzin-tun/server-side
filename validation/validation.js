const Joi = require("joi");
// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"
function registerValidation(user){
  const userValidation= Joi.object({
    name: Joi.string(),
    // address: Joi.string(),
    // phone: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  })
  return userValidation.validate(user);
}

function loginValidation(user){
  const userValidation = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
  return userValidation.validate(user);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
