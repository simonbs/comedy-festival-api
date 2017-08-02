const Xray = require('x-ray');
const moment = require('moment')
moment.locale('da-DK')

let Scraper = function() {
  this.x = Xray({
    filters: {
      price: value => {
        let matches = value.match(/\d+/g)
        if (matches == null || matches.length == 0) {
          return null
        }
        return parseInt(matches[0])
      },
      is_sold_out: value => {
        return value == "udsolgt"
      },
      parse_date: value => {
        return moment(value, 'ddd DD MMM HH:mm')
      }
    }
  })
  this.url = 'http://zulu.tv2.dk/zulu-comedy-festival/showliste'
}

Scraper.prototype.scrape = async function() {
  let scraper = this
  return new Promise((resolve, reject) => {
    let template = [{
      name: 'h2',
      shows: scraper.x('article.zcf-show', [{
        image_url: 'figure picture source@data-srcset',
        headline: 'div.zcf-show_body h3.zcf-show_headline',
        subheadline: 'div.zcf-show_body p.zcf-show_subheadline',
        venue: 'div.zcf-show_body div.zcf-show_content li:first-child',
        date: 'div.zcf-show_body div.zcf-show_content li:nth-child(2) | parse_date',
        price: 'div.zcf-show_body div.zcf-show_content li:nth-child(3) | price',
        more_info_url: 'div.zcf-show_body div.zcf-show_content div.zcf-show_content_cta a.zcf-link@href',
        ticket_url: 'div.zcf-show_body div.zcf-show_content div.zcf-show_content_cta a.zcf-cta@href',
        is_sold_out: 'div.zcf-show_body div.zcf-show_content div.zcf-show_content_cta span.zcf-cta | is_sold_out'
      }])
    }]
    scraper.x(scraper.url, 'section.u-space_single', template)((err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

Scraper.prototype.convertToShowsList = function(locations) {
  let shows = []
  locations.forEach(l => {
    l.shows.forEach(s => {
      s.location = l.name
      shows.push(s)
    })
  })
  return shows
}

module.exports = Scraper

