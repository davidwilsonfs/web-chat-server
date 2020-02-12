import { Router } from 'express';
import * as messageController from './message.controller';
import { registerBodyvalidator } from './message.validator';
import { authorized } from '../../core/security/auth-strategy.security';

const messageRouter = Router();

/**
 * @swagger
 * /messages/channel/{channel}:
 *   get:
 *     summary: Retorna todos as messagens de um canal
 *     description: Retorna todos os usuários que estão nos chats
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: channel
 *         description: Nome do canal
 *         in: path
 *         required: true
 *         type: string
 *       - name: limit
 *         description: Limite da quantidade de documentos por pagina
 *         in: query
 *         required: false
 *         type: string
 *       - name: page
 *         description: Pagina dos documentos
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all
 */
messageRouter.get('/channel/:channel', authorized, messageController.getMessagesByChannel);

/**
 * @swagger
 * /messages/channel/{channel}/{createdAt}:
 *   get:
 *     summary: Retorna todos as messagens de um canal
 *     description: Retorna todos os usuários que estão nos chats
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: channel
 *         description: Nome do canal
 *         in: path
 *         required: true
 *         type: string
 *       - name: createdAt
 *         description: Nome do canal
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: list of all
 */
messageRouter.get('/channel/:channel/:createdAt', authorized, messageController.getMessages);

/**
 * @swagger
 * /messages/user/{user}:
 *   get:
 *     summary: Retorna todos as messagens de um usuário
 *     description: Retorna todos os usuários que estão nos chats
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Messages
 *     parameters:
 *       - name: user
 *         description: Nome do usuario
 *         in: path
 *         required: true
 *         type: string
 *       - name: limit
 *         description: Limite da quantidade de documentos por pagina
 *         in: query
 *         required: false
 *         type: string
 *       - name: page
 *         description: Pagina dos documentos
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all
 */
messageRouter.get('/user/:user', authorized, messageController.getMessagesByUser);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Insere uma mensagem no chat de conversas
 *     description: Insere um nova mensagem na base de dados
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
 *       - name: user
 *         description: id.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: channel
 *         description: id
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
