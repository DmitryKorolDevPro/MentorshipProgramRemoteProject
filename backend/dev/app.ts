import express from "express";
import { router } from './router.js';

const app = express();
let port:number = process.env.PORT === undefined ? 4200 : +process.env.PORT;

app.use('/', router);

app.listen(port, () => {
  console.log(`App is working at http://localhost:${port}.`)
});