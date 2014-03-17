<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">


  
<link type="text/css" rel="stylesheet" href="assets/themes/default/global_zh.css?1392631465">

<script type="text/javascript" src="assets/scripts/jquery.js"></script>
<script type="text/javascript" charset="UTF-8" src="assets/scripts_bin/zh/util.js?1389753396"></script>
<link type="text/css" rel="stylesheet" href="assets/themes/default/diagrams/style.css?1388393859">

<script type="text/javascript" charset="UTF-8" src="assets/scripts_bin/zh/diagrams/diagrams.js?1389928218"></script>
<title>我的文件 | ProcessOn</title>
</head>
<body style="overflow-x: hidden;">




 
<div style="position: absolute; top: -100px">
	<a href="/archiver">Archiver</a>
</div>
<script type="text/javascript">
$(function(){
	$("#global_input").focus(function(){
		$("#header_nav .global_search").addClass("focus");
	}).blur(function(){
		$("#header_nav .global_search").removeClass("focus");
	});
	$("#global_input").on("keyup", function(e){
		var keyCode = e.which || e.keyCode;
		if(keyCode == 13){
			doSearch();
		}
	});
	$("#header_nav .global_search .search_icon").bind("click", function(){
		if($(".global_search").find(".global_search_box").hasClass("focus")){
			doSearch();
		}
	});
});
function doSearch(){
	var _value = $.trim($("#global_input").val());
	if(_value == ""){
		$("#global_input").val("").focus();
	}else{
		window.location = "/search?p="+_value
	}
}
</script>
<div id="header">
	<div id="header_nav">
			
				<div id="header-user" class="header-user radius3">
					<img src="assets/images/default/photo.png" border="0" width="25px" height="25px" class="radius3" style="vertical-align: middle;">
					正飞啊飞
					<span class="drop"></span>
				</div>
				<!-- <div class="header-op">
				   <a href="javascript:" onclick="globalNewDialog()">新建文件</a>
				   <span>|</span>
				   <a href="/diagrams">我的文件</a>
				   <span>|</span>
				   <a href="/network">我的网络</a>
				</div> -->
				<a href="/network#notification" class="badge warning notification_badge" title="未读通知" style="display: none;">0</a>
				<ul id="header_user_menu" class="popmenu shadow_1 radius3">
					<li><a href="/u/52b428230cf279d737e329b2/profile">个人主页</a></li>
					<li><a href="/setting">账户设置</a></li>
					<li><a href="/login/out">退出</a></li>
				</ul>
			
			
			
			<div class="header_nav_items">
				<!-- <a class="logo" href="/">
					<img src="/images/default/logo/logo_m.png">
				</a>
				<a class="nav" href="/popular">推荐</a>
				<a class="nav" href="/explore">发现</a>
				<a class="nav" href="/teams">小组</a>
				<a class="nav" href="/events">活动</a> -->
				<a class="nav" href="/support">帮助</a>
			</div>
			<!-- global search box -->
			<!-- <div class="global_search">
				<div class="search_icon" title="搜索"></div>
				<div class="global_search_box focus">
					<input type="text" id="global_input" name="global_input" value="" placeholder="搜索">
				</div>
			</div> -->
			<!-- global search box END-->
	</div>
</div>
<div id="header_clear" style="width:100%;clear:both;height:38px;"></div>


<div class="layout_container">
	<div class="bench_layout layout_left" style="height: 871px;">
		<h2>我的文件</h2>
		<div style="text-align: center;">
			<a href="javascript:" onclick="globalNewDialog()" class="button default">新建文件</a>
		</div>
		<ul class="left_nav">
			<li>
				<div resource="" class="active" onclick="DM.load({resource: '', folderId: ''})">
					<span class="ico folder"></span>
					我的文件
				</div>
			</li>
			<li>
				<div resource="collaboration" class="child" onclick="DM.load({resource: 'collaboration', page: 1})">
					<span class="ico collaborated"></span>
					与我协作的
				</div>
			</li>
			<li>
				<div resource="team" class="child" onclick="DM.load({resource: 'team', folderId: 'root'})">
					<span class="ico teams"></span>
					来自我的小组的
				</div>
			</li>
			<li class="separator"></li>
			<li>
				<div resource="fav" onclick="DM.load({resource: 'fav', page: 1})">
					<span class="ico folder_like"></span>
					我喜欢的
				</div>
			</li>
			<li class="separator"></li>
			<li>
				<div resource="attach" onclick="DM.load({resource: 'attach', page: 1})">
					<span class="ico attach"></span>
					附件
				</div>
			</li>
			<li class="separator"></li>
			<li>
				<div resource="trash" onclick="DM.load({resource: 'trash', folderId: ''})">
					<span class="ico trash"></span>
					回收站
				</div>
			</li>
			
		</ul>
	</div>
	<div class="bench_layout layout_main" style="height: 871px;">
		<div id="content">
