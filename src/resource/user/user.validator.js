import { body } from 'express-validator/check';

const registerBodyvalidator = [
  body('username')
    .exists()
    .withMessage('Username é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
  body('urlImage')
    .exists()
    .withMessage('UrlImage é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
];

export { registerBodyvalidator };
