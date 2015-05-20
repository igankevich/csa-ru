$(function () {
	console.log('Admin')
	if (localStorage['github.username']) {
		console.log('Have username')
		$('.admin').show()
	}
})