<input type="hidden" value="zh" id="_locale">
<input type="hidden" value="" id="_searchTitle">
<div class="dir">
	<a href="javascript:" folderid="root" onclick="DM.load({folderId: 'root', searchTitle: ''})">我的文件</a>
	
	
	
	
	<input id="diagrams_title" name="diagrams_title" type="text" class="search_input" placeholder="文件搜索" value="">
</div>
<div class="main_btns">
	<span class="button" onclick="DM.showTitleEdit('new')">
		<span class="ico bt folder_add"></span>
		新建文件夹
	</span>
	<div class="btn_group">
		<!-- <span class="button" onclick="globalNewDialog()"> -->
		<span class="button" onclick="DM.showMoreMenu(this)">
			<span class="ico bt dm_add"></span>
			新建<span class="drop"></span>
		</span>
		<span class="button" onclick="DM.openFileImportWin()">
			<span class="ico bt import"></span>
			导入
		</span>
	</div>
	<!-- <span class="button green btn_operation" onclick="DM.showPublish()"> -->
	<span class="button green btn_operation" onclick="DM.showShareMenu(this)">
		<span class="ico bt publish"></span>
		分享<span class="drop" style="background-position: -16px -179px"></span>
	</span>
	<span class="button btn_operation" onclick="DM.deleteConfirm()">
		<span class="ico bt delete"></span>
		删除
	</span>
	<span class="button btn_operation" onclick="DM.showMoreMenu(this)">
		更多<span class="drop"></span>
	</span>
	<ul class="right">
		<li>
			<span class="button" onclick="DM.showSort(this)">
				排序
				<span class="drop"></span>
			</span>
		</li>
		<!-- <li>
			<div class="viewtype">
				<span class="list " onclick="DM.load({view: 'list'})" original-title="List view"></span>
				<span class="icon current" onclick="DM.load({view: 'icon'})" original-title="Icon view"></span>
			</div>
		</li> -->
	</ul>
</div>
<div class="content_container">
	<ul class="content_layout content_main item_list" style="height: 775px;">
		<%-- <li ondblclick="location.href='assets//diagraming/52f8ba380cf219d80f344e7c'" class="file_item icon_item" istemplate="false" ispublish="private" tp="chart" category="uncategorized" id="52f8ba380cf219d80f344e7c" img="assets/images/default/chart_image.png" date="2014-02-10 19:38" modify="2014-02-10 19:39" tit="easydata-v1">
			<div class="thumb">
				<img src="assets/images/default/chart_image.png" style="width: 198px; height: 198px;">
			</div>
			<div class="title" style="width: 200px;">
				<a href="<%=request.getContextPath()%>/sheet" target="_blank">easydata-v1</a>
			</div>
		</li> --%>
		<li class="header">
			<div class="title">标题</div>
			<div class="owner">拥有者</div>
			<div class="modified">最后修改</div>
		</li>
		
		
		<li ondblclick="location.href='<%=request.getContextPath()%>/sheet'" class="file_item list_item" istemplate="false" ispublish="private" tp="chart" category="uncategorized" id="531c542b0cf293635d7eee5e" img="/chart_image/thumb/531c542b0cf293635d7eee60.png" date='2014-03-09 19:44' modify='2014-03-09 19:44' tit="中国社会化媒体营销China Social Media Sites">
			<div class="title">
				<span class="ico diagram"></span><a href="<%=request.getContextPath()%>/sheet">六月流失用户分析</a>
				
			</div>
			<div class="owner">正飞啊飞</div>
			<div class="modified">2014-03-09 19:44</div>
		</li>
		
		<li ondblclick="location.href='<%=request.getContextPath()%>/sheet'" class="file_item list_item" istemplate="false" ispublish="private" tp="chart" category="uncategorized" id="52f8ba380cf219d80f344e7c" img="/chart_image/thumb/52f8ba8a0cf219d80f344f25.png" date='2014-02-10 19:38' modify='2014-02-10 19:39' tit="easydata-v1">
			<div class="title">
				<span class="ico diagram"></span><a href="<%=request.getContextPath()%>/sheet" target="blank">成交明细数据</a>
				
			</div>
			<div class="owner">正飞啊飞</div>
			<div class="modified">2014-02-10 19:39</div>
		</li>
		<li class="items_clear"></li>
	</ul>
