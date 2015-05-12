#!/usr/bin/node

var lunr = require("../js/lunr.min.js")
var idx = lunr(function () {
	this.field('title', { boost: 10 })
	this.field('body')
})
var doc = {
    "title": "Twelfth-Night",
    "body": "If music be the food of love, play on: Give me excess of it…",
    "author": "William Shakespeare",
    "id": 1
}
idx.add(doc)
var rawIndex = JSON.stringify(idx.toJSON())
console.log(rawIndex)
idx = lunr.Index.load(JSON.parse(rawIndex))
console.log(idx.search('love'))
