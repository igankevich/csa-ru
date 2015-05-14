$(document).on('copy', function(e) {
	var savedSel = rangy.saveSelection();
	var sel = window.getSelection();
	var src = document.documentElement.lang == 'ru' ? 'Источник' : 'Source';
	var copyFooter = '<br/><br/>'
		+ src + ': ' + document.title + ' &mdash; <a href="'
		+ document.location.href + '">'
		+ document.location.href + '</a>';
	var copyHolder = $('<div>', {html: sel+copyFooter, style: {position: 'absolute', left: '-99999px'}});
	$('body').append(copyHolder);
	sel.selectAllChildren(copyHolder[0]);
	window.setTimeout(function() {
		rangy.restoreSelection(savedSel);
	    copyHolder.remove();
	}, 0);
});
