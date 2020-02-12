import { Router } from 'express';
import * as imagesController from './images.controller';

const imagesRouter = Router();

/**
 * @swagger
 * /images/{amount}:
 *   get:
 *     summary: Retorna um conjunto de imagens
 *     description: Retorna um conjunto de imagens pela quantidade passada pelo parâmetro
 *     tags:
 *       - Images
 *     parameters:
 *       - name: amount
 *         description: quantidade de imagens
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: informa se o username está disponivel
 *       400:
 *         description: Bad Request
 */
imagesRouter.get('/:amount', imagesController.getImages);

export default imagesRouter;
