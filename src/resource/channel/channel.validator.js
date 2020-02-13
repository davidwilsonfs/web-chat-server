import { body } from 'express-validator/check';

const registerBodyvalidator = [
  body('alias')
    .exists()
    .withMessage('Alias é um campo obrigatório.')
    .isString()
    .withMessage('Deve ser uma string.'),
];

export { registerBodyvalidator };
