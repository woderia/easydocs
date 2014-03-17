<%@page pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html id="html_id">
    <head>
        <title>gaoshuju </title>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
		<link rel="shortcut icon" href="assets/sheet/assets/sheet/img/favicon.ico">
        <link rel="stylesheet" type="text/css" href="assets/sheet/css/jquery.sheet.css" />
		<link rel="stylesheet" type="text/css" href="assets/sheet/css/indexStyle.css" />
        <link rel="stylesheet" type="text/css" href="assets/sheet/css/jquery-ui.css" />
        <link rel="stylesheet" type="text/css" href="assets/sheet/css/EwaCui.css">
        <link rel="stylesheet" type="text/css" href="assets/sheet/css/EwrDefault.css">

        <style type="text/css">
            .ui-widget-header a{
                color: black;
                display: inline-block;
            }
        </style>
        
        <script type="text/javascript">
            var sheetIndex,sheetFocus;
            var jS;
            window.onload = function(){
            	var screenHeight = screen.height;
                var screenHeight = (screenHeight < 800) ? screenHeight-230 : screenHeight-270;
                $('.jQuerySheet_small').css('height',screenHeight+'px');
                $('#jQuerySheetMy').sheet({
                    title: '',
                    buildSheet: jQuery.sheet.makeTable.fromSize("15x40"), 
                    autoFiller: true,
                    calcOff: false
                });
                
                sheetIndex=jQuery.sheet.instance.length-1;
                jS = jQuery.sheet.instance[sheetIndex];
                $("#div_tabContent").find("td").bind("click", function(){
                    sheetFocus = true
                })
                
                $("#div_tabContent").find("td").bind("dbclick", function(){
                    sheetFocus = true
                })

                //$('#jSheetTabContainer_0').remove();

                DsmMenuFun = {
                    sheetInstance: jQuery.sheet.instance[sheetIndex],
                    cellSearch: function() {
                        this.sheetInstance.cellFind();
                    },
                    styleTop: function(){
                        this.sheetInstance.cellStyleToggle('styleTop', 'styleMiddle styleBottom');
                    },
                    styleMiddle: function(){
                        this.sheetInstance.cellStyleToggle('styleMiddle', 'styleTop styleBottom');
                    },
                    styleBottom: function(){
                        this.sheetInstance.cellStyleToggle('styleBottom', 'styleTop styleMiddle');
                    },
                    styleCenter: function(){
                        this.sheetInstance.cellStyleToggle('styleCenter', 'styleLeft styleRight');
                    },
                    styleRight: function(){
                        this.sheetInstance.cellStyleToggle('styleRight', 'styleLeft styleCenter');
                    },
                    cellMerge: function(){
                        this.sheetInstance.merge();
                    },
                    cellUnMerge: function(){
                        this.sheetInstance.unmerge();
                    },
                    menuAddRow: function(){
                        this.sheetInstance.controlFactory.addRow(null, true);
                    },
                    menuAddRowMuti: function(){
                        this.sheetInstance.controlFactory.addRowMulti();
                    },
                    menuAddCol: function(){
                        this.sheetInstance.controlFactory.addColumn(null, true);
                    },
                    menuAddColMuti: function(){
                        this.sheetInstance.controlFactory.addColumnMulti();
                    },
                    menuDeleRow: function(){
                        this.sheetInstance.deleteRow();
                    },
                    menuDeleCol: function(){
                        this.sheetInstance.deleteColumn();
                    },
                    styleBold: function(){
                        this.sheetInstance.cellStyleToggle('styleBold');
                    },
                    styleItalics: function(){
                        this.sheetInstance.cellStyleToggle('styleItalics');
                    },
                    styleUnderline: function(){
                        this.sheetInstance.cellStyleToggle('styleUnderline', 'styleLineThrough');
                    },
                    fontSizeUp: function(){
                        this.sheetInstance.fontReSize('up');
                    },
                    fontSizeDown: function(){
                        this.sheetInstance.fontReSize('down');
                    },
                    hlink: function(){
                        this.sheetInstance.obj.formula().val('=HYPERLINK(\'' + prompt('è¯·è¾å¥é¾æ¥å°å', 'dsm.taobao.org') + '\')').keydown();
                    },
                    insertTitle: function(){
                        this.closeOtherDiv();
                        $('#Home-title').removeClass('ms-cui-tt-s');
                        $('#Insert-title').addClass('ms-cui-tt-s');
                        $('.ms-cui-tabContainer').empty();
                        $('.ms-cui-tabContainer').append($('#insertTitle').html());
                    },
                    insertHome: function(){
                        this.closeOtherDiv();
                        $('#Insert-title').removeClass('ms-cui-tt-s');
                        $('#Home-title').addClass('ms-cui-tt-s');
                        $('.ms-cui-tabContainer').empty();
                        $('.ms-cui-tabContainer').append($('#insertHome').html());
                    },
                    closeOtherDiv: function(){
                        var id = arguments[0];
                        $("#startmenu,#insertmenu,#deletemenu,#fillcolor,#fontcolor").each(function() {
                            if (this.id != id) {
                                if ($(this).css('display') != 'none') {
                                    $(this).css('display', 'none');
                                }
                            }
                        });
                    },
                    newReport: function(){
                        var query = getQuery(window.location);
                        window.open("addReport.htm?"+query);
                    }
                };
              
            }
        </script>
    </head>
    <body>
        <div id="pg_main"  style="width:100%;height:100%">
            <div id="div_tabContent" style="width:100%;height:100%">
                <div id="mainWrapper" style="height:99%;width:99%">
                    <div id="m_excelWebRenderer_ewaCtl_ribbonContainer">
                        <div id="m_excelWebRenderer_ewaCtl_ribbonPlaceHolder" class="loaded">
                            <div class="ms-cui-ribbon" id="m_excelWebRenderer_ewaCtl_Ribbon" unselectable="on" aria-describedby="ribboninstructions" oncontextmenu="return false" role="toolbar">
                                <div class="ms-cui-ribbonTopBars" unselectable="on">
                                    <div class="ms-cui-topBar2" unselectable="on">
                                        <div class="ms-cui-jewel-container" id="jewelcontainer" unselectable="on" style="display: block; ">
                                            <span class="ms-cui-jewel " unselectable="on">
                                                <span class="ms-cui-jewel-jewelMenuLauncher" unselectable="on">
                                                    <a unselectable="on" id="Start_title" href="javascript:;" onclick="showDiv('startmenu');DsmMenuFun.closeOtherDiv('startmenu');return false;" title="æä»¶">
                                                        <span id="m_excelWebRenderer_ewaCtl_Jewel-Default-middle" style="display: inline-block;width:44px; height: 24px; background-image: url(assets/sheet/img/startmenu.png); " class="" unselectable="on">
                                                            <span class="ms-cui-jewel-label" style="margin-left:10px;margin-top:4px;" unselectable="on">开始</span>
                                                        </span>
                                                    </a>
                                                </span>
                                            </span>
                                        </div>
                                        <ul class="ms-cui-tts " unselectable="on" role="tablist">
                                            <li class="ms-cui-tt  ms-cui-tt-s" id="Home-title" unselectable="on" role="tab" aria-selected="true" title="å¼å§">
                                                <a class="ms-cui-tt-a" unselectable="on" href="javascript:;" onclick="DsmMenuFun.insertHome();return false;" title="å¼å§" onkeypress="return true;">
                                                    <span class="ms-cui-tt-span" unselectable="on">开始</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="ms-cui-tabContainer" unselectable="on">
                                <ul class="ms-cui-tabBody ewaboot_rbgbbg" id="home" unselectable="on" role="tabpanel" aria-labelledby="m_excelWebRenderer_ewaCtl_Ribbon.Home-title">
                                        <li class="ms-cui-group" id="m_excelWebRenderer_ewaCtl_Ribbon.Home.Clipboard" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" unselectable="on">
                                                        <span class="ms-cui-section-alignmiddle" id="" unselectable="on">
                                                            <span class="ms-cui-row-tworow" unselectable="on">
                                                                <a class="ms-cui-ctl-medium " id="dsm_save" onclick=" saveOrsaveAs() ;return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/save.png" alt="ä¿å­"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on">开始</span>
                                                                </a>
                                                            </span>
                                                            <span class="ms-cui-row-tworow" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_saveas" onclick="openAsAnother();return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/saveas.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on">开始</span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="å¸¸ç¨">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" unselectable="on">
                                                        <span class="ms-cui-section" unselectable="on">
                                                            <span class="ms-cui-row-onerow" unselectable="on">
                                                                <span class="ms-cui-ctl-large" id="dsm_paste" mscui:controltype="SplitButton" title="ç²è´´åªè´´æ¿ä¸çåå®¹ã" unselectable="on" onclick="pasteCell()">
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a1 " role="button">
                                                                        <span class="ms-cui-ctl-a1Internal" unselectable="on">
                                                                            <span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                                <img class="ewaboot_paste32" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="ç²è´´"></span>
                                                                        </span>
                                                                    </a>
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a2 " aria-haspopup="true" role="button" title="ç²è´´åªè´´æ¿ä¸çåå®¹ã">
                                                                        <span class="ms-cui-ctl-largelabel" unselectable="on">
                                                                           开始
                                                                            </span>
                                                                    </a>
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span class="ms-cui-section-alignmiddle" unselectable="on">
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_cut" onclick="copyCell(true);return false;" href="javascript:;" mscui:controltype="Button" title="åªå" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_cut16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="åªå"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on" onclick="">开始</span>
                                                                </a>
                                                            </span>
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_copy" onclick="copyCell(false);return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_copy16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on" onclick="">开始</span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="åªè´´æ¿">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" id="m_excelWebRenderer_ewaCtl_Ribbon.Home.Font" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" id="" unselectable="on">
                                                        <span class="ms-cui-section-alignmiddle" id="" unselectable="on">
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl" id="dsm_styleBold" onclick="DsmMenuFun.styleBold();return false;" href="javascript:;" mscui:controltype="ToggleButton" title="å ç²" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_bold16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                </a>
                                                                <a class="ms-cui-ctl" id="dsm_styleItalics" onclick="DsmMenuFun.styleItalics();return false;" href="javascript:;" mscui:controltype="ToggleButton" title="å¾æ" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_italic16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                </a>
                                                                <a class="ms-cui-ctl" id="dsm_styleUnderline" onclick="DsmMenuFun.styleUnderline();return false;" href="javascript:;" mscui:controltype="ToggleButton" title="ä¸åçº¿" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_underline16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                </a>
                                                                <a class="ms-cui-ctl" id="dsm_fontSizeUp" onclick="DsmMenuFun.fontSizeUp();return false;" href="javascript:;" mscui:controltype="ToggleButton" title="å­å·+" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/fontup.png" alt="开始"></span>
                                                                    </span>
                                                                </a>
                                                            </span>
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl" id="dsm_fontSizeDown" onclick="DsmMenuFun.fontSizeDown();return false;" href="javascript:;" mscui:controltype="ToggleButton" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/fontdown.png" alt="开始"></span>
                                                                    </span>
                                                                </a>
                                                                <a class="ms-cui-ctl" id="dsm_fillcolor" onclick="showDiv('fillcolor');DsmMenuFun.closeOtherDiv('fillcolor');return false;" href="javascript:;" mscui:controltype="FlyoutAnchor" aria-haspopup="true" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img id="dsmcolorfill" class="ewaboot_fillcolor16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-smalllabel" unselectable="on">
                                                                        <span class=" ms-cui-img-5by3 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_menuDropDown" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt=""></span>
                                                                    </span>
                                                                </a>
                                                                <a class="ms-cui-ctl" id="dsm_fontcolor" onclick="showDiv('fontcolor');DsmMenuFun.closeOtherDiv('fontcolor');return false;" href="javascript:;" mscui:controltype="FlyoutAnchor" aria-haspopup="true" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img id="dsmcolorfont" class="ewaboot_fontcolor16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-smalllabel" unselectable="on">
                                                                        <span class=" ms-cui-img-5by3 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_menuDropDown" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt=""></span>
                                                                    </span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="å­ä½">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" id="" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" id="" unselectable="on">
                                                        <span class="ms-cui-section-alignmiddle" id="" unselectable="on">
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleTop" onclick="DsmMenuFun.styleTop();return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_topalign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleMiddle" onclick="DsmMenuFun.styleMiddle();return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_middlealign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleBottom" onclick="DsmMenuFun.styleBottom();return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_bottomalign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                            </span>
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleLeft" onclick="DsmMenuFun.styleLeft();return false;" href="javascript:;" mscui:controltype="Button" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_leftalign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleCenter" onclick="DsmMenuFun.styleCenter();return false;" href="javascript:;" mscui:controltype="Button" title="å±ä¸­" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_centeralign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                                <a class="ms-cui-ctl-medium" id="dsm_styleRight" onclick="DsmMenuFun.styleRight();return false;" href="javascript:;" mscui:controltype="Button" title="ææ¬å³å¯¹é½" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_rightalign16" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on"></span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                        <span class="ms-cui-section-alignmiddle" id="" unselectable="on">
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_cellMerge" onclick="DsmMenuFun.cellMerge();return false;" href="javascript:;" mscui:controltype="Button" title="åå¹¶ååæ ¼" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/merge.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on">开始</span>
                                                                </a>
                                                            </span>
                                                            <span class="ms-cui-row-tworow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-medium" id="dsm_cellUnMerge" onclick="DsmMenuFun.cellUnMerge();return false;" href="javascript:;" mscui:controltype="Button" title="åæ¶ååæ ¼åå¹¶" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-iconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="" style="" unselectable="on" src="assets/sheet/img/unmerge.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-mediumlabel" unselectable="on">开始</span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="å¯¹é½æ¹å¼">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" id="m_excelWebRenderer_ewaCtl_Ribbon.Home.Number" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" id="" unselectable="on">
                                                        <span class="ms-cui-section" id="" unselectable="on">
                                                            <span class="ms-cui-row-onerow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-large" id="dsm_formatTarget" onclick="format_target(false,'number');DsmMenuFun.closeOtherDiv('dsm_formatTarget');return false;" href="javascript:;" mscui:controltype="FlyoutAnchor" aria-haspopup="true" title="开始" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-largeIconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_general32" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-largelabel" unselectable="on">
                                                                        开始
                                                                        <br>
                                                                    </span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="æ°å­">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" id="" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" id="" unselectable="on">
                                                        <span class="ms-cui-section" id="" unselectable="on">
                                                            <span class="ms-cui-row-onerow" id="" unselectable="on">
                                                                <span class="ms-cui-ctl-large" id="dsm_insert" mscui:controltype="SplitButton" title="æå¥" unselectable="on" onclick="showDiv('insertmenu');DsmMenuFun.closeOtherDiv('insertmenu');">
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a1 " role="button">
                                                                        <span class="ms-cui-ctl-a1Internal" unselectable="on">
                                                                            <span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                                <img class="ewaboot_insertcells32" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                        </span>
                                                                    </a>
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a2 " aria-haspopup="true" role="button" title="开始">
                                                                        <span class="ms-cui-ctl-largelabel" unselectable="on">
                                                                            开始
                                                                            <br>
                                                                            <span class=" ms-cui-img-5by3 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                                <img class="ewaboot_menuDropDown" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="æå¥"></span>
                                                                        </span>
                                                                    </a>
                                                                </span>
                                                                <span class="ms-cui-ctl-large" id="dsm_delete" mscui:controltype="SplitButton" title="å é¤" unselectable="on" onclick="showDiv('deletemenu');DsmMenuFun.closeOtherDiv('deletemenu');">
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a1 " role="button">
                                                                        <span class="ms-cui-ctl-a1Internal" unselectable="on">
                                                                            <span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                                <img class="ewaboot_deletecells32" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                        </span>
                                                                    </a>
                                                                    <a onclick="return false;" href="javascript:;" unselectable="on" class="ms-cui-ctl-a2 " aria-haspopup="true" role="button" title="开始">
                                                                        <span class="ms-cui-ctl-largelabel" unselectable="on">
                                                                            开始
                                                                            <br>
                                                                            <span class=" ms-cui-img-5by3 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                                <img class="ewaboot_menuDropDown" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="开始"></span>
                                                                        </span>
                                                                    </a>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="开始">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                        <li class="ms-cui-group" id="m_excelWebRenderer_ewaCtl_Ribbon.Home.Data" unselectable="on">
                                            <span class="ms-cui-groupContainer" unselectable="on">
                                                <span class="ms-cui-groupBody" unselectable="on">
                                                    <span class="ms-cui-layout" id="" unselectable="on">
                                                        <span class="ms-cui-section" id="" unselectable="on">
                                                            <span class="ms-cui-row-onerow" id="" unselectable="on">
                                                                <a class="ms-cui-ctl-large" id="dsm_search" onclick="DsmMenuFun.cellSearch();return false;" href="javascript:;" mscui:controltype="Button" title="æ¥æ¾" role="button" unselectable="on">
                                                                    <span class="ms-cui-ctl-largeIconContainer" unselectable="on">
                                                                        <span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">
                                                                            <img class="ewaboot_find32" style="" unselectable="on" src="assets/sheet/img/ewaboot.png" alt="æ¥æ¾"></span>
                                                                    </span>
                                                                    <span class="ms-cui-ctl-largelabel" unselectable="on">开始</span>
                                                                </a>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span class="ms-cui-groupTitle" unselectable="on" title="æ°æ®">开始</span>
                                            </span>
                                            <span class="ms-cui-groupSeparator" unselectable="on"></span>
                                        </li>
                                    </ul>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div id="jQuerySheetMy" class="jQuerySheet_small">
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="assets/sheet/js/jquery-1.7.min.js"></script>
    <script type="text/javascript" src="assets/sheet/js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="assets/sheet/js/jquery.sheet.js"></script>
    <script type="text/javascript" src="assets/sheet/js/parser.js"></script>
    <script language="javascript" src="assets/sheet/js/map.js"></script>
    <script language="javascript" src="assets/sheet/js/addReport.js"></script>
    <script type="text/javascript" src="assets/sheet/js/dsm-plugin-all.min.js">
    </script>
        
</html>
