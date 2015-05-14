(function() {
	var table = {
		'а': 'a',
		'б': 'b',
		'в': 'v',
		'г': 'g',
		'д': 'd',
		'е': 'e',
		'ё': 'e',
		'ж': 'zh',
		'з': 'z',
		'и': 'i',
		'й': 'i',
		'к': 'k',
		'л': 'l',
		'м': 'm',
		'н': 'n',
		'о': 'o',
		'п': 'p',
		'р': 'r',
		'с': 's',
		'т': 't',
		'у': 'u',
		'ф': 'f',
		'х': 'kh',
		'ц': 'tc',
		'ч': 'ch',
		'ш': 'sh',
		'щ': 'shch',
		'ъ': '',
		'ы': 'y',
		'ь': '',
		'э': 'e',
		'ю': 'iu',
		'я': 'ia'
	}

	var inverseTable = [
		['shch', 'щ'],
		['kh', 'х'],
		['tc', 'ц'],
		['ch', 'ч'],
		['sh', 'ш'],
		['zh', 'ж'],
		['iu', 'ю'],
		['yu', 'ю'],
		['ia', 'я'],
		['ya', 'я'],
		['iy', 'ий'],
		['a', 'а'],
		['b', 'б'],
		['c', 'си'],
		['d', 'д'],
		['e', 'е'],
		['f', 'ф'],
		['g', 'г'],
		['h', 'х'],
		['i', 'и'],
		['j', 'дж'],
		['k', 'к'],
		['l', 'л'],
		['m', 'м'],
		['n', 'н'],
		['o', 'о'],
		['p', 'п'],
		['q', 'кв'],
		['r', 'р'],
		['s', 'с'],
		['t', 'т'],
		['u', 'у'],
		['v', 'в'],
		['w', 'в'],
		['x', 'кс'],
		['y', 'и'],
		['z', 'з']
	]

	var convert = function(text, tab) {
		var t = text.toLowerCase()
		var result = ""
		for (var i=0; i<t.length; ++i) {
			var ch = t.charAt(i)
			if (ch in tab) {
				ch = tab[ch]
			}
			result += ch
		}
		return result
	}

	var tr = {}
	tr.romanise = function (text) {
		return convert(text, table)
	}

	tr.cyrillise = function (text) {
		var t = text.toLowerCase()
		for (var i=0; i<inverseTable.length; ++i) {
			t = t.replace(new RegExp(inverseTable[i][0], "g"), inverseTable[i][1])
		}
		return t
	}

	;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.tr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return tr
  }))
})()