</div>

<ul id="sort_menu" class="popmenu radius3 shadow_1">
	<li onclick="DM.load({sort: 'title'})">
		<span class="selected"></span>
		标题
	</li>
	<li onclick="DM.load({sort: 'lastModify'})">
		<span></span>
		最后修改
	</li>
</ul>
<ul id="more_menu_folder" class="popmenu radius3 shadow_1">
	<li onclick="DM.openFolder()">打开</li>
	<li onclick="DM.showTitleEdit('edit')">重命名</li>
	<li class="split"></li>
	<li class="move_copy" onclick="DM.showCopy()">移动和复制</li>
</ul>
<ul id="more_menu_chart" class="popmenu radius3 shadow_1">
	<li class="edit">编辑</li>
	<li class="view"><a href="javascript:" target="_blank">浏览</a></li>
	<li onclick="DM.newCreateConfirm()">克隆</li>
	<li class="split"></li>
	<li onclick="DM.showTitleEdit('edit')">重命名</li>
	<li onclick="DM.showCopy()">移动和复制</li>
</ul>
<ul id="coll_role_menu" class="popmenu radius3 shadow_1">
	<li role="editor">
		<span></span>
		编辑者
	</li>
	<li role="viewer">
		<span></span>
		浏览者
	</li>
</ul>
<ul id="share_menu" class="popmenu radius3 shadow_1">
	<li class="collaboration" onclick="DM.Colla.showAdd()">添加协作成员</li>
	<li class="split"></li>
	<li class="publish_processon" onclick="DM.showPublish()">发布到ProcessOn</li>
	<li class="embed_other_site" onclick="DM.showPublishEmbed()">嵌入到其他站点</li>
	<li class="split"></li>
	<li onclick="DM.showViewLink()">分享浏览链接</li>
	<li onclick="DM.showExport()">下载</li>
</ul>
<div id="import_file_window" title="选择本地文件">
	<form action="/folder/importOnlyVisioFile" enctype="multipart/form-data" method="post" name="import_visio_file" id="import_visio_file">
		<div class="import_content">
			<div id="selectfile_btn" class="selectfile_btn button">
				<div class="ico"></div>
				选择文件
				<input type="file" name="importVisiopath" id="importVisiopath" onchange="fileChange()">
				<input type="hidden" name="teamId" id="teamId" value="">
			</div>
			<div class="only_visio_file">请上传一个Visio文件(*.vdx),当前我们仅支持Visio中的Cross-function | Flowchart</div>
			<div class="import_file_wraper">
				<label>文件名:</label><input type="text" class="txt" name="fileName" id="fileName">
			</div>
			<div id="import_error" class="alert error"></div>
			<div id="import_success" class="alert success"></div>
		</div>
		<div class="import_visio_btns">
			<span class="button default submit_btn" onclick="importBtnSubmit()">导入 </span>
			<span class="button" onclick="$('#import_file_window').dialog('close')">取消 </span>
		</div>
	</form>
