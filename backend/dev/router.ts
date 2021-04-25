import Router from 'express';
import { Controller } from './controller.js';

const router = Router();
const controller = new Controller();

console.log('Router is working.');

router.get('/', (req: any, res: any) => {
    res.send('Server is working.');
  }
);

export { router };