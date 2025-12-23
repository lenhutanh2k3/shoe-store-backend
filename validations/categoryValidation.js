import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .max(50)
    .messages({
      'string.base': 'Tên danh mục phải là chuỗi ký tự',
      'string.empty': 'Tên danh mục không được để trống',
      'any.required': 'Vui lòng nhập tên danh mục',
      'string.max': 'Tên danh mục không được quá 50 ký tự'
    }),
  description: Joi.string()
    .max(500)
    .allow('') 
    .messages({
      'string.max': 'Mô tả không được quá 500 ký tự'
    })
});
export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).messages({
    'string.max': 'Tên danh mục không được quá 50 ký tự'
  }),
  description: Joi.string().max(500).allow('')
});