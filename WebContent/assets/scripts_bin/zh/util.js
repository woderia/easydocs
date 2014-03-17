var Util = {};
$(function() {
	$.ajaxSetup({
		cache: false
	});
	$("[title],[original-title]").live("mouseover", function() {
		if ($(this).attr("disableTitle")) {
			return false
		}
		var target = $(this);
		if (target.attr("title")) {
			target.attr("original-title", target.attr("title"));
			target.removeAttr("title")
		}
		if (!target.attr("original-title")) {
			return
		}
		var title = target.attr("original-title");
		var tip = $("#hover_tip");
		if (tip.length == 0) {
			tip = $("<div id='hover_tip'><div class='tip_arrow'></div><div class='tip_content radius3'></div></div>").appendTo("body")
		}
		$(".tip_content").html(title);
		$("#hover_tip").show();
		$(".tip_arrow").removeClass("tip_right").removeClass("tip_top").css("top", "");
		if (target.attr("title_pos") == "right") {
			tip.css({
				left: target.offset().left + target.outerWidth() + 7,
				top: target.offset().top + target.outerHeight() / 2 - tip.outerHeight() / 2
			});
			$(".tip_arrow").addClass("tip_right").css("top", tip.outerHeight() / 2 - 7)
		} else {
			if (target.attr("title_pos") == "top") {
				tip.css({
					left: target.offset().left + target.outerWidth() / 2 - tip.outerWidth() / 2,
					top: target.offset().top - tip.outerHeight()
				});
				$(".tip_arrow").addClass("tip_top")
			} else {
				tip.css({
					left: target.offset().left + target.outerWidth() / 2 - tip.outerWidth() / 2,
					top: target.offset().top + target.outerHeight()
				})
			}
		}
	}).live("mouseout", function() {
		$("#hover_tip").hide()
	});
	var badges = $(".notification_badge");
	if (badges.length) {
		Util.notificationsTips()
	}
	var leaveTimeout;
	$("#header-user").live("mouseenter", function() {
		clearTimeout(leaveTimeout);
		var target = $(this);
		var menu = $("#header_user_menu");
		target.addClass("droped");
		menu.popMenu({
			target: target,
			onClose: function() {
				target.removeClass("droped")
			}
		});
		menu.unbind().bind("mouseenter", function() {
			clearTimeout(leaveTimeout)
		}).bind("mouseleave", function() {
			leaveTimeout = setTimeout(function() {
				menu.popMenu("close");
				target.removeClass("droped")
			}, 200)
		})
	}).live("mouseleave", function() {
		var target = $(this);
		leaveTimeout = setTimeout(function() {
			$("#header_user_menu").popMenu("close");
			target.removeClass("droped")
		}, 200)
	});
	var userInfoRequest;
	var userInfoTimeout;
	var closeUserInfoTimeout;
	$(".user_quickinfo").live("mouseenter", function() {
		var target = $(this);
		var userId = target.attr("userId");
		if (userInfoRequest) {
			userInfoRequest.abort()
		}
		clearTimeout(userInfoTimeout);
		userInfoTimeout = setTimeout(function() {
			userInfoRequest = Util.ajax({
				url: "/u/quickinfo",
				data: {
					userId: userId
				},
				success: function(data) {
					if (data.result == "not_exists") {
						return
					}
					var box = getQuickInfoBox();
					box.attr("userId", userId);
					box.html(data);
					box.show();
					box.popMenu({
						autoClose: false,
						target: target,
						position: "left"
					});
					box.unbind().bind("mouseenter", function() {
						clearTimeout(closeUserInfoTimeout)
					}).bind("mouseleave", function() {
						box.popMenu("close")
					});
					$("#userinfo_follow_btn").die().on("mouseover", function() {
						if ($(this).hasClass("unfollowuser_btn")) {
							$(this).text("取消关注").removeClass("green")
						} else {
							$(this).text("关注")
						}
					}).live("mouseout", function() {
						if ($(this).hasClass("unfollowuser_btn")) {
							$(this).text("关注中").addClass("green")
						} else {
							$(this).text("关注")
						}
					}).live("click", function() {
						if ($(this).hasClass("unfollowuser_btn")) {
							doUnFollowUser(this, userId)
						} else {
							doFollowUser(this, userId)
						}
					})
				}
			})
		}, 400)
	}).live("mouseleave", function() {
		if (userInfoRequest) {
			userInfoRequest.abort()
		}
		clearTimeout(userInfoTimeout);
		closeUserInfoTimeout = setTimeout(function() {
			$("#userQuickInfo").popMenu("close")
		}, 400)
	});

	function getQuickInfoBox() {
		var box = $("#userQuickInfo");
		if (box.length == 0) {
			box = $("<div id='userQuickInfo' class='shadow_1 radius3' style='display:none;'></div>").appendTo("body")
		}
		return box
	}
});
Array.prototype.inArray = function(elem) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == elem) {
			return true
		}
	}
	return false
};
Array.prototype.indexOf = function(elem) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == elem) {
			return i
		}
	}
	return -1
};
Array.prototype.remove = function(elem) {
	var index = this.indexOf(elem);
	if (index > -1) {
		this.splice(index, 1)
	}
};
Util.notificationsTips = function() {
	$.get("/notification/count", {}, function(data) {
		if (data.goon) {
			setTimeout(Util.notificationsTips, 30 * 1000)
		}
		if (data.count > 0) {
			$(".notification_badge").text(data.count).show()
		} else {
			$(".notification_badge").hide()
		}
	})
};
Util.formatMsg = function(str, args) {
	if (typeof args != "object") {
		eval("args=['" + args + "']")
	}
	for (var i = 0; i < args.length; i++) {
		var toReplace = "{" + i + "}";
		str = str.replace(toReplace, args[i])
	}
	return str
};
Util.formatNumber = function(s, decimal) {
	if (/[^0-9\.]/.test(s)) {
		return "0"
	}
	if (s == null || s == "") {
		return "0"
	}
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s)) {
		s = s.replace(re, "$1,$2")
	}
	s = s.replace(/,(\d\d)$/, ".$1");
	if (decimal == 0) {
		var a = s.split(".");
		if (a[1] == "00") {
			s = a[0]
		}
	}
	return s
};
Util.onlyNum = function(eventTag) {
	var event = eventTag || window.event;
	if (!(event.keyCode >= 8 && event.keyCode <= 20) || (event.keyCode >= 33 && event.keyCode <= 46)) {
		if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
			if (window.event) {
				event.returnValue = false
			} else {
				event.preventDefault()
			}
		}
	}
	return event.keyCode
};
$.fn.clear = function() {
	$(this).find("input[type=text]").val("");
	$(this).find("input[type=password]").val("");
	$(this).find("textarea").val("");
	$(this).find("select").val("")
};
$.fn.submitFormAjax = function(options) {
	var form = $(this);
	if (options.onSubmit) {
		if (options.onSubmit.call() == false) {
			return
		}
	}
	$.ajax({
		url: options.url ? options.url : $(this).attr("action"),
		type: "POST",
		data: $(this).serialize(),
		success: function(data) {
			if (data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if (data.error == "notlogin") {
					Util.loginWindow("open", function() {
						form.submitFormAjax(options)
					})
				} else {
					if (options.success) {
						options.success(data)
					}
				}
			}
		},
		error: function(data) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。".errorMsg, "error", 3000);
			if (options.error) {
				options.error(data)
			}
		}
	})
};
$.fn.submitForm = function(opt) {
	var defaultOpt = {
		json: true
	};
	var options = $.extend(defaultOpt, opt);
	var form = $(this);
	if (options.onSubmit) {
		if (options.onSubmit.call(form) == false) {
			return
		}
	}
	if (options.url) {
		form.attr("action", options.url)
	}
	var frameId = "submit_frame_" + (new Date().getTime());
	var frame = $("<iframe id=" + frameId + " name=" + frameId + "></iframe>").attr("src", window.ActiveXObject ? "javascript:false" : "about:blank").css({
		position: "absolute",
		top: -1000,
		left: -1000
	});
	form.attr("target", frameId);
	frame.appendTo("body");
	frame.bind("load", submitCallback);
	form.append("<input type='hidden' name='submitFormByHiddenFrame' id='submitFormByHiddenFrameParam' value='hiddenFrame'/>");
	form[0].submit();
	$("#submitFormByHiddenFrameParam").remove();
	var checkCount = 10;

	function submitCallback() {
		frame.unbind();
		var body = $("#" + frameId).contents().find("body");
		var data = body.html();
		if (data == "") {
			if (--checkCount) {
				setTimeout(submitCallback, 200);
				return
			}
			return
		}
		var ta = body.find(">textarea");
		if (ta.length) {
			data = ta.val()
		} else {
			var pre = body.find(">pre");
			if (pre.length) {
				data = pre.html()
			}
		}
		try {
			eval("data=" + data);
			if (data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if (data.error == "notlogin") {
					Util.loginWindow("open", function() {
						form.submitForm(options)
					})
				} else {
					if (options.success) {
						options.success(data)
					}
				}
			}
		} catch (e) {
			if (options.json) {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
				if (options.error) {
					options.error(data)
				}
			} else {
				if (options.success) {
					options.success(data)
				}
			}
		}
		setTimeout(function() {
			frame.unbind();
			frame.remove()
		}, 100)
	}
};
Util.ajax = function(options) {
	if (options.onSend) {
		if (options.onSend() == false) {
			return
		}
	}
	var defaults = {
		type: "POST"
	};
	options = $.extend(defaults, options);
	return $.ajax({
		url: options.url,
		type: options.type,
		traditional: true,
		data: options.data,
		success: function(data) {
			if (data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
				if (options.error) {
					options.error(data)
				}
			} else {
				if (data.error == "notlogin") {
					if (options.loginValidate) {
						options.loginValidate(data)
					}
					Util.loginWindow("open", function() {
						Util.ajax(options)
					})
				} else {
					if (options.success) {
						options.success(data)
					}
				}
			}
		},
		error: function(data) {
			if (data.status) {
				if (options.error) {
					options.error(data)
				} else {
					$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
				}
			}
		}
	})
};
Util.load = function(dom, url, params, callback, filter) {
	$.ajax({
		url: url,
		type: "POST",
		dataType: "html",
		data: params,
		success: function(data) {
			if (data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if (data.error == "notlogin") {
					Util.loginWindow("open", function() {
						Util.load(dom, url, params, callback, filter)
					})
				} else {
					if (filter) {
						if (filter(data)) {
							dom.html(data);
							if (callback) {
								callback(data)
							} else {
								dom.html(data)
							}
						}
					} else {
						if (callback) {
							dom.html(data);
							callback(data)
						} else {
							dom.html(data)
						}
					}
				}
			}
		},
		error: function(data) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
		}
	})
};
Util.get = function(url, params, callback) {
	$.ajax({
		url: url,
		type: "GET",
		data: params,
		success: function(data) {
			if (data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if (data.error == "notlogin") {
					Util.loginWindow("open", function() {
						Util.get(url, params, callback)
					})
				} else {
					callback(data)
				}
			}
		},
		error: function(data) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
		}
	})
};
$.fn.disable = function(grow, zindex) {
	$(this).attr("disable", true);
	$(this).addClass("opacity");
	for (var i = 0; i < $(this).length; i++) {
		var dom = $(this)[i];
		$(dom).unbind("mouseover.disable").bind("mouseover.disable", function() {
			var mask = $("<div class='disabled-mask'></div>").appendTo("body");
			if (!grow) {
				grow = 2
			}
			mask.css({
				width: $(this).outerWidth() + grow,
				height: $(this).outerHeight() + 4,
				top: $(this).offset().top,
				left: $(this).offset().left
			});
			if (zindex) {
				mask.css("z-index", zindex)
			}
			mask.bind("mouseout", function() {
				$(this).remove()
			})
		}).bind("focus", function() {
			$(this).blur()
		});
		$(dom).trigger("mouseover.disable")
	}
	return this
};
$.fn.enable = function() {
	$(this).attr("disable", false);
	$(this).removeClass("opacity");
	for (var i = 0; i < $(this).length; i++) {
		var dom = $(this)[i];
		$(dom).unbind("mouseover.disable").unbind("focus")
	}
	$(".disabled-mask").trigger("mouseout");
	return this
};
Util.loginWindow = function(method, callback) {
	if (typeof method == "undefined") {
		method = "open"
	}
	if (method == "open") {
		if ($("#loginWindow").length) {
			$("#loginWindow").remove()
		}
		var loginWindow = $("<div id='loginWindow' class='loginWindow'></div>").appendTo("body");
		loginWindow.append("<div id='loginWindow-content' class='loginWindow-content'><img src='/images/ajaxload.gif' style='margin:80px 0px 0px 45%'/></div>");
		$("#loginWindow-content").load("/login/window", function() {
			loginCallback = callback
		});
		loginWindow.dialog()
	} else {
		if (method = "close") {
			$("#loginWindow").dialog("close")
		}
	}
};
(function($) {
	var maskStackCount = 0;
	$.mask = function(method) {
		if (typeof method == "undefined") {
			method = "open"
		}
		if (method == "open") {
			if (maskStackCount == 0) {
				var mask = $("<div id='window-mask' class='window-mask' style='display:none'></div>").appendTo("body");
				mask.css({
					width: $(window).width() + "px",
					height: $(window).height() + "px",
					filter: "alpha(opacity=60)"
				}).show();
				$(window).bind("resize.mask", function() {
					mask.css({
						width: $(window).width() + "px",
						height: $(window).height() + "px"
					})
				})
			}
			maskStackCount++
		} else {
			if (method == "close") {
				maskStackCount--;
				if (maskStackCount == 0) {
					$("#window-mask").remove();
					$(window).unbind("resize.mask")
				}
			}
		}
	};
	$.fn.dialog = function(options) {
		var dialogWin = $(this);
		if (typeof options == "string") {
			if (options == "close") {
				dialogWin.find(".dialog_close").trigger("click");
				if ($("#window-mask") != null) {
					$("#window-mask").hide()
				}
			}
		} else {
			var defaults = {
				fixed: true,
				closable: true,
				mask: true
			};
			options = $.extend(defaults, options);
			if (!options) {
				options = {}
			}
			var title = "";
			if (options.title) {
				title = options.title
			} else {
				if (dialogWin.attr("title")) {
					title = dialogWin.attr("title");
					dialogWin.attr("title", "")
				}
			}
			dialogWin.addClass("dialog_box").show();
			var dialogClose = $("<div class='dialog_close'></div>").appendTo(dialogWin);
			dialogClose.bind("click", function() {
				if (options.onClose) {
					if (options.onClose() == false) {
						return
					}
				}
				$.mask("close");
				dialogWin.hide();
				dialogWin.removeClass("dialog_box").find(".dialog_close").remove();
				var title = dialogWin.find(".dialog_title");
				dialogWin.attr("title", title.text());
				title.remove();
				$(window).unbind("resize.dialog")
			});
			if (options.closable) {
				dialogClose.show()
			}
			if (title != "") {
				dialogWin.prepend("<h2 class='dialog_title'>" + title + "</h2>")
			}
			if (options.mask) {
				$.mask()
			}
			var dialogWidth = dialogWin.outerWidth();
			var dialogHeight = dialogWin.outerHeight();
			$(window).bind("resize.dialog", function() {
				var top = 0;
				if (options.fixed) {
					dialogWin.css("position", "fixed");
					top = ($(window).height() - dialogHeight) / 2 + "px"
				} else {
					dialogWin.css("position", "absolute");
					top = ($(window).height() - dialogHeight) / 2 + $(document).scrollTop() + "px"
				}
				var left = ($(window).width() - dialogWidth) / 2 + "px";
				dialogWin.css({
					top: top,
					left: left
				})
			});
			$(window).trigger("resize.dialog");
			dialogWin.find(".dialog_title").draggable({
				target: dialogWin
			})
		}
		return dialogWin
	};
	$.confirm = function(options) {
		var confirmWin = $("#global_confirm_window");
		if (!confirmWin.length) {
			confirmWin = $("<div id='global_confirm_window' title='请确认'><div class='msg'></div><div class='buttons'><span class='button default okbtn'>确定</span>&nbsp;&nbsp;<span class='button cancelbtn'>取消</span></div></div>").appendTo("body")
		}
		confirmWin.find(".msg").html(options.content);
		if (options.width) {
			confirmWin.css("width", options.width)
		}
		if (options.height) {
			confirmWin.css("height", options.height)
		}
		confirmWin.dialog();
		confirmWin.find(".okbtn").unbind().bind("click", function() {
			confirmWin.dialog("close");
			if (options.onConfirm) {
				options.onConfirm()
			}
		});
		confirmWin.find(".cancelbtn").unbind().bind("click", function() {
			confirmWin.dialog("close");
			if (options.onCancel) {
				options.onCancel()
			}
		})
	};
	$.fn.popMenu = function(options) {
		var menu = $(this);
		if (typeof options == "string") {
			if (options == "close") {
				menu.hide().removeClass("popover");
				$(window).unbind("resize.popmenu")
			}
			return
		}
		var defaults = {
			position: "left",
			fixed: false,
			offsetX: 0,
			offsetY: 0,
			zindex: 2,
			autoClose: true,
			closeAfterClick: false,
			autoPosition: true
		};
		var opt = $.extend(defaults, options);
		var target = $(opt.target);
		menu.addClass("popover").css("z-index", opt.zindex);
		if (opt.fixed) {
			menu.css("position", "fixed")
		}
		if (opt.autoClose) {
			if (opt.closeAfterClick == false) {
				menu.unbind("mouseup.popmenu").bind("mouseup.popmenu", function(e) {
					e.stopPropagation()
				})
			}
			$(document).bind("mouseup.popmenu", function() {
				menu.popMenu("close");
				$(document).unbind("mouseup.popmenu");
				if (opt.onClose) {
					opt.onClose()
				}
			})
		}
		$(window).bind("resize.popmenu", function() {
			menu.popMenu(options)
		});
		menu.show();
		var left = 0;
		if (opt.position == "center") {
			left = target.offset().left + target.outerWidth() / 2 - menu.outerWidth() / 2
		} else {
			if (opt.position == "right") {
				left = target.offset().left + target.outerWidth() - menu.outerWidth()
			} else {
				left = target.offset().left
			}
		}
		if (left + menu.outerWidth() > $(window).width()) {
			left = $(window).width() - menu.outerWidth()
		}
		var top = target.offset().top + target.outerHeight();
		if (opt.autoPosition && top + opt.offsetY + menu.outerHeight() > $(window).height() + $(document).scrollTop()) {
			menu.css({
				top: $(window).height() - menu.outerHeight() + $(document).scrollTop(),
				left: left + opt.offsetX
			})
		} else {
			menu.css({
				top: top + opt.offsetY,
				left: left + opt.offsetX
			})
		}
	};
	$.simpleAlert = function(msg, type, delay) {
		if (msg == "close") {
			$("#simplealert").remove();
			return
		}
		if ($("#simplealert").length) {
			$("#simplealert").remove()
		}
		var alertType = "simplealert-icon-info";
		if (type) {
			alertType = "simplealert-icon-" + type
		}
		var simpleAlert = $("<div id='simplealert' class='simplealert'></div>").appendTo("body");
		var html = "<div class='" + alertType + "'>";
		if (type == "loading") {
			html += "<img src='/images/default/designer/loading.gif' style='margin:10px 0px 0px 12px'/>"
		}
		html += "</div><div class='simplealert-msg'>" + msg + "</div><div class='simplealert-right'></div>";
		simpleAlert.html(html);
		simpleAlert.css("top", ($(window).height() - simpleAlert.height()) / 2 + $(window).scrollTop() + "px");
		simpleAlert.css("left", ($(window).width() - simpleAlert.width()) / 2 + $(window).scrollLeft() + "px");
		simpleAlert.show();
		if (delay != "no") {
			setTimeout(function() {
				simpleAlert.fadeOut(200)
			}, delay ? delay : 3500)
		}
	};
	$.fn.tooltip = function(content, type, fade) {
		var tip;
		type = type ? type : "warning";
		if (type != "none") {
			content = "<img src='/images/icon/ico-" + type + ".png' style='vertical-align:middle;margin-right:5px;'/><span>" + content + "</span>"
		}
		if ($("p#p_toolTip").length) {
			$("p#p_toolTip").remove()
		}
		$("body").append('<p id="p_toolTip" class="radius3"><img id="img_toolTip_Arrow" src="/images/icon/arrow-left.png" />' + content + "</p>");
		tip = $("p#p_toolTip");
		$("p#p_toolTip #img_toolTip_Arrow").css({
			position: "absolute",
			top: "5px",
			left: "-13px"
		});
		if (!fade) {
			tip.show()
		} else {
			tip.fadeIn("fast")
		}
		tip.css({
			left: $(this).offset().left + $(this).width() + 18,
			top: $(this).offset().top - 16
		})
	};
	$.closeTooltip = function() {
		$("p#p_toolTip").remove()
	};
	$.fn.draggable = function(options) {
		var defaults = {
			target: $(this)
		};
		var opt = $.extend(defaults, options);
		$(this).unbind("dragstart").bind("dragstart", function() {
			return false
		});
		$(this).unbind("mousedown.drag").bind("mousedown.drag", function(e) {
			$(document).bind("selectstart", function() {
				return false
			});
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = opt.target.offset().left;
			var downTop = opt.target.offset().top;
			$(document).bind("mousemove.drag", function(e) {
				var left = e.pageX - downX + downLeft;
				var top = e.pageY - downY + downTop;
				if (opt.bounding) {
					var boundingleft = opt.bounding.offset().left;
					var boundingtop = opt.bounding.offset().top;
					if (left > boundingleft && top > boundingtop && left < boundingleft + opt.bounding.outerWidth() - opt.target.outerWidth() && top < boundingtop + opt.bounding.outerHeight() - opt.target.outerHeight()) {
						opt.target.offset({
							left: left,
							top: top
						})
					}
				} else {
					opt.target.offset({
						left: left,
						top: top
					})
				}
			});
			$(document).bind("mouseup.drag", function(e) {
				$(document).unbind("selectstart");
				$(document).unbind("mousemove.drag");
				$(document).unbind("mouseup.drag")
			})
		})
	};
	$.fn.suggest = function(options) {
		var target = $(this);
		var defaults = {
			valueField: "value",
			width: target.outerWidth(),
			format: function(item) {
				return item.text
			}
		};
		var opt = $.extend(defaults, options);
		if (!target.data("suggest")) {
			var menu = $("<ul class='suggest_menu'></ul>").appendTo("body");
			menu.width(opt.width);
			target.data("suggest", menu)
		}
		var index = -1;
		var last = "";
		target.unbind("keydown.suggest").bind("keydown.suggest", function(e) {
			var suggest = target.data("suggest");
			if (e.keyCode == 40) {
				e.preventDefault();
				if (index < suggest.children().length - 1) {
					index++;
					suggest.find(".selected").removeClass("selected");
					suggest.find("li[index=" + index + "]").addClass("selected")
				}
			} else {
				if (e.keyCode == 38) {
					e.preventDefault();
					suggest.find(".selected").removeClass("selected");
					if (index >= 0) {
						index--;
						suggest.find("li[index=" + index + "]").addClass("selected")
					}
				} else {
					if (e.keyCode == 13) {
						var selected = suggest.find(".selected");
						if (selected.length) {
							target.val(selected.attr("val"))
						}
						if (opt.onEnter) {
							opt.onEnter(target)
						}
						suggest.empty().popMenu("close")
					}
				}
			}
		}).unbind("keyup.suggest").bind("keyup.suggest", function(e) {
			var suggest = target.data("suggest");
			var value = target.val();
			if (value == "") {
				suggest.empty().popMenu("close")
			} else {
				if (value != last) {
					index = -1;
					$.get(opt.url, {
						q: value
					}, function(data) {
						suggest.empty();
						var items = data.items;
						if (items.length == 0) {
							suggest.empty().popMenu("close")
						} else {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var itemHtml = "<li index='" + i + "' class='suggest_item' val='" + item[opt.valueField] + "'>";
								itemHtml += opt.format(item);
								itemHtml += "</li>";
								suggest.append(itemHtml)
							}
							suggest.popMenu({
								target: target,
								zindex: 4
							});
							suggest.find(".suggest_item").bind("mousedown", function(e) {
								e.preventDefault();
								target.val($(this).attr("val"));
								if (opt.onEnter) {
									opt.onEnter(target)
								}
								suggest.empty().popMenu("close")
							})
						}
					})
				}
			}
			last = value
		}).unbind("blur.suggest").bind("blur.suggest", function(e) {
			var suggest = target.data("suggest");
			suggest.empty().popMenu("close")
		})
	};
	$.fn.pagination = function(curPage, totalPage, clickHandler, barCount) {
		if (totalPage <= 0) {
			return
		}
		var pageBarNum = 5;
		if (barCount) {
			pageBarNum = barCount
		}
		var tar = $(this).addClass("pagination");
		var start = 1;
		var end = totalPage;
		if (totalPage > pageBarNum) {
			var index = Math.floor(pageBarNum / 2);
			var start = (curPage - index) > 0 ? (curPage - index) : 1;
			if (totalPage - start < pageBarNum) {
				start = totalPage - pageBarNum + 1
			}
			var end = start + pageBarNum - 1
		}
		var pageHtml = "";
		if (curPage > 1) {
			pageHtml += "<a p='" + (curPage - 1) + "'>«</a>"
		} else {
			pageHtml += "<a class='disabled'>«</a>"
		}
		if (start >= 2) {
			pageHtml += "<a p='1'>1</a>"
		}
		if (start >= 3) {
			pageHtml += "<a class='disabled ellipsis'>...</a>"
		}
		for (var i = start; i <= end; i++) {
			if (i > totalPage) {
				break
			}
			if (i == curPage) {
				pageHtml += '<a class="disabled">' + i + "</a>"
			} else {
				pageHtml += "<a p='" + i + "'>" + i + "</a>"
			}
		}
		if (end <= totalPage - 2) {
			pageHtml += "<a class='disabled ellipsis'>...</a><a p='" + totalPage + "'>" + totalPage + "</a>"
		} else {
			if (end <= totalPage - 1) {
				pageHtml += "<a p='" + totalPage + "'>" + totalPage + "</a>"
			}
		}
		if (curPage < totalPage) {
			pageHtml += "<a p='" + (curPage + 1) + "'>»</a>"
		} else {
			pageHtml += "<a class='disabled'>»</a>"
		}
		tar.html(pageHtml);
		if (clickHandler) {
			tar.find("a[p]").bind("click", function() {
				var page = $(this).attr("p");
				clickHandler(page)
			})
		}
	};
	$.fn.fileSize = function() {
		var target = this.get(0);
		var fileSize = 0;
		if ($.browser.msie && !target.files) {
			var filePath = target.value;
			var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
			var file = fileSystem.GetFile(filePath);
			fileSize = file.Size
		} else {
			fileSize = target.files[0].size
		}
		return fileSize * 1024
	};
	$.fn.errorTip = function(content, type) {
		var tip;
		var classType = "error";
		if ($(".signin-error").length) {
			$(".signin-error").remove()
		}
		if (type != null) {
			classType = type
		}
		var html = '<span class="signin-error"><span class="signin-' + classType + '-tip">' + content + '<label class="signin-' + classType + '-tip-arrow right"></label><label class="signin-' + classType + '-tip-arrow right1"></label></span></span>';
		if ($(this).offset().left < 200) {
			html = '<span class="signin-error"><span class="signin-' + classType + '-tip">' + content + '<label class="signin-' + classType + '-tip-arrow left"></label><label class="signin-' + classType + '-tip-arrow left1"></label></span></span>'
		}
		$("body").append(html);
		tip = $(".signin-error");
		tip.css({
			left: $(this).offset().left - tip.width(),
			top: $(this).offset().top + $(this).height() / 2 - 7,
			opacity: "0",
			filter: "alpha(opacity=0)"
		});
		$(this).addClass(classType);
		if ($(this).offset().left < 200) {
			tip.animate({
				left: $(this).offset().left + tip.width(),
				top: $(this).offset().top + $(this).height() / 2 - 7,
				opacity: "0.7",
				filter: "alpha(opacity=70)"
			}, 200)
		} else {
			tip.animate({
				left: $(this).offset().left - tip.width() - 14,
				top: $(this).offset().top + $(this).height() / 2 - 7,
				opacity: "0.7",
				filter: "alpha(opacity=70)"
			}, 200)
		}
	};
	$.closeErrorTip = function() {
		$(".signin-error").remove();
		$("input.error").removeClass("error")
	}
})(jQuery);
String.prototype.isEmpty = function() {
	if (this.replace(/(^\s*)|(\s*$)/g, "").length <= 0) {
		return true
	} else {
		return false
	}
};
String.prototype.notEmpty = function() {
	return !this.isEmpty()
};
String.prototype.isEmail = function() {
	if (this.isEmpty() || (!/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/.test(this))) {
		return false
	} else {
		return true
	}
};
String.prototype.isPhoneNumber = function() {
	if (this.isEmpty() || (!/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(this))) {
		return false
	} else {
		return true
	}
};
String.prototype.minLength = function(minNum) {
	if (this.length >= minNum) {
		return true
	} else {
		return false
	}
};
String.prototype.maxLength = function(maxNum) {
	if (this.length <= maxNum) {
		return true
	} else {
		return false
	}
};
String.prototype.cut = function(len, s) {
	var resultStr = "";
	if (this == "") {
		return resultStr
	}
	if (typeof s == "undefined") {
		s = "..."
	}
	var strLen = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			strLen += 2
		} else {
			strLen++
		}
	}
	if (strLen <= len) {
		return this.toString()
	}
	strLen = 0;
	len = (len > s.length) ? len - s.length : len;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			strLen += 2
		} else {
			strLen++
		}
		if (strLen > len) {
			resultStr += s;
			break
		}
		resultStr += this.charAt(i)
	}
	return resultStr
};
String.prototype.byteLength = function() {
	var strLen = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			strLen += 2
		} else {
			strLen++
		}
	}
	return strLen
};

