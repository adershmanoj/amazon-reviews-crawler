'use strict'
const reviewsCrawler = require('./app.js')
reviewsCrawler('0062472100')
	.then(console.log)
	.catch(console.error)