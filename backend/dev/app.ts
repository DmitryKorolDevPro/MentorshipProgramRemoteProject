import cors from 'cors';
import express from 'express';
import { router } from './router.js';

const app = express();
let port:number = process.env.PORT === undefined ? 5500 : +process.env.PORT;

app.use(cors())
app.use('/', router);

app.listen(port, () => {
  console.log(`App is working at http://localhost:${port}.`)
});