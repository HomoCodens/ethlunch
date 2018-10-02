const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'https://www.ethz.ch/de/campus/erleben/gastronomie-und-einkaufen/gastronomie/menueplaene/offerDay.html?language=de&date=2018-09-26&id=12';

fetch(url)
  .then((r) => r.text())
  .then((body) => cheerio.load(body))
  .then(($) => $('tbody').eq(1).children('tr').not('.details').map((i, e) => {
      const cols = $(e).children('td');
      let dishCol = cols.eq(1);
      dishCol.find('br').replaceWith('\n');
      dishCol.find('a').replaceWith('');
      return {
        menu: cols.eq(0).text(),
        dish: dishCol.text(),
        price: cols.eq(2).text()
      }
    }).get()
  )
  .then((stuff) => console.log(stuff));
