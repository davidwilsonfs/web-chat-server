import { Router } from 'express';
import * as messageController from './message.controller';
import { registerBodyvalidator } from './message.validator';
import { authorized } from '../../core/security/auth-strategy.security';

const messageRouter = Router();

/**
 * @swagger
 * /messages/user/{username}:
 *   get:
 *     summary: Retorna todos as messagens do usuário em um canal
 *     description: Retorna todas as menssagens do canal em que o usuário está inserido desde o seu tempo de entrada nele
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: username
 *         description: Nome do usuario
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all
 */
messageRouter.get('/user/:username', authorized, messageController.getMessagesByUser);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Insere uma mensagem no chat de conversas
 *     description: Insere um nova mensagem na base de dados com informações do usuário e do canal
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: message
 *         description: Nome.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: username
 *         description: nome do usuário.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: aliasChannel
 *         description: nome do canal
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
messageRouter.post('/', registerBodyvalidator, authorized, messageController.insertMessage);

export default messageRouter;
