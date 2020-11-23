import express from 'express';
import config from './config';
import routes from './Controllers/routes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

routes(app)

app.listen(config.port, () => {
    console.info(`Server is running at ${config.port}`)
  });