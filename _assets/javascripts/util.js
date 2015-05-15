// disable empty links
$(function() {
	$("a[href='']").each(function () {
		$(this).click(function (e) {
			console.log(e.type)
			e.preventDefault()
		})
	})
})