</div>
<div id="view_link_window" title="分享浏览链接" style="display:none;position:relative;overflow:hidden;width:530px;min-height: 310px;">
	<div class="create_view_link">
		<h3 style="font-weight: 100px;"><span class="_tip1">创建分享浏览链接</span>-“<span class="_tip2"></span>”</h3>
		<div>
			<input type="text" id="_view_link_input" class="transition_0_2 txt" onclick="$(this).select();" style="display:inline-block;line-height:25px;height: 25px;width:98%;float:left;" placeholder="您还没有给文件创建分享链接"><label class="create button" style="line-height: 35px;display:inline-block;float:right;" onclick="DM.createViewLink(this)">创建浏览链接 </label>
			<div style="clear:both;"></div>
		</div>
		<div class="create_dis" style="position:relative;margin: auto;margin-top: 17px;height: 100px;font-size: 13px;text-shadow: 0px 1px 0px rgba(255,255,255,0.3);background: #deecf9;text-align:left;line-height: 20px;padding:15px 20px;border: 1px solid #b5bdc5;word-wrap: break-word;word-break: normal; ">
			<p>希望分享给别人，又不想完全公开？您可以在此创建一个浏览链接，分享给别人后，可以通过此链接来安全地浏览您的文件。 </p>
			<p>当然，您也可以给浏览链接添加密码，以便您享有更多的控制权限。 </p>
		</div>
		<div class="create_btns" style="text-align:right;margin-top:17px;position:relative;">
			<span class="button default" onclick="$('#view_link_window').dialog('close');">关闭</span>
		</div>
	</div>
</div>
</div>
	</div>
</div>

<div id="dlg_new_folder" style="width:350px;display:none">
	<div class="dlg_content">
		<label>名称：</label>&nbsp;&nbsp;&nbsp;&nbsp;
		<input id="folder_new_title" type="text" class="txt">
	</div>
	<div class="dlg_buttons">
		<input type="button" id="btn_submit_folder" class="button default" value="确定">&nbsp;&nbsp;
		<input type="button" class="button" onclick="$('#dlg_new_folder').dialog('close')" value="取消">
	</div>
</div>

<div id="dlg_copy" style="width:420px;height:180px;display:none" title="移动/复制 选中的项">
	<div class="dlg_content">
		<span style="font-weight: bold;">请选择您想复制/粘贴到的目标文件夹：</span>
		<span class="button" style="display:block; text-align:left; margin-top: 5px;" onclick="DM.dropFolderList(this)">
			<span class="drop" style="float:right; margin-top:8px;"></span>
			<span class="changer_folder" folderid="root">我的文件</span>
		</span>
	</div>
	<div class="dlg_buttons">
		<img id="move_copy_progress" style="display:none;" src="/images/default/loading.gif">
		<span href="javascript:" id="btn_submit_move" class="button" onclick="">移动</span>&nbsp;&nbsp;
		<span href="javascript:" id="btn_submit_copy" class="button" onclick="">复制</span>&nbsp;&nbsp;
		<span href="javascript:" class="button" onclick="$('#dlg_copy').dialog('close')">取消</span>
	</div>
</div>

<div id="folderlist_panel" class="radius3 shadow_1" style="width:355px;max-height:320px; overflow-y:auto;">
</div>


