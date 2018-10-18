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

const server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, () => console.log('Example app listening on port 3000!'))
