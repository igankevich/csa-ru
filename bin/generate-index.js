#!/usr/bin/nodejs

var lunr = require("../_assets/javascripts/vendor/lunr.js")
global.lunr = lunr
require("../_assets/javascripts/vendor/lunr.ru.js")
var idx = lunr(function () {
	this.field('title', { boost: 10 })
	this.field('author'),
	this.field('year')
})
lunr.ru.call(idx)
var fs = require('fs');
var docs = JSON.parse(fs.readFileSync('_site/docs.json', 'utf8'));
for (var i=0; i<docs.length; ++i) {
	idx.add(docs[i])
}
var docsAndIndex = {
	docs: docs,
	index: idx.toJSON()
}
var raw = JSON.stringify(docsAndIndex)
fs.writeFileSync('_site/docs-index.json', raw)
//console.log(rawIndex)
//idx = lunr.Index.load(JSON.parse(rawIndex))
//console.log(idx.search('love'))
