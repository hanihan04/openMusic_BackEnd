const Joi = require('joi');
 
const UserPayloadSchema = Joi.object({
  username: Joi.string().max(x).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});
 
module.exports = { UserPayloadSchema };