function initTemplateCategorySelect() {
	$("#template-category-select li").unbind().bind("click", function() {
		$(".template-category li").removeClass("current");
		$(this).addClass("current");
		var category = $(this).attr("category");
		getTemplates(category)
	});
	$(".item-container").die().live("click", function() {
		$(".template_selected").removeClass("template_selected");
		$(this).addClass("template_selected");
		$("#template_select_ok").enable()
	}).live("dblclick", function() {
		templateSelected()
	})
}
function getTemplates(category) {
	Util.get("/diagraming/gettemplates", {
		category: category
	}, function(data) {
		if (category == "my_template") {
			$(".template-select").remove()
		} else {
			$(".template-select[chartId!='']").remove();
			if ($(".template-select[chartId='']").length == 0) {
				$("#template-container").append('<div class="item-container template-select template_selected radius3" chartId=""><div></div>空模板</div>')
			}
		}
		for (var i = 0; i < data.templates.length; i++) {
			var tem = data.templates[i];
			$("#template-container").append('<div define="' + tem.chartId + '" class="item-container template-select radius3"><div><img src="/file/response/' + tem.thumbnail + '/chart_image"/></div>' + tem.title + "</div>")
		}
		var selected = $(".template_selected");
		if (selected.length <= 0) {
			$("#template_select_ok").disable()
		}
	})
}
var globalNewTeamId;
var globalNewFolderId;

