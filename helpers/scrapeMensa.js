const fetch = require('node-fetch');
const cheerio = require('cheerio');
const caffeterias = require('../data/caffeterias.json');

function scrapeMensa(id) {
  const todayDate = new Date();
  const yyyy = todayDate.getFullYear();
  let mm = todayDate.getMonth() + 1;
  let dd = todayDate.getDate();
  if(dd < 10) {
    dd = '0' + dd;
  }
  if(mm < 10) {
    mm = '0' + mm;
  }
  const todayString = yyyy + '-' + mm + '-' + dd;

  const url = `https://www.ethz.ch/de/campus/erleben/gastronomie-und-einkaufen/gastronomie/menueplaene/offerDay.html?language=de&date=${todayString}&id=${caffeterias[id].id}`;

  return fetch(url)
    .then((r) => r.text())
    .then((body) => cheerio.load(body))
    .then(($) => {
      const menu = $('tbody')
        .eq(1)
        .children('tr')
        .not('.details')
        .map((i, e) => {
            const cols = $(e).children('td');
            let dishCol = cols.eq(1);
            dishCol.find('br').replaceWith(' ');
            dishCol.find('a').replaceWith('');
            return {
              menu: cols.eq(0).text(),
              dish: dishCol.text(),
              price: cols.eq(2).text()
            }
          })
          .get()
        return {
          link: url,
          name: caffeterias[id].name,
          menu
        };
    });
}

module.exports = scrapeMensa;
