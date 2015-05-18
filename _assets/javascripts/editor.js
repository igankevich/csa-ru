var modelist = ace.require("ace/ext/modelist")
var github
var repo
var editor
$(function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/text");
	$('#form').submit(function (e) {
		console.log("QQ");
		e.preventDefault()
		var formData = {}
		$.each($('#form').serializeArray(), function (i, field) {
			formData[field.name] = field.value
		})
		var username = formData['username']
		github = new Github({
			username: username,
			password: formData['password'],
			auth: 'basic'
		});	
		repo = github.getRepo(username, 'igankevich');
		repo.show(function(err, repo) {
			console.log(err);
			console.log(repo);
		});
		$('#root').on('activate_node.jstree', function (e, obj) {
			console.log('Clicked')
			console.log(obj)
			var filePath = obj.node.data.path
			repo.read('master', filePath, function(err, data) {
				if (!err) {
					var mode = modelist.getModeForPath(filePath).mode
					if (mode) {
						editor.session.setMode(mode)
					} else {
    					editor.getSession().setMode("ace/mode/text");
					}
					editor.setValue(data)
					editor.clearSelection()
				} else {
					console.log('Error: ' + err)
				}
			});
		})
		.on('move_node.jstree', function (e, obj) {
			console.log('Move node')
			console.log(obj)
		})
		.jstree({
			core: {
				data: function (node, callback) {
					console.log('Node')
					console.log(node)
					repo.contents('master', './' + (node.data ? node.data.path : ''), function(err, contents) {
						console.log('Error')
						console.log(err);
						console.log('Contents')
						console.log(contents)
						var nodes = $.map(contents, function (val) {
							return {
								text: val.name,
								children: val.type == 'dir',
								data: val,
								icon: '/qqq/assets/jstree/' + (val.type == 'dir' ? 'folder.png' : 'file.png')
							}
						})
						console.log('Nodes')
						console.log(nodes)
						callback(nodes)
					})
				},
				check_callback : true
			},
			plugins: ["unique", "wholerow", "dnd"],
			themes: {
				name: "default",
				responsive: true,
				variant: "responsive",
				dots: true,
				icons: true
			}
		})
	});
})