function globalNewDialog(teamId, folderId, source) {
	globalNewTeamId = teamId;
	globalNewFolderId = folderId;
	if ($("#dialog_new_diagram").length == 0) {
		Util.ajax({
			url: "/diagraming/new_dialog",
			data: {},
			success: function(data) {
				$("body").append(data);
				$("#dialog_new_diagram").dialog();
				initTemplateCategorySelect();
				$("#template_select_ok").bind("click", function() {
					templateSelected(source)
				});
				$("#template_select_cancel").bind("click", function() {
					$("#dialog_new_diagram").dialog("close")
				});
				getTemplates("uncategorized")
			}
		})
	} else {
		$("#dialog_new_diagram").dialog()
	}
}
function templateSelected(source) {
	var selected = $(".template_selected");
	if (selected.length <= 0) {
		return
	}
	var currentTag = $("#template-category-select li.current");
	var category = currentTag.attr("category");
	var templateId = selected.attr("define");
	if (!templateId) {
		templateId = ""
	}
	$("#dialog_new_diagram").dialog("close");
	var url = "/diagraming/new?template=" + templateId + "&category=" + category;
	if (category == "my_template") {
		url = "/diagrams/new_from_template?chartId=" + templateId
	}
	if (source == "template") {
		url = "/diagraming/new?template=" + templateId + "&category=" + category + "&istemplate=true"
	}
	if (globalNewTeamId) {
		url += "&team=" + globalNewTeamId
	}
	if (globalNewFolderId) {
		url += "&folder=" + globalNewFolderId
	}
	window.location.href = url
};