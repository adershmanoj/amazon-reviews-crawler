'use strict'
var Nightmare = require('nightmare'),
  nightmare = Nightmare(),
  vo = require('vo'); // to pipeline multiple requests
const randomUa = require('random-ua')
const evalFunction = require('amazon-reviews-crawler-eval')

const defaultOptions = {
	page: 'https://www.amazon.com/product-reviews/{{asin}}/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber={{pageNumber}}&sortBy=recent',
	stopAtReviewId: false
}

module.exports = (asin, opt) => {
	return new Promise((resolve, reject) => {
		opt = Object.assign({}, defaultOptions, opt)
        opt.page = opt.page.replace('{{asin}}', asin);
        var title;
        var run = function*(){
          var results = [];
          for(var i=1; i<5; i++){
            var result = yield nightmare.useragent(randomUa.generate()).goto(opt.page.replace('{{pageNumber}}', i)).evaluate(evalFunction, opt);
            results = results.concat(result.reviews); 
            title = result.title;
          }
          return results;
        }
        vo(run)(function(err, results){
          resolve({'title': title, 'reviews': results})
          reject(err)
        });
//		new Nightmare()
//			.useragent(randomUa.generate())
//			.goto(opt.page.replace('{{pageNumber}}', 1))
//			.evaluate(evalFunction, opt)
//			.then(resolve)
//			.catch(reject)
	})
}