<div id="dlg_publish" style="display:none;width: 515px;min-height: 300px;overflow:hidden;" title="发布到ProcessOn">
	<div id="publish_show_link" class="dlg_publish_tip _content" style="display:none;padding:0px;margin-top: 50px;">
		<div style="height: 180px;background: #F7F7F7;border: 1px solid #c7cfd7;">
			<div style="font-size: 15px;line-height: 20px;margin-top: -25px;padding-bottom: 10px;">
				当前文件状态为已发布，您可以：
			</div>
			<div style="text-align:center;padding-top:16px;width: 340px;margin: auto;">
				<div id="btn_submit_private" class="dlg_publish_op">
					<span style="margin-top:20px;padding-top:55px;display:block;height:80px;text-align: center;">
						<span class="bg back"></span>
						取消发布
					</span>
				</div>
				<div style="width:40px;float:left;display:inline-block;height:100px;text-align:center;line-height:100px;">
					或者
				</div>
				<div id="to_publish_edit" class="dlg_publish_op">
					<span style="margin-top:20px;padding-top:55px;display:block;height:80px;text-align: center;">
						<span class="bg edit"></span>
						修改发布信息
					</span>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="dlg_buttons" style="margin: 0px;padding-top: 13px;">
			<span id="btn_submit_close" class="button" onclick="$('#dlg_publish').dialog('close')">
			关闭
			</span>
		</div>
	</div>
	<div class="_publish_content publish_opt  _content" style="display:none;width: 509px;height: 400px;text-align:left;margin: auto;">
		<div id="publish_show_tip" class="dlg_publish_tip">
			发布之后第一时间推荐到首页，可以获取业界专家点评和用户分享，可以结交新朋友。
		</div>
		
		<div class="decript_title _title" style="width:40px;">描述：</div>
		<textarea id="publish_description" class="txt" style="display: inline-block;width: 420px;height: 50px;margin-top: 10px;margin-bottom: 10px;"></textarea>
		
		
		
		<div class="tags_title _title" style="width:40px;">标签：</div>
		<div id="publish_addtags" class="feedTags" onclick="$('#tag_input').focus();" style="width: 420px;">
       		<div id="tag_items" class="input_item_box"></div>
			<input id="tag_input" type="text">
		</div>
		
		
		<div style="margin-bottom: 10px;margin-top:10px;">
		
		<div class="category_title _title" style="width:40px;">分类：</div>
		<select id="publish_industry" class="txt" style="width: 230px;display:inline-block;">
		
			
				<option value="" style="color:#c9c9c9">
					选择分类
				</option>
        		
        				<option value="10010">
        					资产管理
        				</option>
        				
        				<option value="11074">
        					业务流程管理与改进
        				</option>
        				
        				<option value="10006">
        					客户服务
        				</option>
        				
        				<option value="11179">
        					环境健康与安全
        				</option>
        				
        				<option value="10012">
        					外部关系
        				</option>
        				
        				<option value="10009">
        					财务
        				</option>
        				
        				<option value="10007">
        					人力资源
        				</option>
        				
        				<option value="10008">
        					信息技术
        				</option>
        				
        				<option value="10013">
        					知识管理
        				</option>
        				
        				<option value="10004">
        					市场与销售
        				</option>
        				
        				<option value="10003">
        					产品开发与服务
        				</option>
        				
        				<option value="10005">
        					供应链
        				</option>
        				
        				<option value="10002">
        					愿景与战略
        				</option>
        				
        				<option value="science">
        					学术
        				</option>
        				
        				<option value="life">
        					生活
        				</option>
        				
			 </select>
		</div>
		<div style="margin-bottom: 10px;">
		
		<div class="language_title _title" style="width:40px;">语言：</div>
		<select id="publish_language" class="txt" style="width:230px;display:inline-block;margin-top: 5px;">
		
			
				<option value="" style="color:#c9c9c9">
				选择语言
				</option>
        		
        				<option value="pt-BR">
        					葡萄牙语（巴西）
        				</option>
        				
        				<option value="fr-CA">
        					加拿大法语
        				</option>
        				
        				<option value="zh-CN">
        					中文简体
        				</option>
        				
        				<option value="cs">
        					捷克语
        				</option>
        				
        				<option value="da">
        					丹麦文
        				</option>
        				
        				<option value="nl">
        					菏兰语
        				</option>
        				
        				<option value="en">
        					英语
        				</option>
        				
        				<option value="fi">
        					芬兰语
        				</option>
        				
        				<option value="fr">
        					法语
        				</option>
        				
        				<option value="de">
        					德语
        				</option>
        				
        				<option value="hu">
        					匈牙利语
        				</option>
        				
        				<option value="it">
        					意大利语
        				</option>
        				
        				<option value="ja">
        					日语
        				</option>
        				
        				<option value="ko">
        					韩语
        				</option>
        				
        				<option value="no">
        					挪威语
        				</option>
        				
        				<option value="pl">
        					波兰语
        				</option>
        				
        				<option value="pt">
        					葡萄牙语
        				</option>
        				
        				<option value="ru">
        					俄语
        				</option>
        				
        				<option value="sk">
        					斯洛伐克
        				</option>
        				
        				<option value="es">
        					西班牙语
        				</option>
        				
        				<option value="sv">
        					瑞典语
        				</option>
        				
			 </select>
		</div>
		
		<div class="publish_setting" style="height:50px;line-height:50px;text-align:left;margin:10px 0px;">
		
		
			<div style="height:25px;line-height:25px;text-align:left;">
				<input type="checkbox" name="public_edit" class="checkbox" id="public_edit">
				<label style="display:inline-block;line-height:25px;">
					开放编辑
					<font style="color:#948b88;">&nbsp;&nbsp;(其他人可以和你一起编辑这个文件。)</font>
				</label>
			</div>
			<div style="height:25px;line-height:25px;text-align:left;margin:10px 0px;">
				<input type="checkbox" name="as_template" class="checkbox" id="as_template">
				<label style="display:inline-block;line-height:25px;">
					允许克隆
					<font style="color:#948b88;">&nbsp;&nbsp;(其他人可以使用并创建新的文件。)</font>
				</label>
			</div>
		</div>
		<div class="dlg_buttons" style="margin-top: 0px;padding-top: 5px;">
			
				<span id="sync_sina" style="margin-right:15px;" class="sync sina"></span>
			 
			<span id="btn_submit_publish" class="button default">
				确定
			</span>&nbsp;&nbsp;
			<span id="btn_submit_close" class="button" onclick="$('#dlg_publish').dialog('close')">
			取消
			</span>
		</div>
	</div>
