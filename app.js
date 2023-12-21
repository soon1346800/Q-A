import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());

app.use('/', router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`서버가 정상적으로 구동되었습니다. ${port}`);
});
