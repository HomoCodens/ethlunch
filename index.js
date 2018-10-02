const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const bindGetMenus = require('./routes/getmenus');
const scr = require('./helpers/scrapeMensa');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.post('/', function (req, res) {
  console.log('GOT ONE!!!');
  res.send('hello world');
});

bindGetMenus(app);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