</div>

<div id="dlg_publish_embed" style="display:none;overflow:hidden;width: 800px;height: 390px;" title="嵌入到其他站点">
	<div style="float:left;overflow:auto;width: 450px;height: 330px;position:relative;border: 1px solid #999;box-shadow:inset 0px 0px 15px rgba(0,0,0,0.5);-webkit-box-shadow:inset 0px 0px 15px rgba(0,0,0,0.5);-moz-box-shadow:inset 0px 0px 15px rgba(0,0,0,0.5);-o-box-shadow:inset 0px 0px 15px rgba(0,0,0,0.5);-ms-box-shadow:inset 0px 0px 15px rgba(0,0,0,0.5);">
		<div class="embed_preview_wrap" style="max-width:450px;max-height:330px;position:absolute;top:50%;left:50%;">
			<div class="embed_preview" style="margin:auto;"></div>
		</div>
	</div>
	
	<div class="embed_attributes" style="width: 320px;height: 330px;float:right;margin-left:25px;position: relative;">
		<div id="embed_show_tip" class="dlg_publish_tip">
			通过下面的代码，您可以将你的文件嵌入到其他网站实现更好的分享和推广。
		</div>
		<div class="copy_descr">复制下面的代码： </div>
		<textarea id="iframe_html" class="iframe_html txt" readonly="readonly"></textarea>
		<div class="embed_size" style="width: 100%;margin-top: 5px;">
			<label for="embed_width" style="font-weight: bold;margin: 0px 5px;">宽度:</label><input type="text" id="embed_width" name="embed_width" class="txt" style="width: 35px;" value="430"><label for="embed_width">px</label>,
			<label for="embed_height" style="font-weight: bold;margin: 0px 5px;">高度:</label><input type="text" id="embed_height" name="embed_height" class="txt" style="width: 35px;" value="320"><label for="embed_height">px</label>
		</div>
		<div style="position: absolute;width: 100%;text-align:right;bottom:-10px;right:0px;">
			<span id="btn_submit_close" class="button" onclick="$('#dlg_publish_embed').dialog('close')">
			关闭
			</span>
		</div>
	</div>
	<div style="clear:both;"></div>
</div>

