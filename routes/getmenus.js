const Promise = require('bluebird');
const caffeterias = require('../data/caffeterias.json');
const scrapeMensa = require('../helpers/scrapeMensa');
const fetch = require('node-fetch');

function bindRoute(app) {
  app.post('/getmenus', function (req, res) {
  	let keys = req.body.text.split(' ');
    const caffeteriaKeys = Object.keys(caffeterias);

    if(req.body.text === '') {
      keys = ['eth', 'asia', 'foodnlab'];
    }

    let unknownKeys = [];
    for(let i = 0; i < keys.length; i++) {
      if(caffeteriaKeys.indexOf(keys[i]) < 0) {
        unknownKeys.push(keys[i]);
      }
    }

    if(unknownKeys.length > 0) {
      res.json({
        response_type: 'ephemeral',
        text: `I don't recognize these keys: ${unknownKeys.join(', ')}. Supported keys are: ${caffeteriaKeys.join(', ')}.`
      })
    } else {
    	res.json({
        response_type: 'ephemeral',
        text: 'Just a second while I check the menus...'
      });

      Promise.map(keys, scrapeMensa).then((mensas) => {
        const attachments = mensas.map((e) => {
          return {
            title: `<${e.link}|${e.name}>`,
            text: e.menu.map((item) => `*${item.menu}*: ${item.dish}`).join('\n\n')
          }
        });

        const message = {
          response_type: 'in_channel',
          text: 'Bon appetit!',
          attachments
        };

        fetch(req.body.response_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });
      });
    }
  });
}

module.exports = bindRoute;
