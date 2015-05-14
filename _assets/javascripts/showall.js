$(function() {
	$('#archive').toggle(false)
	$("#show-all").click(function (e) {
		$('#archive').toggle(true)
		$("#show-all").remove()
		e.preventDefault()
	})
})