<div id="dlg_export" title="下载" style="min-width:400px; height:auto; display:none;">
	<div class="export-box">
		<ul class="export-list">
			<li class="first">
				<input id="export_png" type="radio" name="export-format" value="image" checked="checked" style="float:left;margin-right: 5px;">
				<label for="export_png" class="export-menu" style="float:left;line-height: 18px;">
					图片文件 <span class="suffix">(*.png)</span>
					<span class="export_des">将文件导出成图片</span>
				</label>
				<div style="clear: both;"></div>
			</li>
		</ul>
		<ul class="export-list">
			<li class="first">
				<input id="export_pdf" type="radio" name="export-format" value="pdf" style="float:left;margin-right: 5px;">
				<label for="export_pdf" class="export-menu" style="float:left;line-height: 18px;">
					PDF文件 <span class="suffix">(*.pdf)</span>
					<span class="export_des">由图片保存成的PDF文件</span>
				</label>
				<div style="clear: both;"></div>
			</li>
		</ul>
		<ul class="export-list">
			<li class="first">
				<input id="export_pos" type="radio" name="export-format" value="pos" style="float:left;margin-right: 5px;">
				<label for="export_pos" class="export-menu" style="float:left;line-height: 18px;">
					POS文件 <span class="suffix">(*.pos)</span>
					<span class="export_des">包含图片与图形结构定义</span>
				</label>
				<div style="clear: both;"></div>
			</li>
		</ul>
	</div>
	<form id="export_form" action="/diagram_export" method="post" style="display:none">
		<input id="export_type" name="type" type="hidden" value="">
		<input id="export_id" name="id" type="hidden" value="">
	</form>
	<div class="dlg_buttons">
		<span id="export_submit" class="button default" style="margin-right:10px" onclick="DM.doExport()">确定</span>
		<span class="button" onclick="$('#dlg_export').dialog('close')">取消</span>
	</div>
</div>

<div id="colla_add" title="添加协作成员" style="display: none">
	<div style="padding: 0px 20px 20px; width: 300px">
		<p id="add_step1">
			<span class="badge">1</span>
			输入受邀请人姓名或者邮箱。
		</p>
		<p id="add_step2">
			<span class="badge info">2</span>
			点击所选成员，即可邀请其加入您文件协作。
		</p>
		<input id="input_add_colla" type="text" class="txt" style="width: 282px; padding: 8px;">
		<div id="colla_suggest_box"></div>
	</div>
</div>
  
<!-- 新版设计器新建窗口-模板与分类选择 -->
<div id="dialog_new_diagram" style="width: 810px; position: fixed; top: 176.5px; left: 214px; display: none;" title="请选择分类与模板" class="">
	<div style="border:1px solid #CEDAE1; float:left;margin-top:5px; width:100%;">
		<div class="top-tip" style="width:160px; border-right:1px solid #CEDAE1; border-bottom:1px solid #CEDAE1;">分类</div>
		<div class="top-tip" style="width:628px;border-bottom:1px solid #CEDAE1;">模板</div>
		<div style="float:left;width:170px; border-right:1px solid #CEDAE1;height:380px">
			<ul id="template-category-select" class="template-category">
				<li category="flow">Flowchart流程图</li>
				<li category="bpmn">BPMN</li>
				<li category="evc">EVC企业价值链图</li>
				<li category="epc">EPC事件过程链图</li>
				<li category="uml">UML图</li>
				<li category="ui">UI界面原型图</li>
				<li category="ios">iOS界面原型图</li>
				<li category="org">Org组织结构图</li>
				<li category="venn">Venn维恩图</li>
				<li category="uncategorized" class="current">未分类</li>
<!-- 				<li style="height: 15px;line-height: 158px;padding-left: 10px;background: #eeeeee;"></li> -->

			</ul>
		</div>
		<div id="template-container" style="float:left;width:628px;height:380px;padding-left:10px;overflow:auto">
			<div class="item-container template-select template_selected radius3" chartid="">
				<div></div>
				空模板
			</div>
		<div define="526dc5c10cf22f64f62e93f5" class="item-container template-select radius3"><div><img src="asserts/images/default/chart_image.png"></div>Fishbone Diagram: Diagram Shows Cause and Effect</div></div>
		<div style="clear:both"></div>
	</div>
	<div style="clear:both"></div>
	<div class="dlg_buttons" style="padding-top:10px;text-align:right;">
		<a id="template_select_ok" href="javascript:" class="button default">确定</a>&nbsp;&nbsp;
		<a id="template_select_cancel" href="javascript:" class="button">取消</a>
	</div>
</div>
<div id="hover_tip" style="left: 1168px; top: 119px; display: none;"><div class="tip_arrow"></div><div class="tip_content radius3">List view</div></div></body></html>