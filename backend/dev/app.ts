import cors from 'cors';
import express from 'express';
import { router } from './router.js';

const app = express();

const defaultPort:number = parseInt(process.env.PORT || '');
const port:number = defaultPort || 5500;

app.use(cors());
app.use('/', router);

app.listen(port, () => {
  console.log(`App is working at http://localhost:${port}`);
});
