#!/usr/bin/nodejs

var tr = require("../_assets/javascripts/romanise.js")

var text = [
	"СРАВНЕНИЕ ЭФФЕКТИВНОСТИ ПРИМЕНЕНИЯ MPI И OPENCL ДЛЯ ГЕНЕРАЦИИ ВОЛНОВОЙ ПОВЕРХНОСТИ",
	"korkhov",
	"gankevich",
	"degtyarev",
	"let me speak from my heart"
]
for (var i=0; i<text.length; ++i) {
	var t = text[i]
	console.log(tr.romanise(t))
	console.log(tr.cyrillise(t))
}
