import Joi from 'joi';

export const createBrandSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .max(50)
    .messages({
      'string.base': 'Tên thương hiệu phải là chuỗi ký tự',
      'string.empty': 'Tên thương hiệu không được để trống',
      'any.required': 'Vui lòng nhập tên thương hiệu',
      'string.max': 'Tên thương hiệu không được quá 50 ký tự'
    }),
  description: Joi.string()
    .max(500)
    .allow('') 
    .messages({
      'string.max': 'Mô tả không được quá 500 ký tự'
    })
});
export const updateBrandSchema = Joi.object({
  name: Joi.string().trim().max(50).messages({
    'string.max': 'Tên thương hiệu không được quá 50 ký tự'
  }),
  description: Joi.string().max(500).allow('')
});