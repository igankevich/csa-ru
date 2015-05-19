var modelist = ace.require("ace/ext/modelist")
var repo
var editor
var root
var makePath = function(p, n) { return (p ? p + '/' : '') + n }
var move = function(from, to) {
	if (from != to) {
		console.log('Moving file from ' + from + ' to ' + to)
		repo.move('master', from, to, function (err) {
			console.log('Error moving file from ' + from + ' to ' + to)
			console.log(err)
			root.refresh()
		})
	}
}
var loginForm
function saveCredentials(username, passw) {
	localStorage['github.username'] = username
	localStorage['github.password'] = passw
}
function restoreCreds(username, passw) {
	if (localStorage['github.username']) {
		$('input[name=username]').val(localStorage['github.username'])
		$('input[name=password]').val(localStorage['github.password'])
		return true
	}
	return false
}
$(function () {
	$('button').button()
	loginForm = $('#login-form').dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true
	})
	loginForm.dialog('open')
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/github");
    editor.setFontSize(16);
    editor.getSession().setMode("ace/mode/text");
	$('#form').submit(function (e) {
		loginForm.dialog('close')
		console.log("QQ");
		e.preventDefault()
		var formData = {}
		$.each($('#form').serializeArray(), function (i, field) {
			formData[field.name] = field.value
		})
		var username = formData['username']
		var password = formData['password']
		saveCredentials(username, password)
		var github = new Github({
			username: username,
			password: password,
			auth: 'basic'
		});	
		repo = github.getRepo(username, 'igankevich');
		repo.show(function(err, repo) {
			console.log(err);
			console.log(repo);
		});
		$('#root').on('activate_node.jstree', function (e, obj) {
			if (obj.node.data.type === 'file') {
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
			}
		})
		.on('move_node.jstree', function (e, obj) {
//			console.log('move node')
//			console.log(obj)
			var old_dir = root.get_node(obj.old_parent)
			var new_dir = root.get_node(obj.parent)
			if (new_dir.data.type !== 'dir') {
				new_dir = root.get_node(new_dir.parent)
			}
			var from = makePath(old_dir.data.path, obj.node.data.name)
			var to = makePath(new_dir.data.path, obj.node.data.name)
			move(from, to)
		})
		.on('rename_node.jstree', function (e, obj) {
			if (obj.node.data.sha) {
				// existing file
				var dir = root.get_node(obj.node.parent)
				var from = makePath(dir.data.path, obj.old)
				var to = makePath(dir.data.path, obj.text)
				move(from, to)
			} else {
				// new file
				var dir = root.get_node(obj.node.parent)
				var filePath = makePath(dir.data.path, obj.text)
				repo.write('master', filePath, '', 'Created ' + filePath, function (err) {
					root.refresh_node(dir)
					if (err) {
						console.log('Error creating file ' + filePath)
						console.log(err)
					}
				})
			}
		})
		.on('delete_node.jstree', function (e, obj) {
			var dir = root.get_node(obj.node.parent)
			var filePath = obj.node.data.path
			if (obj.node.data.type === 'dir') {
				console.log('Removing dir ' + filePath)
				repo.removeDir('master', filePath, function (err) {
					root.refresh_node(dir)
					if (err) {
						console.log('Error removing directory ' + filePath)
						console.log(err)
					}
				})
			} else {
				repo.remove('master', filePath, function (err) {
					root.refresh_node(dir)
					if (err) {
						console.log('Error removing file ' + filePath)
						console.log(err)
					}
				})
			}
		})
//		.on('create_node.jstree', function (e, obj) {
//			var filePath = root.get_path(obj.node.id, '/')
//			obj.node.data = { path: filePath }
//			console.log('Creating file ' + filePath)
//		})
		.on('paste.jstree', function (e, obj) {
			$.each(obj.node, function (i, node) {
				var filePath = node.data.path
				if (obj.mode == 'copy_node') console.log('Copying file ' + filePath)
				if (obj.mode == 'move_node') console.log('Moving file ' + filePath)
			})
		})
		.on('refresh_node.jstree', function (e, obj) {
			if (obj.node.id === '#') {
				obj.node.data = {
					path: '',
					type: 'dir'
				}
			}
		})
		.on('refresh.jstree', function (e, obj) {
			root.get_node('#').data = {
				path: '',
				type: 'dir'
			}
		})
		.jstree({
			core: {
				data: function (node, callback) {
					console.log('Node')
					console.log(node)
					repo.contents('master', (node.data ? node.data.path : ''), function(err, contents) {
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
				check_callback: function (op, node, par) {
					return par.data && par.data.type === 'dir'
				}
			},
			plugins: ["unique", "wholerow", "dnd", "contextmenu"],
			contextmenu: {
				items: function (par) {
					console.log('Parent')
					console.log(par)
					return {
						createFile: {
							label: "New file",
							action: function (data) {
								var parent = par.data.type === 'dir' ? par : root.get_node(par.parent)
								var fileName = "newfile-" + new Date().getTime()
								var node = {
									text: fileName,
									icon: '/qqq/assets/jstree/file.png',
									children: false,
									data: {
										path: makePath(parent.data.path, fileName),
										type: 'file'
									}
								}
		                        root.create_node(parent, node, "last", function (new_node) {
		                            setTimeout(function () { root.edit(new_node); }, 0);
		                        });
							}
						},
						createDir: {
							label: "New folder",
							action: function (data) {
								var parent = par.data.type === 'dir' ? par : root.get_node(par.parent)
								var fileName = "newdir-" + new Date().getTime()
								var node = {
									text: fileName,
									icon: '/qqq/assets/jstree/folder.png',
									children: true,
									data: {
										path: makePath(parent.data.path, fileName),
										type: 'dir'
									}
								}
		                        root.create_node(parent, node, "last", function (new_node) {
		                            setTimeout(function () { root.edit(new_node); }, 0);
		                        });
							}
						},
						rename: {
							label: "Rename",
							action: function (data) {
								var node = root.get_node(par)
								root.edit(node)
							}
						},
						remove: {
							label: "Delete",
							action: function (data) {
								var node = root.get_node(par)
								if (root.is_selected(node)) {
		                            root.delete_node(root.get_selected());
								} else {
		                            inst.delete_node(node);
								}
							}
						}
					}
				}
			},
			themes: {
				name: "default",
				responsive: true,
				variant: "responsive",
				dots: true,
				icons: true
			}
		})
		root = $('#root').jstree(true)
		root.get_node('#').data = {
			path: '',
			type: 'dir'
		}
	});
	if (restoreCreds()) {
		$('#form').submit()
	}
})
