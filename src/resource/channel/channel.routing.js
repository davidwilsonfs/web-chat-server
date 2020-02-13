import { Router } from 'express';
import * as channelController from './channel.controller';
import { registerBodyvalidator } from './channel.validator';
import { authorized } from '../../core/security/auth-strategy.security';

const channelRouter = Router();
/**
 * @swagger
 * /channels:
 *   get:
 *     summary: Retorna todos os canais
 *     description: Retorna todos os canais que estão disponiveis no sistema
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Channels
 *     responses:
 *       200:
 *         description: list of all
 */
channelRouter.get('/', authorized, channelController.getChannels);

/**
 * @swagger
 * /channels/{alias}:
 *   get:
 *     summary: Retorna o channel
 *     description: Retorna o canal pelo seu alias
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Channels
 *     parameters:
 *       - name: alias
 *         description: Nome.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
channelRouter.get('/:alias', authorized, channelController.getChannel);

/**
 * @swagger
 * /channels:
 *   post:
 *     summary: Insere um canal no sistema
 *     description: Insere um novo canal na base de dados
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Channels
 *     parameters:
 *       - name: alias
 *         description: nome do canal.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
channelRouter.post('/', authorized, registerBodyvalidator, channelController.createChannel);

/**
 * @swagger
 * /channels/{alias}:
 *   delete:
 *     summary: Remove o channel
 *     description: Remove o channel da lista de canais pelo seu alias
 *     security:
 *       - UserAuth: []
 *     tags:
 *       - Channels
 *     parameters:
 *       - name: alias
 *         description: Nome.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
channelRouter.delete('/:alias', authorized, channelController.deleteChannel);

export default channelRouter;
