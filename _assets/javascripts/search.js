var docs = {}
var docIndex
$(document).ready(function () {
	Ractive.DEBUG = false;
	$.getJSON('/docs-index.json', function (data) {
		console.log('Downloaded index')
		$.each(data.docs, function (i, val) {
			docs[val.id] = val
		})
		docIndex = lunr.Index.load(data.index);
		lunr.ru.call(docIndex)
	});
	$('#qsearch').click(function() {
		var keyword = $('#q').val()
		if (keyword.length >= 2) {
			var result = docIndex.search(tr.romanise(keyword))
			$.merge(result, docIndex.search(tr.cyrillise(keyword)))
			var years = {}
			$.each(result, function (i, val) {
				val.doc = docs[val.ref]
				if (years[val.doc.year]) {
					years[val.doc.year].push(val)
				} else {
					years[val.doc.year] = [val]
				}
			})
			var arr = []
			$.each(years, function (i, val) {
				arr.push({items: val, year: Number(i)})
			})
			arr.sort(function (a,b) { return b.year - a.year })
			var ractive = new Ractive({
				el: '#results',
				template: '#template',
				data: { results: arr }
			});
			$('#results-page').pajinate({
				item_container_id: "#results",
				nav_panel_id: "#results-nav",
				abort_on_small_lists: true,
				show_first_last: false,
				items_per_page: 7
			})
		}
	});
});
