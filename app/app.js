import express from 'express';
import config from './config';
import routes from './REST/routes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
