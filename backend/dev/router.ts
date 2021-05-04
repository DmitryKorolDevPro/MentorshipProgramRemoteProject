import Router from 'express';
import { Controller } from './controller.js';
import { ResponseObj } from './controller.js';

const router = Router();
const controller = new Controller();

router.get('/api/sneakers', async (req, res) => {
  let response: ResponseObj = await controller.getAllItems();
  res.status(response.statusCode).send(response.result);
});

router.get('/api/sneakers/:page', async (req, res) => {
  let response: ResponseObj = await controller.getItems(req.params.page);
  res.status(response.statusCode).send(response.result);
});

router.get('/api/sneakers/check/:_page', async (req, res) => {
  let response: boolean = controller.checkIfPageExists(req.params._page);
  res.status(200).send(response);
});

export { router };