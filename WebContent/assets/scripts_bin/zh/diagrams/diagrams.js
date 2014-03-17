var DM = {
	init: function() {
		var enterHash = window.location.hash;
		if (enterHash == "" || enterHash == "#") {
			window.location.hash = ""
		}
		$(window).bind("resize.layout", function() {
			var winH = $(window).height();
			$(".bench_layout").height(winH - 38);
			$(".content_layout").height(winH - 134);
			var mainW = $(window).width() - 200;
			if (mainW < 800) {
				mainW = 800;
				$("body").css("overflow-x", "auto")
			} else {
				$("body").css("overflow-x", "hidden")
			}
			var itemsW = $(".item_list").width() - 20;
			$(".content_layout").height(winH - 134);
			if (itemsW < 230 * 3) {
				var iconSize = Math.floor((itemsW - 32 * 3 - 20) / 3);
				$(".icon_item").find("img").css({
					width: iconSize,
					height: iconSize
				});
				$(".icon_item").find(".title").width(iconSize + 1)
			} else {
				$(".icon_item").find("img").css({
					width: "198px",
					height: "198px"
				});
				$(".icon_item").find(".title").width(200)
			}
		});
		$(window).trigger("resize.layout");
		$(".file_item").live("click", function() {
			var tar = $(this);
			$(".btn_operation").css("display", "inline-block");
			$(".item_list").find(".selected").removeClass("selected");
			tar.addClass("selected");
			var img = tar.attr("img");
			$("#thumb_img").attr("src", img);
			$("#file_info_title").text(tar.attr("tit"));
			var type = tar.attr("tp");
			if (type == "folder") {
				$("#file_info_date").parent().hide();
				$("#file_info_modify").parent().hide();
				$("#file_info_item").text(tar.attr("items")).parent().show();
				$("#colla_items").empty();
				$(".btn_operation:first").hide()
			} else {
				if (type == "chart") {
					var category = tar.attr("category");
					if (category == "bpmn") {
						$("#export_bpmn").show()
					} else {
						$("#export_bpmn").hide()
					}
					$(".btn_operation:first").show();
					$("#file_info_date").text(tar.attr("date")).parent().show();
					$("#file_info_modify").text(tar.attr("modify")).parent().show();
					$("#file_info_item").parent().hide();
					//DM.Colla.loadCollaboration()
				} else {
					if (type == "fav") {
						$("#file_info_favtime").text(tar.attr("date")).parent().show();
						$("#file_info_owner").text(tar.attr("owner")).parent().show();
						$("#file_info_owner").attr("href", tar.attr("ownerUrl"));
						$("#file_info_item").parent().hide();
						$(".btn_view").attr("href", tar.attr("url"))
					} else {
						if (type == "trash") {
							$("#file_info_item").text(tar.attr("items")).parent().show();
							$("#file_info_deletetime").text(tar.attr("deleted")).parent().show()
						} else {
							if (type == "trash_chart") {
								$("#file_info_item").parent().hide();
								$("#file_info_deletetime").text(tar.attr("deleted")).parent().show()
							} else {
								if (type == "attach") {
									$("#file_info_item").parent().hide();
									$("#file_info_date").text(tar.attr("date")).parent().show();
									$(".btn_view").attr("href", tar.attr("url"))
								} else {
									if (type == "colla") {
										$("#file_info_modify").text(tar.attr("date")).parent().show();
										$("#file_info_item").parent().hide();
										$("#file_info_owner").text(tar.attr("owner")).parent().show();
										$("#file_info_owner").attr("href", tar.attr("ownerUrl"));
										$(".btn_edit").attr("href", "/diagraming/" + tar.attr("id"));
										$(".btn_view").attr("href", "/view/" + tar.attr("id"));
										DM.Colla.loadCollaboration({
											editable: false
										})
									} else {
										if (type == "team_chart") {
											$("#file_info_date").text(tar.attr("date")).parent().show();
											$("#file_info_modify").text(tar.attr("modify")).parent().show();
											$("#file_info_item").parent().hide();
											$(".btn_edit").attr("href", "/diagraming/" + tar.attr("id"));
											$(".btn_view").attr("href", "/view/" + tar.attr("id"));
											$(".btn_group_folder").hide()
										}
									}
								}
							}
						}
					}
				}
			}
			if (type == "team_folder") {
				$("#file_info_date").parent().hide();
				$("#file_info_modify").parent().hide();
				$("#file_info_item").text(tar.attr("items")).parent().show();
				$("#colla_items").empty();
				$(".btn_group_chart").hide()
			}
		});
		$(".colla_item").live("click", function() {
			$(".colla_selected").removeClass("colla_selected");
			$(this).addClass("colla_selected");
			$(".colla_item_btn").css("display", "inline-block");
			if (!$(this).hasClass("team")) {
				var role = $(this).attr("role");
				DM.Colla.setRole(role)
			} else {
				$("#colla_role_setting").hide()
			}
		});
		DM.loadByHash();
		$(window).bind("hashchange", function() {
			DM.loadByHash()
		});
		$("#template_tag_input").die("keyup.input").live("keyup.input", function(e) {
			var e = e || window.event;
			var keyCode = e.which;
			if (keyCode == 13 || keyCode == 188) {
				var _value = $.trim($(this).val());
				if (_value.indexOf(",") != -1) {
					_value = _value.substr(0, _value.length - 1)
				}
				DM.addTemplateTags(_value);
				$(this).val("").focus();
				$("#_template_tags_box").scrollTop($("#template_tags_list").height());
				if ($("#template_tags_list").children("span.tagitem").length >= 5) {
					$(this).val("").hide()
				}
			}
		}).die("keydown.delete").live("keydown.delete", function(e) {
			var e = e || window.event;
			var keyCode = e.which;
			if (keyCode == 8 && $(this).val() == "") {
				DM.removeTemplateTags($("#template_tags_list span.tagitem:last-child").find(".close-tag"))
			}
		}).suggest({
			url: "/tags/suggest",
			valueField: "tagName",
			format: function(item) {
				return item.tagName
			},
			onEnter: function() {
				DM.addTemplateTags();
				$("#_template_tags_box").scrollTop($("#template_tags_list").height())
			}
		})
	},
	loadByHash: function() {
		if (DM.triggerByHash) {
			var hash = window.location.hash;
			if (hash.length > 1) {
				hash = hash.substring(1, hash.length);
				if (hash == "" || hash == "collaboration" || hash == "team" || hash == "template" || hash == "purchased_templates" || hash == "fav" || hash == "attach" || hash == "trash") {
					DM.param.resource = hash
				}
			}
			DM.load()
		}
		DM.triggerByHash = true
	},
	param: {
		resource: "",
		folderId: "",
		searchTitle: "",
		sort: "",
		view: "",
		page: 1
	},
	triggerByHash: true,
	load: function(p) {
		if (DM.param.folderId == "") {
			var lastDir = $(".dir").find("a")[$(".dir").find("a").length - 1];
			var folderId = $(lastDir).attr("folderId");
			$.extend(DM.param, {
				folderId: folderId
			})
		}
		var _p = $("#diagrams_title").val();
		_p = $.trim(_p);
		$.extend(DM.param, {
			searchTitle: _p
		});
		if (p) {
			$.extend(DM.param, p)
		}
		DM.triggerByHash = false;
		window.location.hash = DM.param.resource;
		$(".left_nav").find(".active").removeClass("active");
		$(".left_nav").find("div[resource='" + DM.param.resource + "']").addClass("active");
		var scrollTop = $(".item_list").scrollTop();
		Util.get("listObject", null, function(data) {
			$("#content").append(data);
			if (DM.param.searchTitle) {
				$(".empty_tip").addClass("search");
				$(".empty_tip").html("您搜索的文件不存在。<div>您可以继续查看我的文件下的其他文件。</div>")
			}
			$(window).trigger("resize.layout");
			$(".item_list").scrollTop(0);
			if (p && p.callback) {
				p.callback()
			}
		})
	},
	showSort: function(ele) {
		$("#sort_menu").popMenu({
			fixed: true,
			offsetY: 1,
			target: $(ele)
		})
	},
	showMoreMenu: function(ele) {
		var selected = DM.getSelected();
		var type = selected.attr("tp");
		$("#more_menu_" + type).popMenu({
			fixed: true,
			offsetY: 1,
			target: $(ele),
			closeAfterClick: false
		});
		if (type == "chart") {
			$("#more_menu_chart").find(".edit").unbind().bind("click", function() {
				window.location.href = "/diagraming/" + selected.attr("id")
			});
			$("#more_menu_chart").find(".view").find("a").attr("href", "/view/" + selected.attr("id"))
		}
	},
	viewSelectedTemplate: function(dom) {
		var selected = DM.getSelected();
		window.open("/view/" + selected.attr("id"))
	},
	showShareMenu: function(ele) {
		var selected = DM.getSelected();
		$("#share_menu").popMenu({
			fixed: true,
			offsetY: 1,
			target: $(ele),
			closeAfterClick: false
		})
	},
	getSelected: function() {
		return $(".item_list").find(".selected")
	},
	deleteConfirm: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		$.confirm({
			content: "您将把：" + title + "移除到垃圾箱中，是否继续？<br/><br/>删除后，您可以从回收站恢复文件。",
			onConfirm: function() {
				var type = selected.attr("tp");
				var id = selected.attr("id");
				Util.ajax({
					url: "folder/to_trash",
					data: {
						type: type,
						id: id
					},
					success: function(data) {
						if (data.result == "success") {
							DM.load()
						}
					}
				})
			}
		})
	},
	newCreateConfirm: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		$.confirm({
			content: "您确定要使用 " + title + " 新建一个新的文件吗？",
			onConfirm: function() {
				var id = selected.attr("id");
				location = "folder/to_create_new?id=" + id
			}
		})
	},
	removeReferenced: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		var chartId = selected.attr("id");
		var price = selected.attr("price");
		$.confirm({
			content: "您将要删除对&nbsp;&quot;" + title + "&nbsp;&quot;模板的引用。<br/>对此模板的引用曾经花费您&nbsp;" + price + "&nbsp;个金币。<br/>是否继续？",
			onConfirm: function() {
				Util.ajax({
					url: "diagrams/remove_referenced",
					data: {
						chartId: chartId
					},
					success: function(data) {
						selected.animate(function() {
							selected.css({
								opaicity: "0"
							})
						}, 200);
						setTimeout(function() {
							selected.remove()
						}, 200)
					}
				})
			}
		})
	},
	deleteLikeConfirm: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		var favId = selected.attr("id");
		$.confirm({
			content: "您将把文件：&quot;" + title + "&quot; 从我喜欢的中删除，是否继续？",
			onConfirm: function() {
				Util.ajax({
					url: "folder/to_trash",
					data: {
						type: "fav",
						id: favId
					},
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	deleteCollaConfirm: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		var chartId = selected.attr("id");
		$.confirm({
			content: "您将删除文件：&nbsp;<b>" + title + "</b><br/><br/>删除之后，您将推出此文件的协作，并且无法继续编辑它。",
			onConfirm: function() {
				Util.ajax({
					url: "folder/to_trash",
					data: {
						type: "colla",
						id: chartId
					},
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	deleteTeamConfirm: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		var id = selected.attr("id");
		var type = selected.attr("tp");
		var content = "您将伤处：&nbsp;<b>" + title + "</b>";
		if (type == "team_folder") {
			content += "<br/><br/>删除之后，此文件夹将在小组中消失，里边包含的文件也将删除。"
		} else {
			content += "<br/><br/>删除之后，此文件将在小组中消失，小组成员将无法再继续编辑它。"
		}
		$.confirm({
			content: content,
			onConfirm: function() {
				Util.ajax({
					url: "folder/to_trash",
					data: {
						type: type,
						id: id
					},
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	clearTrash: function(isSelected) {
		var param = {
			type: "all",
			id: ""
		};
		var content = "您将清空回收站，是否继续？<br/>此操作不可恢复。";
		if (isSelected) {
			var selected = DM.getSelected();
			param.type = selected.attr("tp") == "trash" ? "folder" : "chart";
			param.id = selected.attr("id");
			content = "您将把：" + selected.attr("tit") + "从垃圾箱中彻底删除，是否继续？<br/>此操作不可恢复。"
		}
		$.confirm({
			content: content,
			onConfirm: function() {
				Util.ajax({
					url: "folder/remove_from_trash",
					data: param,
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	restoreTrash: function(isSelected) {
		var param = {
			type: "all",
			id: ""
		};
		var content = "确认还原所有文件？";
		if (isSelected) {
			var selected = DM.getSelected();
			param.type = selected.attr("tp") == "trash" ? "folder" : "chart";
			param.id = selected.attr("id");
			content = "您将把：" + selected.attr("tit") + "从垃圾箱中还原，是否继续？"
		}
		$.confirm({
			content: content,
			onConfirm: function() {
				Util.ajax({
					url: "folder/restore",
					data: param,
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	deleteAttachment: function() {
		var selected = DM.getSelected();
		var title = selected.attr("tit");
		var attachId = selected.attr("id");
		$.confirm({
			content: "您将删除附件：" + title + "<br/>删除后，链接到此附件的数据属性将失效。是否继续？",
			onConfirm: function() {
				Util.ajax({
					url: "folder/to_trash",
					data: {
						type: "attach",
						id: attachId
					},
					success: function(data) {
						DM.load()
					}
				})
			}
		})
	},
	showTitleEdit: function(op) {
		$("#folder_new_title").removeAttr("submitting");
		var selected = DM.getSelected();
		var selectedId = selected.attr("id");
		if (op == "edit") {
			var title = selected.attr("tit");
			$("#folder_new_title").val(title);
			if (selected.attr("tp") == "folder" || selected.attr("tp") == "team_folder") {
				$("#dlg_new_folder").attr("title", "编辑文件夹")
			} else {
				$("#dlg_new_folder").attr("title", "文件重命名")
			}
		} else {
			$("#folder_new_title").val("新建文件夹");
			$("#dlg_new_folder").attr("title", "新建文件夹")
		}
		$("#dlg_new_folder").dialog();
		$("#folder_new_title").select();
		$("#folder_new_title").unbind("keyup").bind("keyup", function(e) {
			if (e.keyCode == 13) {
				submitFolder();
				return
			}
			if ($.trim($(this).val()) != "") {
				$("#btn_submit_folder").attr("disabled", false)
			} else {
				$("#btn_submit_folder").attr("disabled", true)
			}
		});
		$("#btn_submit_folder").unbind("click").bind("click", function(e) {
			submitFolder()
		});

		function submitFolder() {
			var title = $("#folder_new_title").val();
			if ($.trim(title) != "") {
				var data = {
					title: title
				};
				var url = "folder/new";
				if (op == "edit") {
					if (selected.attr("tp") == "folder" || selected.attr("tp") == "team_folder") {
						data.folderId = selectedId;
						url = "folder/rename"
					} else {
						data.chartId = selectedId;
						url = "folder/rename/chart"
					}
				}
				if ($("#folder_new_title").attr("submitting")) {
					return
				}
				$("#folder_new_title").attr("submitting", "true");
				Util.ajax({
					url: url,
					data: data,
					success: function(data) {
						if (data.result == "success") {
							$("#dlg_new_folder").dialog("close");
							DM.load({
								callback: function() {
									$("#" + selectedId).trigger("click")
								}
							})
						}
						$("#folder_new_title").removeAttr("submitting")
					}
				})
			}
		}
	},
	openFileImportWin: function(source) {
		$("#template_source").val(source);
		$("#import_file_window").dialog()
	},
	openFolder: function() {
		var selected = DM.getSelected();
		var folderId = selected.attr("id");
		DM.load({
			folderId: folderId
		})
	},
	showCopy: function() {
		$(".changer_folder").attr("folderId", "root").text("我的文件");
		$("#dlg_copy").dialog();
		$("#btn_submit_move").unbind().bind("click", function() {
			doMoveCopy("folder/move")
		});
		$("#btn_submit_copy").unbind().bind("click", function() {
			doMoveCopy("folder/copy")
		});

		function doMoveCopy(url) {
			var selected = DM.getSelected();
			var type = selected.attr("tp");
			var id = selected.attr("id");
			var folderId = $(".changer_folder").attr("folderId");
			Util.ajax({
				url: url,
				data: {
					type: type,
					id: id,
					target: folderId
				},
				success: function(data) {
					DM.load();
					$("#dlg_copy").dialog("close")
				}
			})
		}
	},
	dropFolderList: function(dom) {
		var menu = $("#folderlist_panel");
		menu.popMenu({
			fixed: true,
			target: $(dom),
			offsetY: 1,
			position: "left",
			zindex: 4,
			autoClose: true,
			closeAfterClick: true
		});
		menu.html("<img src='/images/default/loading.gif' style='margin:5px;'/>");
		Util.get("folder/getfolderdata", {}, function(data) {
			var panel = $("#folderlist_panel");
			panel.html("<ul><li id='root' style='padding-left:0px'><span id='root'><img class='folder_tree_icon' src='/images/default/files/folder_empty.png'/>我的文件</span></li></ul>");
			initFileFolderTree(data, "root");
			panel.find("span").unbind().bind("click", function() {
				$(".changer_folder").text($(this).text());
				$(".changer_folder").attr("folderId", $(this).attr("id"))
			})
		});
		var selected = DM.getSelected();
		var folderTreeExceptId = "";
		if (selected.attr("tp") == "folder") {
			folderTreeExceptId = selected.attr("id")
		}
		function initFileFolderTree(data, parentId) {
			var folders = data.folders;
			var folderArray = folders[parentId];
			var target = $("#folderlist_panel").find("li#" + parentId);
			if (folderArray && folderArray.length) {
				var newNodes = $("<ul parentId='" + parentId + "'></ul>").appendTo(target);
				for (var i = 0; i < folderArray.length; i++) {
					var f = folderArray[i];
					if (f.folderId != folderTreeExceptId) {
						newNodes.append("<li id='" + f.folderId + "'><span id='" + f.folderId + "'><img class='folder_tree_icon' src='/images/default/files/folder_empty.png'/>" + f.title + "</span></li>");
						if (typeof folders[f.folderId] != "undefined") {
							initFileFolderTree(data, f.folderId)
						}
					}
				}
			}
		}
	},
	showPublishEmbed: function() {
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		$("#dlg_publish_embed").dialog();
		$("#iframe_html").val("");
		$(".embed_preview").html("");
		var w, h;
		w = $("#embed_width").val();
		h = $("#embed_height").val();
		changeEmbedWH(w, h);
		$("#iframe_html").select();

		function changeEmbedWH(w, h) {
			var html = '<iframe id="embed_dom" name="embed_dom" frameborder="0" style="border:1px solid #000;display:block;width:' + w + "px; height:" + h + 'px;" src="http://www.processon.com/embed/' + chartId + '"></iframe>';
			$("#iframe_html").val(html);
			$(".embed_preview_wrap").css({
				"margin-top": (-h / 2) + "px",
				"margin-left": (-w / 2) + "px"
			});
			$(".embed_preview").html("").html(html);
			var iframe = document.getElementById("embed_dom");
			iframe.onload = iframe.onreadystatechange = function() {
				if (!iframe.readyState || iframe.readyState == "complete") {
					setTimeout(function() {
						$(".embed_preview .preview_dis").remove();
						setTimeout(function() {
							$(".embed_obj").fadeIn()
						}, 100)
					}, 400)
				}
			}
		}
		$(".embed_size").find("input").keyup(function() {
			var w = $.trim($("#embed_width").val()) == "" ? 340 : $.trim($("#embed_width").val());
			var h = $.trim($("#embed_height").val()) == "" ? 160 : $.trim($("#embed_height").val());
			w = parseInt(w);
			h = parseInt(h);
			$(".embed_preview").find("div:first").css({
				width: w + "px",
				height: h + "px"
			});
			$(".embed_preview").find("iframe").css({
				width: w + "px",
				height: h + "px"
			});
			changeEmbedWH(w, h)
		});
		$("#iframe_html").unbind().bind("click", function() {
			$(this).select()
		});
		$(".embed_preview").keydown(function() {
			$(".embed_size").find("input").blur()
		})
	},
	showPublish: function() {
		var linkId = "";
		var chart;
		$("#as_template").removeAttr("checked");
		$("#public_edit").removeAttr("checked");
		$("#dlg_publish").dialog();
		initNav($("._publish_nav"));
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		var link = "http://www.processon.com/view/" + chartId;
		$("#public_link").text(link).attr("href", link);
		$("#tag_items").children("span").remove();
		Util.get("folder/get_chart", {
			id: chartId
		}, function(data) {
			chart = data.chart;
			setPublicStatus(chart.status);
			$("#publish_language").val(chart.language);
			$("#publish_industry").val(chart.industry);
			if (chart.tags != null && chart.tags.length > 0) {
				for (var i = 0; i < chart.tags.length; i++) {
					addTag(chart.tags[i])
				}
			}
			if ($("#tag_items").children("span").length < 5) {
				$("#tag_input").val("").show()
			} else {
				$("#tag_input").val("").hide()
			}
			$("#publish_description").val(chart.description);
			if (chart.template == true) {
				$("#as_template").attr("checked", "true")
			} else {
				$("#as_template").removeAttr("checked")
			}
		});
		$("#to_publish_edit").unbind().bind("click", function() {
			$("#publish_show_link").slideUp("fast", function() {});
			$(".publish_opt").slideDown();
			$("#dlg_publish").css({
				height: "450px"
			});
			$("#dlg_publish").css({
				top: ($(window).height() - $("#dlg_publish").outerHeight()) / 2 + "px",
				left: ($(window).width() - $("#dlg_publish").outerWidth()) / 2 + "px"
			})
		});

		function initNav(dom) {
			$("._content").hide();
			$(".embed_preview").html("");
			$("._nav").removeClass("action_nav");
			$(dom).addClass("action_nav")
		}
		$("._nav").unbind().bind("click", function() {
			initNav($(this));
			if ($(this).attr("for") == "_publish_content") {
				setPublicStatus(chart.status)
			} else {
				$("." + $(this).attr("for")).show();
				var w, h;
				w = $("#embed_width").val();
				h = $("#embed_height").val();
				changeEmbedWH(w, h);
				$("#iframe_html").select()
			}
		});

		function changeEmbedWH(w, h) {
			var html = '<iframe id="embed_dom" name="embed_dom" frameborder="0" style="border:1px solid #000;width:' + w + "px; height:" + h + 'px;" src="http://www.processon.com/embed/' + chartId + '"></iframe>';
			$("#iframe_html").val(html);
			if ($(".embed_preview").html() == "") {
				$(".embed_preview").append(html);
				var iframe = document.getElementById("embed_dom");
				iframe.onload = iframe.onreadystatechange = function() {
					if (!iframe.readyState || iframe.readyState == "complete") {
						setTimeout(function() {
							$(".embed_preview .preview_dis").remove();
							setTimeout(function() {
								$(".embed_obj").fadeIn()
							}, 100)
						}, 400)
					}
				}
			}
		}
		$(".embed_size").find("input").unbind().keyup(function() {
			var w = $.trim($("#embed_width").val()) == "" ? 340 : $.trim($("#embed_width").val());
			var h = $.trim($("#embed_height").val()) == "" ? 160 : $.trim($("#embed_height").val());
			w = parseInt(w);
			h = parseInt(h);
			$(".embed_preview").find("div:first").css({
				width: w + "px",
				height: h + "px"
			});
			$(".embed_preview").find("iframe").css({
				width: w + "px",
				height: h + "px"
			});
			changeEmbedWH(w, h)
		});
		$(".publish_opt_link").unbind().bind("click", function() {
			Util.get("/view/private_link_create", {
				id: chartId
			}, function(data) {
				$("#private-link-a").val("http://www.processon.com/view/share/" + data.link);
				$(".private-link").show();
				$(".publish_opt_link").hide();
				linkId = data.link
			})
		});
		$("#private-link-a").unbind().bind("click", function() {
			$(this).select()
		});
		$(".remove-link").die().live("click", function() {
			if (linkId == "") {
				return
			}
			Util.ajax({
				url: "/view/remove_linkId",
				data: {
					id: chartId
				},
				success: function(data) {
					linkId = "";
					$("#private-link-a").val("");
					$(".private-link").hide();
					$(".publish_opt_link").css("display", "inline-block")
				}
			})
		});
		$("#tag_input").unbind("keyup.input").bind("keyup.input", function(event) {
			var keycode = event.which;
			if (keycode == 13) {
				addTag($("#tag_input").val());
				$("#tag_input").val("")
			}
			if (keycode == 188) {
				addTag($("#tag_input").val().substr(0, $("#tag_input").val().length - 1));
				$("#tag_input").val("")
			}
			$("#publish_addtags").scrollTop($(".input_item_box").height());
			if ($("#tag_items").children("span").length >= 5) {
				$("#tag_input").val("").hide()
			}
		}).unbind("keydown.delete").bind("keydown.delete", function(event) {
			if (event.which == 8 && $("#tag_input").val() == "") {
				$("#tag_items span:last-child").remove()
			}
		}).suggest({
			url: "/tags/suggest",
			valueField: "tagName",
			format: function(item) {
				return item.tagName
			},
			onEnter: function() {
				addTag();
				$(".feedTags").scrollTop($(".input_item_box").height())
			}
		});
		$("#tag_items").find(".close-tag").die().live("click", function() {
			$(this).parent().remove();
			if ($("#tag_items").children("span").length < 5) {
				$("#tag_input").val("").show().focus()
			}
		});
		$("#btn_submit_publish").unbind().bind("click", function() {
			var state = "public";
			doPublishOrNot(state)
		});
		$("#btn_submit_private").unbind().bind("click", function() {
			var state = "private";
			doPublishOrNot(state)
		});

		function doPublishOrNot(state) {
			var param = {};
			param.id = chartId;
			param.language = $("#publish_language").val();
			param.industry = $("#publish_industry").val();
			param.description = $("#publish_description").val();
			param.tags = getTags();
			param.status = state;
			param._public_edit = ($("#public_edit")[0].checked == true) ? "true" : "false";
			param._as_template = ($("#as_template")[0].checked == true) ? "true" : "false";
			if ($("#sync_sina").hasClass("sina")) {
				param.sina = "true"
			}
			Util.ajax({
				url: "/folder/publish",
				data: param,
				success: function(data) {
					DM.load({
						callback: function() {
							$("#" + chartId).trigger("click")
						}
					});
					$("#dlg_publish").dialog("close")
				}
			})
		}
		function setPublicStatus(status) {
			if (status == "public") {
				$("#publish_show_link").show();
				$(".publish_opt").hide();
				$("#dlg_publish").css({
					height: "300px"
				})
			} else {
				$("#publish_show_link").hide();
				$(".publish_opt").show();
				$("#dlg_publish").css({
					height: "450px"
				})
			}
			$("#dlg_publish").css({
				top: ($(window).height() - $("#dlg_publish").outerHeight()) / 2 + "px",
				left: ($(window).width() - $("#dlg_publish").outerWidth()) / 2 + "px"
			})
		}
		function addTag(value) {
			if (typeof value == "undefined") {
				value = $("#tag_input").val();
				$("#tag_input").val("")
			}
			if (value != "") {
				var currentItems = $("#tag_items").find(".tagitem").map(function() {
					return $(this).find("input").val()
				}).get();
				if ($.inArray(value, currentItems) < 0) {
					$("#tag_items").append("<span class='tagitem'><span class='close-tag'></span><input type='hidden' name='tags' value='" + value + "'/>" + value + "</span>");
					$("#tag_items").show()
				}
			}
		}
		function getTags() {
			addTag();
			var tags = $("#tag_items").find(".tagitem").map(function() {
				return $(this).find("input").val()
			}).get();
			return tags
		}
		if ($("#sync_sina").length) {
			$("#sync_sina").attr("title", "信息将同步到微博");
			$("#sync_sina").off("click").on("click", function() {
				if ($(this).hasClass("sina")) {
					$(this).removeClass("sina").addClass("sina_");
					$(this).attr("title", "已取消同步")
				} else {
					$(this).removeClass("sina_").addClass("sina");
					$(this).attr("title", "信息将同步到微博")
				}
			})
		}
	},
	showViewLink: function() {
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		var chart = null;
		var viewLinkId = "";
		Util.get("/folder/get_chart", {
			id: chartId
		}, function(data) {
			chart = data.chart;
			viewLinkId = chart.viewLinkId;
			var title = chart.title;
			$(".create_view_link h3").find("span._tip2").html(title);
			$("#view_link_window").dialog();
			if (viewLinkId == "" || viewLinkId == null) {
				DM.showCreateViewLink()
			} else {
				var state = "off";
				var viewPassword = null;
				if (chart.viewPassword != null || chart.viewPassword != "") {
					state = "on";
					viewPassword = chart.viewPassword
				}
				DM.showShareViewLink(state, viewPassword);
				var link = "http://www.processon.com/view/link/" + viewLinkId;
				$("#_view_link_input").val(link).select()
			}
		})
	},
	showCreateViewLink: function() {
		$(".create_view_link h3").find("span._tip1").html("创建分享浏览链接");
		$("#view_link_window").find(".txt").css({
			width: "390px"
		}).removeAttr("readonly", "readonly");
		if ($("#_locale").val() === "zh") {
			$("#view_link_window").find(".txt").css({
				width: "410px"
			})
		}
		$("#_view_link_input").val("");
		var createHtmlDeclare = "<p>希望分享给别人，又不想完全公开？您可以在此创建一个浏览链接，分享给别人后，可以通过此链接来安全地浏览您的文件。 </p><p>当然，您也可以给浏览链接添加密码，以便您享有更多的控制权限。 </p>";
		$(".create_dis").html(createHtmlDeclare);
		setTimeout(function() {
			$(".create.button").show()
		}, 200)
	},
	showShareViewLink: function(state, viewPassword) {
		var left = "-1px";
		var bgColor = "#fff;color:#323232;text-shadow:0px 1px 0px rgba(255,255,255,0.3)";
		if (state == "on" && viewPassword != "" && viewPassword != null) {
			left = "33px";
			bgColor = "#5da206;color:#fff;text-shadow:0px 1px 0px rgba(0,0,0,0.3)"
		}
		$(".create_view_link h3").find("span._tip1").html("分享链接以便其他人可以浏览文件 ");
		$(".create.button").hide();
		$("#view_link_window").find(".txt").css({
			width: "98%"
		}).attr("readonly", "readonly");
		var shareHtmlDeclare = '<p>密码保护</p><p><a href="javascript:;" onclick="DM.deleteViewLink()">删除链接</a>&nbsp;撤销访问权</p><div class="edit_pw_protect" style="background:' + bgColor + ';" onclick="DM.changePWState(this)"><span class="pw_protect_on">开</span><span class="pw_protect_off">关</span><div class="pw_protect_watch" style="left: ' + left + ';"></div></div><div class="password_input_w"><input type="text" class="_pw txt" value="" placeholder=\'密码\' /><span class="button add_pw_btn" onclick="DM.addViewLinkPassword(this)">添加 </span><div style="clear:both;"></div></div>';
		$(".create_dis").html(shareHtmlDeclare);
		if (state == "on" && viewPassword != "" && viewPassword != null) {
			$(".button.add_pw_btn").text("更改");
			$(".password_input_w").show().find("._pw").val(viewPassword)
		}
	},
	createViewLink: function(ele) {
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		Util.ajax({
			url: "/view/addlink",
			data: {
				chartId: chartId
			},
			success: function(data) {
				DM.showShareViewLink("off");
				var viewLinkId = data.viewLinkId;
				var link = "http://www.processon.com/view/link/" + viewLinkId;
				$("#_view_link_input").val(link).select()
			}
		})
	},
	deleteViewLink: function() {
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		Util.ajax({
			url: "/view/dellink",
			data: {
				chartId: chartId
			},
			success: function(data) {
				DM.showCreateViewLink()
			}
		})
	},
	changePWState: function(ele1) {
		var ele = $(ele1).find(".pw_protect_watch")[0];
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		var state = ele.offsetLeft;
		if (state == -1) {
			$(ele).css({
				left: "33px"
			});
			$(".button.add_pw_btn").text("添加");
			$(".password_input_w").show().find("._pw").val("").focus()
		} else {
			Util.ajax({
				url: "/view/removepassword",
				data: {
					chartId: chartId
				},
				success: function(data) {
					$(ele).css({
						left: "-1px"
					});
					$(".edit_pw_protect").css({
						background: "#fff",
						color: "#323232",
						"text-shadow": "0px 1px 0px rgba(255,255,255,0.3)"
					});
					$(".password_input_w").find("._pw").val("");
					$(".password_input_w").hide()
				}
			})
		}
	},
	addViewLinkPassword: function(ele) {
		var selected = DM.getSelected();
		var chartId = selected.attr("id");
		var viewPassword = $.trim($(ele).parent().find("._pw").val());
		if (viewPassword == "") {
			$("._pw").focus();
			return false
		}
		Util.ajax({
			url: "/view/addpassword",
			data: {
				viewPassword: viewPassword,
				chartId: chartId
			},
			success: function(data) {
				$(".edit_pw_protect").css({
					background: "#5da206",
					color: "#fff",
					"text-shadow": "0px 1px 0px rgba(0,0,0,0.3)"
				});
				$(".button.add_pw_btn").text("更改")
			}
		})
	},
	showExport: function() {
		$("#dlg_export").dialog()
	},
	doExport: function() {
		var type = $("input[name=export-format]:checked").val();
		var id = DM.getSelected().attr("id");
		$("#export_type").val(type);
		$("#export_id").val(id);
		$("#export_form").submit();
		$("#dlg_export").dialog("close")
	},
	Colla: {
		loadCollaborationReq: null,
		loadCollaboration: function(options) {
			var opt = {
				reload: false,
				editable: true
			};
			$.extend(opt, options);
			if (this.loadCollaborationReq) {
				this.loadCollaborationReq.abort()
			}
			var selected = DM.getSelected();
			var chartId = selected.attr("id");
			if (!opt.reload && $("#colla_items").attr("chartId") == chartId && $("#colla_items").html() != "") {
				return
			}
			$("#colla_items").empty();
			$("#colla_items").attr("chartId", chartId);
			this.loadCollaborationReq = Util.ajax({
				url: "/collaboration/list_users",
				data: {
					chartId: chartId,
					editable: opt.editable
				},
				success: function(data) {
					$("#colla_items").html(data);
					this.loadCollaborationReq = null
				}
			})
		},
		getSelected: function() {
			return $(".colla_selected")
		},
		deleteCollaboration: function() {
			DM.Colla.cancelDeleteCollaboration();
			var selected = DM.Colla.getSelected();
			var userName = selected.find(".collabra_name").text();
			var text = "";
			if (selected.hasClass("team")) {
				text = "您将终止此文件与小组： <span style='font-weight:bold;'>" + userName + "</span> 的协作，是否继续？"
			} else {
				text = '您将把 <span style="font-weight:bold;">' + userName + "</span> 从您的协作成员中删除，是否继续？"
			}
			var confirmhtml = '<div id="delete_colla_confirm" style="display:none;" class="alert">' + text + '<div style="margin-top:5px;"><a href="javascript:" class="button green">确定</a>&nbsp;&nbsp;<a href="javascript:" class="button" onclick="DM.Colla.cancelDeleteCollaboration()">取消</a></div></div>';
			var confirm = $(confirmhtml).insertAfter($(".colla_btns"));
			confirm.fadeIn().find(".green").unbind().bind("click", function() {
				DM.Colla.doDeleteCollaboration();
				DM.Colla.cancelDeleteCollaboration()
			})
		},
		cancelDeleteCollaboration: function() {
			$("#delete_colla_confirm").remove()
		},
		doDeleteCollaboration: function() {
			var param = {};
			var selected = DM.Colla.getSelected();
			if (selected.hasClass("team")) {
				param.type = "team";
				param.teamId = selected.attr("teamId");
				param.chartId = DM.getSelected().attr("id")
			} else {
				param.type = "user";
				param.collaborationId = selected.attr("collaId")
			}
			Util.ajax({
				url: "/collaboration/delete",
				data: param,
				success: function(data) {
					$(".colla_item_btn").hide();
					selected.remove()
				}
			})
		},
		showRoleSetting: function(dom, role) {
			$("#coll_role_menu").popMenu({
				fixed: true,
				target: $(dom),
				position: "left",
				autoClose: true,
				closeAfterClick: true,
				offsetY: 1
			});
			$("#coll_role_menu").find("span").removeClass("selected");
			$("#coll_role_menu").find("li[role=" + role + "]").find("span").addClass("selected");
			$("#coll_role_menu").find("li").unbind().bind("click", function() {
				var role = $(this).attr("role");
				DM.Colla.setRole(role);
				var selected = DM.Colla.getSelected();
				var collaId = selected.attr("collaId");
				if (role != selected.attr("role")) {
					selected.attr("role", role);
					if (role == "viewer") {
						selected.find(".role").text("浏览者")
					} else {
						selected.find(".role").text("编辑者")
					}
					Util.ajax({
						url: "/collaboration/set_role",
						data: {
							collaborationId: collaId,
							role: role
						},
						success: function(data) {}
					})
				}
			})
		},
		setRole: function(role) {
			if (role == "viewer") {
				$("#colla_role_setting").find(".text").text("浏览者")
			} else {
				$("#colla_role_setting").find(".text").text("编辑者")
			}
			$("#colla_role_setting").attr("role", role)
		},
		showAdd: function() {
			$("#colla_add").dialog();
			$("#colla_suggest_box").empty();
			$("#add_step2").hide();
			$("#add_step1").show();
			var lastVal = "";
			$("#input_add_colla").val("").unbind().bind("keyup", function() {
				var value = $(this).val();
				if (value == lastVal) {
					return
				}
				lastVal = value;
				if (value == "") {
					$("#colla_suggest_box").empty();
					$("#add_step2").hide();
					$("#add_step1").show();
					return
				}
				Util.ajax({
					url: "/collaboration/getmembers",
					data: {
						value: value
					},
					success: function(data) {
						$("#colla_suggest_box").html(data);
						if ($("#colla_suggest_box").find("ul").length > 0) {
							$("#add_step2").show();
							$("#add_step1").hide()
						} else {
							$("#add_step2").hide();
							$("#add_step1").show()
						}
					}
				})
			});
			$(".colla_suggest").find("li").die().live("click", function() {
				var param = {
					type: $(this).attr("joinType"),
					target: $(this).attr("target"),
					chartId: DM.getSelected().attr("id")
				};
				Util.ajax({
					url: "/collaboration/add",
					data: param,
					success: function(data) {
						if (data.result == "exists") {
							$("#colla_suggest_box").html("<div class='alert'><b>" + data.name + "</b>已经加入了此文件的协作中了。</div>")
						} else {
							if (param.type == "team") {
								$("#colla_suggest_box").html("<div class='alert success'><b>" + data.name + "</b>&nbsp;已经成功加入此文件的协作中，现在您可以与您的小组成员一起及时的进行编辑。</div>")
							} else {
								$("#colla_suggest_box").html("<div class='alert success'>您已经成功邀请：<b>" + data.name + "</b>，请耐心等待受邀人接受您的邀请。</div>")
							}
							DM.Colla.loadCollaboration({
								reload: true
							})
						}
						$("#input_add_colla").val("").focus()
					}
				})
			})
		}
	}
};

function fileChange() {
	var filePath = $("#importVisiopath").val();
	var filename = filePath.substr(filePath.lastIndexOf("\\") + 1);
	var type = filename.substr(filename.lastIndexOf(".")).toLowerCase();
	if (type == ".vdx") {
		$(".import_file_wraper").show();
		$("#fileName").val(filename.substr(0, filename.lastIndexOf("."))).focus()
	} else {
		$(".button.submit_btn").unbind("click");
		$("#import_error").text("请上传一个Visio文件(*.vdx),当前我们仅支持Visio中的Cross-function | Flowchart ").slideDown();
		setTimeout(function() {
			$("#import_error").hide().text("");
			$("#fileName").val("").parent().hide()
		}, 3000)
	}
}
function importBtnSubmit() {
	if ($("#fileName").val() == "" || $("#fileName").val() == null) {
		$(".button.submit_btn").unbind("click");
		$("#import_error").text("请选择要导入的文件 ").slideDown();
		setTimeout(function() {
			$("#import_error").hide().text("")
		}, 2000)
	} else {
		$("#import_visio_file").submitForm({
			onSubmit: function() {
				$(".button.submit_btn").html("<span class='ico bt importing'></span>导入中...")
			},
			error: function() {
				$("#import_error").text("导入文件失败 ").slideDown();
				setTimeout(function() {
					$("#import_error").hide().text("");
					$(".button.submit_btn").html("导入")
				}, 3000)
			},
			success: function(data) {
				if (data.result == "type_error") {
					$(".button.submit_btn").unbind("click");
					$("#import_error").text("您上传的文件格式不正确或文件已经损坏。 ").slideDown();
					setTimeout(function() {
						$("#import_error").hide().text("");
						$(".button.submit_btn").html("导入")
					}, 3000)
				} else {
					$(".button.submit_btn").html("导入");
					$("#import_success").text("跳转中...").show();
					window.location.href = "/diagraming/" + data.result
				}
			}
		})
	}
}
$(function() {
	DM.init()
});