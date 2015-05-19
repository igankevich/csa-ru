var modelist = ace.require("ace/ext/modelist")
var repo
var editor
var root
var makePath = function(p, n) { return (p ? p + '/' : '') + n }
var move = function(from, to, is_dir) {
	if (from != to) {
		console.log('Moving file from ' + from + ' to ' + to)
		if (is_dir) {
			lock('Moving directory...')
			repo.moveDir('master', from, to, function (err) {
				if (err) {
					console.log('Error moving directory from ' + from + ' to ' + to)
					console.log(err)
				}
				root.refresh()
				unlock()
			})
		} else {
			lock('Moving file...')
			repo.move('master', from, to, function (err) {
				if (err) {
					console.log('Error moving file from ' + from + ' to ' + to)
					console.log(err)
				}
				root.refresh()
				unlock()
			})
		}
	}
}
var loginForm
var fileWasModified = false
var selectedNode
var lockAllFiles = false
var progressBar
var editorState = {}
function parseQueryString() {
    var query = (location.search || '?').substr(1),
        map   = {};
    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
        (map[key] = map[key] || []).push(value);
    });
    return map;
}
function navigateToFile(file, level) {
	var comp = file.split('/')
	if (level < comp.length) {
		var path = comp.slice(0, level + 1).join('/')
		var node = root.get_node(path)
		console.log('Loading ' + path)
		root.open_node(node, function (n, st) {
			console.log('Loaded')
			console.log(n)
			console.log(st)
		})
	}
}
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
function lock(text) {
	lockAllFiles = true
	if (!progressBar) {
		progressBar = $('#progress-bar').progressbar({value: false})
	} else {
		progressBar.show()
	}
}
function unlock() {
	$('#progress-bar').hide()
	lockAllFiles = false
}
function saveFile() {
	if (selectedNode && fileWasModified) {
		var dir = root.get_node(selectedNode.parent)
		var filePath = selectedNode.data.path
		var fileContents = editor.getValue()
		lock('Saving file...')
		repo.write('master', filePath, fileContents, 'Edited ' + filePath, function (err) {
			root.refresh_node(dir)
			unlock()
			if (err) {
				console.log('Error editing file ' + filePath)
				console.log(err)
			} else {
				fileWasModified = false
			}
		})
	}
}
function saveEditorState() {
	if (selectedNode) {
		var filePath = selectedNode.data.path
		editorState[filePath] = editor.getSelectionRange()
	}
}
function restoreEditorState() {
	if (selectedNode) {
		var filePath = selectedNode.data.path
		var st = editorState[filePath]
		if (st) {
			editor.scrollToLine(st.start.row, true, false, function () {});
			editor.gotoLine(st.start.row+1, st.start.column)
		} else {
			editor.gotoLine(1)
		}
	}
}
$(function () {
	$('button').button()
	$('#save').click(saveFile)
	loginForm = $('#login-form').dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true
	})
	loginForm.dialog('open')
	confirmSave = $('#confirm-save').dialog({
		autoOpen: false,
		resizable: false,
		height: 240,
		modal: true,
		buttons: {
			"Save file": function() {
				console.log('Saving file')
				saveFile()
				$(this).dialog("close");
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	})
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
				if (fileWasModified) {
					confirmSave.dialog('open')
				} else {
					lock('Reading file...')
					saveEditorState()
					repo.read('master', filePath, function(err, data) {
						if (!err) {
							if (!editor) {
							    editor = ace.edit("editor");
							    editor.setTheme("ace/theme/github");
							    editor.setFontSize(16);
							    editor.getSession().setMode("ace/mode/text");
								$("#editor").resizable();
							}
							var mode = modelist.getModeForPath(filePath).mode
							if (mode) {
								editor.session.setMode(mode)
							} else {
    							editor.getSession().setMode("ace/mode/text");
							}
							editor.setValue(data)
							editor.clearSelection()
							fileWasModified = false
							editor.on('change', function (e) {
								fileWasModified = true
							})
							editor.focus()
							selectedNode = obj.node
							restoreEditorState()
						} else {
							console.log('Error: ' + err)
						}
						unlock()
					});
				}
			}
		})
		.on('loaded.jstree', function (e, obj) {
			var file = parseQueryString().file
			console.log('File=')
			console.log(parseQueryString())
			console.log(file)
			if (file) {
				navigateToFile(file[0], 0);
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
			move(from, to, obj.node.data.type === 'dir')
		})
		.on('rename_node.jstree', function (e, obj) {
			if (obj.node.data.sha) {
				// existing file
				var dir = root.get_node(obj.node.parent)
				var from = makePath(dir.data.path, obj.old)
				var to = makePath(dir.data.path, obj.text)
				move(from, to, obj.node.data.type === 'dir')
			} else {
				if (obj.node.data.type === 'dir') {
					var to = makePath(dir.data.path, obj.text)
					obj.node.data.path = to
				} else {
					// new file
					var dir = root.get_node(obj.node.parent)
					var filePath = makePath(dir.data.path, obj.text)
					lock('Creating file...')
					repo.write('master', filePath, '', 'Created ' + filePath, function (err) {
						root.refresh_node(dir)
						unlock()
						if (err) {
							console.log('Error creating file ' + filePath)
							console.log(err)
						}
					})
				}
			}
		})
		.on('delete_node.jstree', function (e, obj) {
			var dir = root.get_node(obj.node.parent)
			var filePath = obj.node.data.path
			if (obj.node.data.type === 'dir') {
				console.log('Removing dir ' + filePath)
				lock('Removing directory...')
				repo.removeDir('master', filePath, function (err) {
					root.refresh_node(dir)
					unlock()
					if (err) {
						console.log('Error removing directory ' + filePath)
						console.log(err)
					}
				})
			} else {
				lock('Removing file...')
				repo.remove('master', filePath, function (err) {
					root.refresh_node(dir)
					unlock()
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
					if (!(node.data && node.data.tmp)) {
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
					} else {
						callback([])
					}
				},
				check_callback: function (op, node, par) {
					return !lockAllFiles && (par.data && par.data.type === 'dir')
				}
			},
			plugins: ["unique", "wholerow", "dnd", "contextmenu", 'sort'],
			sort: function (a, b) {
				var x = root.get_node(a)
				var y = root.get_node(b)
				return x.data && x.data.type && x.data.type !== y.data.type
					? x.data.type.localeCompare(y.data.type)
					: x.text.localeCompare(y.text)
			},
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
										type: 'dir',
										tmp: true
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
