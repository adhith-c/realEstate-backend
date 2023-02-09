const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().optional(),
});

const OtpVerifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().min(6).max(6).required(),
});

const loginSchema = Joi.object({
  user: Joi.string().email().required(),
  pwd: Joi.string().min(6).required(),
});

const changeEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  oldEmail: Joi.string().email().required(),
});
const verifyEmailSchema = Joi.object({
  otp: Joi.string().min(6).max(6).required(),
  email: Joi.string().email().required(),
  oldEmail: Joi.string().email().required(),
});

const profileSchema = Joi.object({
  userData: Joi.object().required(),
  url: Joi.string().optional(),
});

const messageSchema = Joi.object({
  chatId: Joi.string().hex().length(24).required(),
  senderId: Joi.string().hex().length(24).required(),
  text: Joi.string().required(),
});
const chatSchema = Joi.object({
  senderId: Joi.string().hex().length(24),
  recieverId: Joi.string().hex().length(24),
});

const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const addPropertySchema = Joi.object({
  propertyData: {
    propertyName: Joi.string().required(),
    address: Joi.string().required(),
    price: Joi.number().required(),
    views: Joi.string().required(),
    rooms: Joi.number().required(),
    bathRooms: Joi.number().required(),
    HalfBathRooms: Joi.number().required(),
    squareFoot: Joi.number().required(),
    yearBuilt: Joi.string().required(),
    description: Joi.string().required(),
  },
  propertyType: Joi.string().required(),
  listingType: Joi.string().required(),
  url: Joi.array().items(Joi.string()).required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  zoom: Joi.number().required(),
});

const soldSchema = Joi.object({
  propertyId: Joi.string().hex().length(24).required(),
});

exports.validateSignup = validator(signupSchema);
exports.validateOtp = validator(OtpVerifySchema);
exports.validateLogin = validator(loginSchema);
exports.validateChangeEmail = validator(changeEmailSchema);
exports.validateEmailOtp = validator(verifyEmailSchema);
exports.validateProfile = validator(profileSchema);
exports.validateMessage = validator(messageSchema);
exports.validateChat = validator(chatSchema);
exports.validateAdmin = validator(adminSchema);
exports.validateProperty = validator(addPropertySchema);
exports.validateSold = validator(soldSchema);
