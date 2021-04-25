console.log('+router');

const Router = require('express');
const controller = require('./controller.js');
const model = require('./model.js');

const testRouter = Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Server is working.');
  }
);

module.exports = testRouter;