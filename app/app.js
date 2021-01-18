import express from 'express';
import config from './config';
import routes from './Controllers/routes';
import bodyParser from 'body-parser';
import cors from 'cors';
var path = require('path');
const app = express();
const frontPath = path.join(__dirname, '..', 'site', 'index.html')
app.use(express.static('site'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
//Middleware to avoid the favicon error
app.use( function(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }
  return next();
});

routes(app)
app.get('/*', (req, res) => {
  res.sendFile(frontPath);
})

app.listen(config.port, () => {
    console.info(`Server is running at ${config.port}`)
  });