var sheetFocus=false; 	//是否是sheet获取的焦点
var prefix=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/";
var copyTd=null;//复制的td
var keyEnter = false;//当用户回车取数时状态改为true
var DsmMenuFun;
var copytmp = [];
var forceref=false;
var map =new Map();//用于记录引用关系树
var periodMap = new Map();//用于记录周期id
var eMap = new Map();//用于记录eid\ename
var freshmap =new Map();//用于记录引用关系树
var cellRec='';//返回递归引用
var ifDataDetail = false;//判断用户是否查看指标详情

reportInfo={
	hold:"hold",
	tip:"规则计算值：",
	kpiNoResultData:"KPI计算没有返回值,可能没相应日期数据",
	kpiResultData:"KPI计算返回值异常 ,应为JSON字符串",
	defHtml:"0",//没有计算结果的显示值
};
	
String.prototype.trim=function(){
    return $.trim(this);
}


function creChart(ctype) {
	'use strict';
	/*global seajs*/
	//$($('#i_linechart1').find('svg')).remove();
	seajs.use([ 'infoviz' ], function (InfoViz) {
		// Global option overwrite.
		InfoViz.global_option({
			'layout': { 'background-color': '#FFF' }
		});

		// LineChart.
		InfoViz.chart(
			'i_linechart1',
			ctype,
			{
				'vertical_axis_name': 'Vertical',
				'horizontal_axis_name': 'Horizontal',
				'horizontal_field': 'F2',
				'vertical_field': 'F1',
				'tooltip_title': '{name} {F2}, {F3}',
				'tooltip_content': 'Tooltip: {F2}, {F3} | {F1}',
				'data': {
					'asdf': {
						'name': 'Unite States',
						'data': [
							{ 'F1': 13, 'F2': 'A', 'F3': 15 },
							{ 'F1': 10, 'F2': 'B', 'F3': 12 },
							{ 'F1': 72, 'F2': 'C', 'F3': 9  },
							{ 'F1': 1,  'F2': 'D', 'F3': 3  },
							{ 'F1': 4,  'F2': 'E', 'F3': 6  }
						]
					}
				}
			},
			{ 'legend': { 'margin-top': 0 } }
		);
	});
	$("#i_linechart1").bind('contextmenu', function(e){
        var menu = $('#rightMenuChart')
                    
        if (!menu.length) {
        	menu = $('#rightMenuChart')
        }
        menu.mouseleave(function(){
            menu.hide();
        }).appendTo('body').hide();
        
        menu.css('left', (e.pageX - 5) + 'px').css('top', (e.pageY - 5) + 'px').show();
        return false;
    })
}

/**
 * 获取当前日期
 * v 偏移量
 * split 间隔符
 */
function getDateByOffSet(v,split){
	var myDate=new Date()
	//myDate.setDate(myDate.getDateByOffSet()+v)
	myDate.setTime(myDate.getTime()+(v*24*3600*1000))
	return getDate(myDate,split)
}

/**
 * 根据日期和间隔符获取日期字符串
 * 
 */
function getDate(myDate,split){
	var m=(myDate.getMonth()+1);
	if(m<10){
		m="0"+m;
	}
	var d=(myDate.getDate());
	if(d<10){
		d="0"+d;
	}
	return myDate.getFullYear()+split+m+split+d;
}

function doRefreshSheetInfo(){
	var paramInfo="";
	var pName="";
	var pTip="";
	var pType="";
	var pDefValue="";
	var reg=/\+/g;
	var reg1=/\%/g;
	var reg2=/\&/g;;
	var execres = 0;
	
	$(".tr_param").each(function(i){
		if(i==$(".tr_param").length-1){
			pName+=$.trim($(this).find(".pName").html());
			pTip+=$.trim($(this).find(".pTip").html());
			pType+=$.trim($(this).find(".pType").html());
			//pDefValue+=$.trim($(this).find(".pDefValue").html());
		}else{
			pName+=$.trim($(this).find(".pName").html())+"_;_";
			pTip+=$.trim($(this).find(".pTip").html())+"_;_";
			pType+=$.trim($(this).find(".pType").html())+"_;_";
			//pDefValue+=$.trim($(this).find(".pDefValue").html())+"_;_";
		}
	})
	
	pDefValue=$('#reportValue').val();
	$("#reportComValue").val(pDefValue);
	var paramInfo=pName+"_ZYP_"+pTip+"_ZYP_"+pType+"_ZYP_"+pDefValue;
 
	var refreshCache = document.getElementById("refreshCache").value;
	var url = "reportList.do?actionName=doRefreshSheetInfo&aa="+Math.random();
	var contObj = jS.exportSheet.json();
	try{
		for(var sheet =0;sheet <= jS.sheetCount;sheet++){
			execres = refreshTrying(contObj[sheet],sheet);
		}
		
	}catch(e){
		alert("数据获取异常,建议先保存报表,然后联系DSM管理员帮您处理!")
		return -1;
	}
	if(execres !== 0) return;//如果为DATA报表则不往下执行

	var sheetInfo=JSON.stringify(jS.exportSheet.json());
	sheetInfo=sheetInfo.replace(reg1,'--');
	sheetInfo=sheetInfo.replace(reg,'!');
	sheetInfo=sheetInfo.replace(reg2,'@');	   
	var params="id="+$("#reportId").val()+"&paramInfo="+paramInfo+"&sheetInfo="+sheetInfo+"&refresh="+refreshCache;
	var xmlHttpRequest=getXmlHttpRequest();
	ajaxSubmit(xmlHttpRequest,url,params,refreshSheetInfo_CB)
	function refreshSheetInfo_CB(){
	   if(xmlHttpRequest.readyState == 4){  
	        if(xmlHttpRequest.status == 200){
	            var responseText = xmlHttpRequest.responseText;
				if (responseText!=null&&responseText!="1") {
					var resObj_ = eval("(" + responseText + ")");        
					var cont=doNumSub(resObj_.content);
					contObj=eval("(" + resObj_.content + ")");
					refreshCell(contObj);
					$('#div_loadingSpread').hide();
				} else {
					alert("刷新数据失败")
				}			
	        }     
	    }  
	}
}

function refreshTrying(contObj,sheet){
	var colCount = parseInt(contObj.metadata.columns),
        rowCount = parseInt(contObj.metadata.rows),
        cell_data,
        cur_for,
        matchs,
        reg1 = /DATA/gi,
        reg2 = /EID|ENAME|PERIODID|PERIODNAME/gi,
        regkpi = /KPI/,
        cell,
        Parser,
        cell,
        formatAarry = new Array(),
        dataArray = new Array(),
        args;
    	forceref = true,
    	reportId = $("#reportId").val();
    	if(!reportId) reportId ="web_new";
    for (var x = 0; x < rowCount; x++) { //tr
        for (var y = 0; y < colCount; y++) {
        	cell_data = jS.spreadsheets[sheet][x][y];
        	cur_for=cell_data.formula;

        	if(cur_for){
        		if(cur_for.indexOf('=') == 0) cur_for=cur_for.replace('=','');
                matchs = cur_for.match(reg1);

                if(regkpi.test(cur_for)) return 0; //如果该报表是KPI报表，则退出

	        	if((matchs && matchs.length === 1 && !cur_for.match(/[\+|\-|\*|\/]DATA|DATA.*\)[\+|\-|\*|\/]/))){	
	        	    cell =  jS.spreadsheets[sheet][x][y];
		        	Parser = getParser(jS,cell,sheet, x, y, null);
                    args = Parser.parse(cur_for);
                    var formatStr = args.periodId+";"+args.cubeId+";"+args.measureId+";"+args.dimcom;
                    formatAarry.push({
                        row : x,
                        col : y,
                    });
                    dataArray.push('\"'+formatStr+'\"');
	        	}
        	}
        }
    }
    if(dataArray.length === 0){
    	refreshOneByOne(sheet);
    	return -1;
    }else{
    	var url = router.doBatch;
		var params="set={\"data\":["+dataArray.join(",")+"],\"reportId\":\""+reportId+"\"}";
		
		$.ajax({
	         url: url,
	         type: 'POST',
	         data: params,
	         dataType: 'text',
	         async : false,
	         success: function(rdata) {
	        	var datas = rdata.split(',');
	        	for (var i = 0; i < datas.length; i++) {
	        	 	var cellTd = jS.spreadsheets[sheet][formatAarry[i].row][formatAarry[i].col];
	        	 	cellTd.value = datas[i];

	        	 	formatRes(cellTd,sheet, formatAarry[i].row, formatAarry[i].col, null);
	        	}
	        	/*
	              1.DATA公式批量获取
	              2.剩余的单元格循环执行
	            */
	            refreshOneByOne(sheet);
	      		
	    		return -1;
	        },
	        error : function(jqXHR, textStatus, errorThrown){
	        	forceref = false;
	        	$('#div_loadingSpread').hide();
	        	return -1;
	        }
	    });
    }
}

function refreshOneByOne(sheet){
	jS.calc(sheet); //刷新sheet
	forceref = false;
	$('#div_loadingSpread').hide();
}

 //刷新单元格
function refreshCell(contObj){
	forceref = true;
	$("#dim_select_img").show();
	var colCount = parseInt(contObj.metadata.columns);
    var rowCount = parseInt(contObj.metadata.rows);
    var oldTd;
    var sheetData = (jQuery.isArray(contObj) ? contObj : [contObj]);
    for (var x = 0; x < rowCount; x++) { //tr
        for (var y = 0; y < colCount; y++) {
        	oldTd=jQuery(jS.getTd(jS.i, x, y));
        	var cell = sheetData[0]['data']['r' + x]['c' + y];
        	var cur_val ="";
        	if(cell.value) cur_val = cell.value.toString();
        	var cur_for=cell.formula;
        	 
        	if(oldTd ){
				if(cur_val.indexOf("=KPI")==0||(cell.value==""&&cell.formula!="")){
					oldTd.html(reportInfo.defHtml);
         	  		oldTd.attr("title",cell.kpiNoResultData);
				}else if(cur_for){
					
				}else{
					oldTd.html(cur_val);
				} 	
        	}
        }
    }
    
    $("#dim_select_img").hide();
    jS.calc(jS.i); //刷新sheet
    forceref = false;
}


function saveOrsaveAs(){
	var reportName=$("#reportName").val();
	if(reportName.trim()==""){
		saveReportAs();
		return false;
	}else{
		doSaveReport(reportName,"","");
		return false;
	}
}

function doSaveReport(name,desc,parentId){
	if(!jQuery.trim(name)){
		alert('报表名称不能为空！');
		return ;
	}
	var reportName = name;
	var reportId = $("#reportId").val();
	
	var params="name="+reportName+"&id="+reportId+"&parentId="+parentId;
	if(reportId== "") {
		doCheckReportExists(saveReport,params);
	}else{
		saveReport();
	}
	
	function saveReport(){
		var paramInfo="";
		var pName="";
		var pTip="";
		var pType="";
		var pDefValue="";
		
		$(".tr_param").each(function(i){
			if(i==$(".tr_param").length-1){
				pName+=$.trim($(this).find(".pName").html());
				pTip+=$.trim($(this).find(".pTip").html());
				pType+=$.trim($(this).find(".pType").html());
				//pDefValue+=$.trim($(this).find(".pDefValue").html());
				
			}else{
				pName+=$.trim($(this).find(".pName").html())+"_;_";
				pTip+=$.trim($(this).find(".pTip").html())+"_;_";
				pType+=$.trim($(this).find(".pType").html())+"_;_";
				//pDefValue+=$.trim($(this).find(".pDefValue").html())+"_;_";
			}
			
		})
		
		pDefValue=$('#reportValue').val();
		
		paramInfo=pName+"_ZYP_"+pTip+"_ZYP_"+pType+"_ZYP_"+pDefValue;
		
		//var query = getQuery(window.location);
		var url = router.doSaveReport;
		var exportObj = JSON.stringify(jS.exportSheet.json());
		
		$.ajax({
			  type : "POST", // 最后改成POST2011-6-16 13:58:15
			  url : url,
			  context : document.body,
			  data : {
			  	
				"id" : reportId,
				"name" : reportName,
				"parentId" : parentId,
				"sheetInfo" :exportObj,
				"chartInfo" :JSON.stringify("chart"),
				"paramInfo":paramInfo
				},
			  complete :function(){
				isChecking=false;
			  },
			  success: function(data) {
		  			var tip=reportId==""?"添加":"修改" 
					if (data!=null&&data!="1") {
						 alert(tip+"成功");
						$("#reportId").val($.trim(data));
						$("#btn_saveAsAnother").show();
						$("#btn_runReportPage").show();
						document.title=reportName+"-数据超市";
						$("#reportName").val($.trim(reportName));
						jQuery.unblockUI();
					} else {
						  alert(tip+"失败")
					}
				}
			 });
	}	 
}

function getQuery(url) {
	url = new String(url);
	var idx = url.indexOf("?");
	if (idx != -1) {
		var param = url.substring(idx+1);
		if(param.indexOf("projectId=")==0) return param;
	}
	return null;
}

function doCheckReportExists(fn,params){
	 var url = router.doCheckReport;
	
	 var xmlHttpRequest=getXmlHttpRequest();
	 ajaxSubmit(xmlHttpRequest,url,params,checkReportExists_CB)
	 
	function checkReportExists_CB(){
	   if(xmlHttpRequest.readyState == 4)//1 2 3 4 四种状态  
    {  
        if(xmlHttpRequest.status == 200)//正常响应  
        {
            var responseText = xmlHttpRequest.responseText;//服务器回传文本  
            var resObj = eval("(" + responseText + ")");
            if (resObj.code == 1 || resObj.code == '1') {
                alert("名称重复，请重写报表名称");
                refreshPage();
            }
            else {
                fn.apply(this);
            }
        }  
    }  
} 
	 
}

//打开另存为窗口
function openAsAnother(){
	var url = 'reportSaveAsConfig.htm';
    var frmHtml = "<iframe style='width: 100%; height:100%;' src='" + url + "'></iframe>";
	jQuery.blockUI({
		 message: frmHtml,
	     css:{
		      width:'800px',
			  height:'600px',
			  top:'100px',
			  left: '230px',
			  cursor:'auto',
			  zIndex:1000001
			},
		   overlayCSS:{
		     cursor:'auto',
		     zIndex:1000000
		    },
		   centerX: true,
           centerY: true
	   });
}

//打开保存窗口
function saveReportAs(){
	var url = 'reportSaveConfig.htm';
    var frmHtml = "<iframe name='iframesave' style='width: 100%; height:100%;' src='" + url + "'></iframe>";
	jQuery.blockUI({
		message: frmHtml,
	    css:{
		    width:'800px',
			height:'600px',
			top:'100px',
			left: '230px',
			cursor:'auto',
			zIndex:1000001
		},
		overlayCSS:{
		    cursor:'auto',
		    zIndex:1000000
		},
		centerX: true,
        centerY: true
	});
}

//打开loading窗口
function openLoad(){
	var url = 'openLoad.htm';
    var frmHtml = "<iframe style='width: 100%; height:100%;' src='" + url + "'></iframe>";
	jQuery.blockUI({
		 message: frmHtml,
	     css:{
		      width:'800px',
			  height:'600px',
			  top:'100px',
			  left: '230px',
			  cursor:'auto',
			  zIndex:1000001
			},
		   overlayCSS:{
		     cursor:'auto',
		     zIndex:1000000
		    },
		   centerX: true,
           centerY: true
	   });
}

//另存为
function saveAsAnother(sStr,desc,parendId){
	if(!jQuery.trim(sStr)){
		alert('报表名称不能为空！');
		return ;
	}
	if(!jQuery.trim(parendId)){
		alert('报表位置不能为空！');
		return;
	}
	
	var params="name="+sStr+"&desc="+desc+"&parentId="+parendId+"&id="+$("#reportId").val();
	doCheckReportExists(saveAs,params);
	function saveAs(){
		var reportId=$("#reportId").val();
		var url = router.doSaveAs;
		$.ajax({
		   type : "POST", // 最后改成POST2011-6-16 13:58:15
		   url : url,
		   context : document.body,
		   data : {
			"id" : $('#reportId').val(),
			"sheetInfo" :JSON.stringify(jS.exportSheet.json()),
			"chartInfo" :JSON.stringify("chartObj"),
			"newReportName" : sStr,
			"parentId":parendId
			},
		   complete :function(){
			 isChecking=false;
		   },
		   success: function(data) {
				if (data!=null&&data=="1") {
					 alert("另存为失败")
				} else {
					alert("另存为成功")
					$("#name").val($.trim(sStr));
					$("#reportId").val($.trim(data));
					$("#btn_saveReport").show();
					$("#btn_runReportPage").show();
					$("#desc").val(desc);
					jQuery.unblockUI();
				}
			}
		});
	}
}

function closeAlertDiv() {
	$("#insertAlertDiv").css("display","none");
}
/**
 * 简单解析$表达式
 */
function paserParam(v){
	
	var pNames=v.match(/\$[^\+\-\*\/\%\ \,\'\"\:]*/g);
	if(pNames==null||pNames.length<0){
		return v;
	}
	for(i=0;i<pNames.length;i++){
		v=v.replace(pNames[i],useParam(pNames[i]));
	}
	return v;
}

function useParam(v,cell){
	
	var pName="";
	var result=v;
	result = $('#reportValue').val();
	return result;
}


function computeFormula_kpi(p,type,cell,td){
	var formula=td.attr("formula");
	var reg=/\+/g;
	formula=formula==null?"":formula;
	formula=paserParam(formula)
	formula=formula.substring(1, formula.length);
	
	formula=formula.replace(reg,'\!');
	
	var url = "reportList.do?actionName=doKPI";
	var params="formula="+formula;
 
	var xmlHttpRequest=getXmlHttpRequest();
	ajaxSubmit_false(xmlHttpRequest,url,params,computeFormula_kpi_CB)
	function computeFormula_kpi_CB(v){
	 if(xmlHttpRequest.readyState == 4)//1 2 3 4 四种状态  
    {  
        if(xmlHttpRequest.status == 200)//正常响应  
        {
       		var responseText = xmlHttpRequest.responseText;//服务器回传文本  
       		var oldTitle=td.attr("title");
            if(responseText!=null&&responseText.length>0){
	  			if(responseText.length<1000){
	  				var resObj;
	  				try {
	  					resObj = eval("(" + responseText + ")");
	  				} catch (e) {
	  					td.html(responseText)
	  					return ;
	  				}
	  				var varNum=new Number(resObj.kpiValue);
	  				var format=td.attr("format");
	  				var reg=/^\d+\.?\d+$/;
	  				
	  				
	  				if(format=="undefined" || format==null || varNum.toString().indexOf('%') != -1){
	  					td.html(varNum.toFixed(2).replace(".00",""));
	  				}else if(reg.test(varNum) && format.indexOf('%') != -1){
	  					var formats=format.split(",");
	  					varNum=varNum*(Math.pow(10, 2));
		  				var new_val=varNum.toFixed(formats[0]);
		  				td.html(new_val+'%');
	  				}else{
	  					td.html(varNum.toFixed(2).replace(".00",""));
	  				}
	                td.attr("title",resObj.title)
	               	//replaceTipInfo(td,resObj);
	            }	              
            }else{
            	 td.html(reportInfo.defHtml)
            	 td.attr("title",reportInfo.kpiNoResultData)
            }
                
                // $("#a_refreshSheet").trigger("click"); //刷新sheet
	    }  
	}  
	}
}

function computeFormula_data(v,cell,td,ifreplace){
	var reg=/\+/g;
	var reg1=/\%/g;
	var reg2=/\&/g;
	var periodId,cubeId,measureId,dimcom,dataValue,title,defVal;
    var newDimCom=[];
    var cellFor = cell.formula;
    if(cellFor.indexOf('=') != -1) cellFor=cellFor.replace('=','');
    cubeId=v[0];
    periodId=v[1];
    measureId=v[v.length-1];
	for(var i=2;i<v.length-1;i++){
		newDimCom[i-2]=v[i];
	}
	dimcom=newDimCom.join("||");

	/*
	  description:当刷新报表时获取公式信息
      author: zhengfei
	*/
	if(forceref && !cellFor.match(/[\+|\-|\*|\/]DATA|DATA.*\)[\+|\-|\*|\/]/)){
		return {
	    	cubeId : cubeId,
	    	periodId : periodId,
	    	dimcom : dimcom,
	    	measureId : measureId
	    };
	}
    
	/*end*/

    /*
      description:获取指标详情
      author:zhengfei
    */
    if(ifDataDetail){
    	showDiv('div_loadingImg');
    	
        jQuery.post(router.getDataDetail,
                 {
			    "cubeId":cubeId,
			    "periodId":periodId,
			    "measureId":measureId,
			    "dimcom":dimcom
			    },
			    function (rdata, textStatus){
			     	var appendHtml = "<tr><td class='dataTd'>指标名：</td><td>"+rdata.kpiName+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>指标公式：</td><td>"+rdata.kpiFormula+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>指标值：</td><td>"+cell.value+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>项目：</td><td>"+rdata.porjectName+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>立方体：</td><td>"+rdata.cubeName+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>维度：</td><td>"+rdata.kpiDimInfo+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>描述：</td><td>"+rdata.kpiDesc+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>状态：</td><td>"+rdata.kpiStatus+"</td></tr>";
			     	appendHtml += "<tr><td class='dataTd'>属主：</td><td>"+rdata.owner+"</td></tr>";
                    $('#dataDetail .dataDetailList').empty();
                    $('#dataDetail .dataDetailList').append(appendHtml);
                    if($('#dataDetail').css('display') == 'none') showDiv('dataDetail');
                    closeDiv('div_loadingImg');
			   },
		'json');
        ifDataDetail = false;
    }
    /*end*/
	var url = router.doData;
	var params="periodId="+periodId;
	params+="&cubeId="+cubeId;
	params+="&measureId="+measureId;
	params+="&dimcom="+dimcom;
	$.ajax({
        url: url,   //接收页面
        type: 'POST',      //POST方式发送数据
        async: false,      //ajax同步
        data: params,
        dataType : "json",
        success: function(msg) {
        	dataValue = msg.dataValue; 
        	
        	if(/^(?:0|[1-9]+)(?:(\.\d+)?)(E?)(\d+$)/i.test(dataValue)){
        		var numNew = new Number(dataValue);
        		if(numNew < 1){
	        		if(dataValue.length >6){
	        			defVal=numNew.toFixed(6).replace(".000000","");
	        		}else{
	        			defVal=dataValue;
	        		}
	        	}else{
	        		defVal=numNew.toFixed(2).replace(".00","");
	        	}
        	}else{
        		defVal = dataValue;
        	}
        	
        	//if(ifreplace) title=title.replace('#value#',defVal);
        	//td.attr("title",title);
        	td.html(defVal);
        	cell.value=defVal;
        },
        error:function(jqXHR, textStatus, errorThrown){
       	   return false;
        }
    });
	
	return defVal;

}

/**
 * 验证是否是系统公式
 * @formula ： 如 =KPI(234)
 */
function isSysFormula(formula){
	
	if(formula==null){
		return false;
	}
	var fName=formula.substring(0,formula.indexOf("("));
	//if(fName=="KPI"||fName=="PERIODID"||fName=="PERIODNAME"||fName=="ENAME"||fName=="DATA"){
	if(fName=="KPI"){
		return true;
	}
	return false;
}

function runReport(){
	var id=$("#reportId").val();
    var url = "reportList.do?actionName=preEdit&id="+id+"&isRunReport=1"
    window.open(url);
} 

//----------------- 原生 ajax


//var xmlHttpRequest = null; //声明一个空对象以接收XMLHttpRequest对象  



function getXmlHttpRequest(){
	var xmlHttpRequest=null;
	 //如果不为null 或者不为 Undefined 就为true  
    if(window.ActiveXObject) // IE浏览器,当初微软先在IE中非标准实现(ActiveX实现,ActiveX IE特有),后来其他浏览器用标准的方式实现  
    {  
        xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");  
    }  
    else if(window.XMLHttpRequest) //除IE外的其他浏览器实现,window下面存在XMLHttpRequest对象. window的子对象  
    {  
        xmlHttpRequest = new XMLHttpRequest();  
    }  
      
     return xmlHttpRequest;
}
/**  
 * @url 
 * @param  like "v1=" + v1 + "&v2=" + v2
 */
function ajaxSubmit(xmlHttpRequest,url,params,callBackFunction)  
{  
      
    if(null != xmlHttpRequest)  
    {  
       
        //POST/GET请求,最好大写,与表单提交不一样     请求路径   true:异步提交  
        xmlHttpRequest.open("POST", url, true);//准备  
        //关联好ajax的回调函数  
        //xmlHttpRequest.onreadystatechange : 引用一个事件处理器  
        //点一下执行四次,因为状态变化四次  
        xmlHttpRequest.onreadystatechange = callBackFunction;//回调,ajaxCallback:不能有括号:表示函数的引用,加了括号表示函数的执行  
  
        //真正向服务器端发送数据  
        //设置表单提交方式:"Content-Type","application/x-www-form-urlencoded"  
        xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
        xmlHttpRequest.send(params);//POST提交要附加参数  
    }  
}  

function ajaxSubmit_false(xmlHttpRequest,url,params,callBackFunction)  
{  
      
    if(null != xmlHttpRequest)  
    {  
       
        //POST/GET请求,最好大写,与表单提交不一样     请求路径   false:同步提交  
        xmlHttpRequest.open("POST", url, false);//准备  
        //关联好ajax的回调函数  
        //xmlHttpRequest.onreadystatechange : 引用一个事件处理器  
        //点一下执行四次,因为状态变化四次  
        xmlHttpRequest.onreadystatechange = callBackFunction;//回调,ajaxCallback:不能有括号:表示函数的引用,加了括号表示函数的执行  
  
        //真正向服务器端发送数据  
        //设置表单提交方式:"Content-Type","application/x-www-form-urlencoded"  
        xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
        xmlHttpRequest.send(params);//POST提交要附加参数  
    }  
}

function ajaxSubmit_get(xmlHttpRequest,url,params,callBackFunction)  
{  
      
    if(null != xmlHttpRequest)  
    {  
        //POST/GET请求,最好大写,与表单提交不一样     请求路径   true:异步提交  
        xmlHttpRequest.open("GET", url, true);//准备  
        //关联好ajax的回调函数  
        //xmlHttpRequest.onreadystatechange : 引用一个事件处理器  
        //点一下执行四次,因为状态变化四次  
        xmlHttpRequest.onreadystatechange = callBackFunction;//回调,ajaxCallback:不能有括号:表示函数的引用,加了括号表示函数的执行  
  
        //真正向服务器端发送数据  
        //设置表单提交方式:"Content-Type","application/x-www-form-urlencoded"  
        xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
         xmlHttpRequest.send(null);//如果GET请求 则不用附加参数 
    }  
}  
  
function ajaxCallback()  
{  
    if(xmlHttpRequest.readyState == 4)//1 2 3 4 四种状态  
    {  
        if(xmlHttpRequest.status == 200)//正常响应  
        {  
            var responseText = xmlHttpRequest.responseText;//服务器回传文本  
              
            document.getElementById("div1").innerHTML = responseText;  
        }  
    }  
} 

function exportReport(){   
	    $("#div_loadingSpread").show();
		var reg=/\+/g,
			reg1=/\%/g,
			reg2=/\&/g,
			ifdata = false;
		if(arguments.length === 1) ifdata = arguments[0];  
		var sheetInfo=JSON.stringify(jS.exportSheet.json());
		var url = router.doExport;
		var rname = "myreport";
		sheetInfo=sheetInfo.replace(reg1,'--');
		sheetInfo=sheetInfo.replace(reg,'!');
		sheetInfo=sheetInfo.replace(reg2,'@');
		
		var params="jsonStr="+sheetInfo+"&rname="+rname+"&ifdata="+ifdata;
		
		var xmlHttpRequest=getXmlHttpRequest();
		 ajaxSubmit(xmlHttpRequest,url,params,getFilePath)
		 
		function getFilePath(){
		   if(xmlHttpRequest.readyState == 4)//1 2 3 4 四种状态  
	         {  
	            if(xmlHttpRequest.status == 200)//正常响应  
	            {
	            	$("#div_loadingSpread").hide();
	                var responseText = xmlHttpRequest.responseText;//服务器回传文本  
	                window.open(prefix+responseText,'下载报表','width=600,height=500','');
	            }  
	         }  
	     }
}

function doNumSub(content){
	var str=content;
	var reg=/\d+.\d+E\d{1}/;
	 var reg1=/\d+\.\d{3,}/;
	 while(reg.test(str)){
		   var result =  reg.exec(str);
		   var num=new Number(result);
		   str=str.replace(result,num.toFixed(2));  
		}
		var str1=str;
	while(reg1.test(str1)){
		var result1 =  reg1.exec(str1);
		var num1=new Number(result1);
		str1=str1.replace(result1,num1.toFixed(2));
	}
	
	return str1;
}

function parseFormula(formula){
	formula=formula.replace(/\"/g,"");
	var index=formula.indexOf("(")
	var last=formula.lastIndexOf(")");
	var formula_=formula.substring(index+1,last);
	return formula_;
}


function refreshCache() {
	var execres = 0;
    $('#div_loadingSpread').show();
	document.getElementById("refreshCache").value=1;

	function RequestPermission (callback) {
		window.webkitNotifications.requestPermission(callback);
	}
    
    function showNotification(){
    	if (window.webkitNotifications.checkPermission() > 0) {
			RequestPermission(showNotification);
			setTimeout(function(){
				execres = doRefreshSheetInfo();
			},500);
  		}else {
  			setTimeout(function(){
                execres = doRefreshSheetInfo();
                if(execres === -1) return;
                var deskbox = window.webkitNotifications.createNotification("http://tp3.sinaimg.cn/1883935250/50/0/1", "DSM用户您好：", 
      			"报表数据已刷新。");
      			deskbox.show();
  			},500);
  		}
    }
    showNotification();
}

function format_target(ifselect,formatType){
	if(!ifselect){
		$("#format_target").toggle();
		formatCell('number');
	}

	var cells = jS.obj.cellHighlighted();
	var startLoc = jS.getTdLocation(cells.first());
	var td=jQuery(jS.getTd(jS.i, startLoc.row, startLoc.col));
	var cell = jS.spreadsheets[jS.i][startLoc.row][startLoc.col];
	var cur_val=cell.value.toString();
	cur_val=cell.value;
	cur_val=formatCurVal(cur_val);
	td.attr('cellValue',cur_val);
	if(formatType.id == 'number'){
		var for_length=$("#select_format").val();
		var varNum=new Number(cur_val);
		var new_val=varNum.toFixed(for_length);
	    $("#formatValue").html(new_val);
	}else if(formatType.id == 'percent'){
		var for_length=$("#select_format").val();
		var varNum=cur_val*(Math.pow(10, 2));
		var new_val=varNum.toFixed(for_length);
	    $("#formatValue").html(new_val+'%');
	}else if(formatType == 'number'){
		var for_length=$("#select_format").val();
		var varNum=new Number(cur_val);
		var new_val=varNum.toFixed(for_length);
	    $("#formatValue").html(new_val);
	}
	
}

function formatCell(tdId){
	var cells = jS.obj.cellHighlighted();
	var startLoc = jS.getTdLocation(cells.first());
	var td=jQuery(jS.getTd(jS.i, startLoc.row, startLoc.col));
	var cell = jS.spreadsheets[jS.i][startLoc.row][startLoc.col];
	var cur_val=cell.value;
	cur_val=formatCurVal(cur_val);
	td.attr('cellValue',cur_val);
	if(tdId == 'number'){
		$("#percent").removeAttr("style");
		$("#number").css({"background-color":"gray"});
		$("#formatArea").empty();
		$("#deteFormat").empty();
		$("#formatArea").append("<table style='width:100%;height:100%;border:thin solid gray'>"+
	                 "<tr><td>示例</td><td></td></tr><tr><td id='formatValue'></td><td></td>"+
	                 "</tr><tr><td>小数位数：</td><td>"+
                     "<select name='select' id='select_format' onchange='format_target(true,number)'>"+
                     "<option value='0'>0</option><option value='1'>1</option><option value='2' selected='selected'>2</option>"+
                     "<option value='3'>3</option><option value='4'>4</option></select></td></tr></table>");
		$("#deteFormat").append("<tr><td align='center'><input type='button' value='确定' onclick='getFormat(number)'/></td></tr>");
		var for_length=$("#select_format").val();
		var varNum=new Number(cur_val);
		var new_val=varNum.toFixed(for_length);
	    $("#formatValue").html(new_val);
	}else if(tdId == 'percent'){
		$("#number").removeAttr("style");
		$("#percent").css({"background-color":"gray"});
		$("#formatArea").empty();
		$("#deteFormat").empty();
		$("#formatArea").append("<table style='width:100%;height:100%;border:thin solid gray'>"+
	                 "<tr><td>示例</td><td></td></tr><tr><td id='formatValue'></td><td></td>"+
	                 "</tr><tr><td>小数位数：</td><td>"+
                     "<select name='select' id='select_format' onchange='format_target(true,percent)'>"+
                     "<option value='0'>0</option><option value='1'>1</option><option value='2' selected='selected'>2</option>"+
                     "<option value='3'>3</option><option value='4'>4</option></select></td></tr></table>");
		$("#deteFormat").append("<tr><td align='center'><input type='button' value='确定' onclick='getFormat(percent)'/></td></tr>");
		var for_length=$("#select_format").val();
		var varNum=cur_val*(Math.pow(10, 2));
		var new_val=varNum.toFixed(for_length);
	    $("#formatValue").html(new_val+'%');
	}
}

function formatCurVal(cur_val){
	if(typeof(cur_val) == 'number') cur_val = cur_val.toString();
	if(cur_val.indexOf("%") != -1){
		cur_val=cur_val.replace("%","");
		cur_val=parseFloat(cur_val/100);
	}
	return cur_val;
}

function getFormat(formatType){
	var for_length=$("#select_format").val();

	var startLoc,endLoc;
    var cells = jS.obj.cellHighlighted();
    startLoc = jS.getTdLocation(cells.first());
    endLoc = jS.getTdLocation(cells.last());
    for(var i=startLoc.col;i<=endLoc.col;i++){
    	for(var j=startLoc.row;j<=endLoc.row;j++){
    		var td=jQuery(jS.getTd(jS.i, j, i));
			var cell = jS.spreadsheets[jS.i][j][i];
			var cur_val=cell.value;
			if(cur_val == '') continue;
			cur_val=formatCurVal(cur_val);
		    
		    if(formatType.id=='number'){
		    	td.attr("format",for_length);
				var varNum=new Number(cur_val);
				var new_val=varNum.toFixed(for_length);
				td.html(new_val); 
		    }else if(formatType.id=='percent'){
		    	td.attr("format",for_length+',%');
				var varNum=cur_val*(Math.pow(10, 2));
				var new_val=varNum.toFixed(for_length);
				td.html(new_val+'%');
		    }
    	}
    }
    closeDiv("format_target");
}


//显示透视表
function showPivotTableConfig(url){
    if(jS.highlightedLast.rowStart != '-1' && jS.highlightedLast.colStart != '-1'){
    	var cell = jS.spreadsheets[jS.i][jS.highlightedLast.rowStart][jS.highlightedLast.colStart];
    	var formula = cell.formula;
    	if(/\d+/.test(formula)){
    		url += "?id="+/\d+/.exec(formula)[0];
    	}
    }else{
    	alert('请先选择单元格!');
    	return;
    }
	
    var frmHtml = "<iframe id = 'myiframe' frameborder='no' border='0' style='width: 100%; height:95%;' src='" + url + "'></iframe>";
	jQuery.blockUI({
		 message: frmHtml,
	     css:{
		      width:'90%',
			  height:'90%',
			  cursor:'auto',
			  zIndex:1000001,
			  border:'3px solid #C5E0ED'
			},
		   overlayCSS:{
		     cursor:'auto',
		     zIndex:1000000
		   },
		   fadeIn:  500,
		   fadeOut: 1000
	   });
	
	$.fn.center = function () {
	    this.css("position","absolute");
	    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
	    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
	    return this;
	}
	
	$('.blockUI.blockMsg').center();
}

function clearContent(){
    var startLoc,endLoc;
    var cells = jS.obj.cellHighlighted();
    startLoc = jS.getTdLocation(cells.first());
    endLoc = jS.getTdLocation(cells.last());
    for(var i=startLoc.col;i<=endLoc.col;i++){
    	for(var j=startLoc.row;j<=endLoc.row;j++){
    		var newTd=jQuery(jS.getTd(jS.i, j, i));
			var cellNew = jS.spreadsheets[jS.i][j][i];
			newTd.html('');
			newTd.attr('formula','');
			if(newTd.attr('cellValue')) newTd.removeAttr('cellValue');
			cellNew.formula='';
			cellNew.value='';
    	}
    }
}

/*
   description:插入选择多个维度成员数据
   author:正飞
*/
function insertSelectMeaMuti(data,type){
	var td=jS.highlightedLast.td;
	var loc=jS.getTdLocation(td);
	var row=loc.row;
	var col=loc.col;
	var selectMeas = eval("(" + data + ")");
	var meaData = selectMeas.data;
    var mea_len = meaData.length;
    var cubeId = selectMeas.cubeId,
        dataType = selectMeas.dataType,
        periodLabel;
    var compareRes;

    var defaultPeriod=$('#reportValue').val();
    if (type === 1) {
        for (var i = col; i < col + mea_len; i++) {
	    	var td_x=jQuery(jS.getTd(jS.i, row, i));
			var cell_x = jS.spreadsheets[jS.i][row][i];
			var formula_x ;
	        if(dataType === "2"){
	          	formula_x="=ENAME(\""+selectMeas.dimId+"\",\""+meaData[i-col].id+"\")";
	        }else if(dataType === "7"){
	          	compareRes = compareDay(meaData[i-col].id,defaultPeriod)
		 	  	preday="," + compareRes.days;
		 	  	formula_x="=PERIODNAME(\"$report_date\",\""+compareRes.periodLabel+"\""+preday+")";
	        }else{
	          	formula_x="=ENAME(\"measure\",\""+meaData[i-col].id+"\")";
	        }
			 
			td_x.html(meaData[i-col].name);
			td_x.attr('formula',formula_x);
			cell_x.value = meaData[i-col].id;
			cell_x.formula = formula_x;
	    }	
    } else {
        for (var j = row; j < row + mea_len; j++) {
	    	var td_y=jQuery(jS.getTd(jS.i, j, col));
			var cell_y = jS.spreadsheets[jS.i][j][col];
			var formula_y ;
	        if(dataType === "2"){
	          	formula_y="=ENAME(\""+selectMeas.dimId+"\",\""+meaData[j-row].id+"\")";
	        }else if(dataType === "7"){
	          	compareRes = compareDay(meaData[j-row].id,defaultPeriod)
		 	  	preday="," + compareRes.days;
		 	  	formula_y="=PERIODNAME(\"$report_date\",\""+compareRes.periodLabel+"\""+preday+")";
	        }else{
	          	formula_y="=ENAME(\"measure\",\""+meaData[j-row].id+"\")";
	        }
			 
			td_y.html(meaData[j-row].name);
			td_y.attr('formula',formula_y);
			cell_y.value = meaData[j-row].id;
			cell_y.formula = formula_y;
	    }
    }
    
}

function getVLookData(){
	var pivotInfo=arguments[0];
	var pivotObj = eval("(" + pivotInfo + ")");
	var td=jS.highlightedLast.td;
	var loc=jS.getTdLocation(td);
	var row=loc.row;
	var col=loc.col;
	var reg=/\|\|/g;
	var defaultPeriod=$('#reportValue').val();
	var periodName,periodLabel,newtdValue,measureId;
	var preday='';
	var dimComsTemp = [];
    var xde,yde,dimId;
    var result_x=new Array();//结果保存到这个数组
    var result_y=new Array();//结果保存到这个数组
    var dimComsTemp = [];
    var meaRlation ={};
    var periodRelation = {};
    var d_length = 0,
        x_length = pivotObj.x.length,
        y_length = pivotObj.y.length;
    var compareRes;
    
    //笛卡尔函数start
	function toResult(arrIndex,srcArr,result,aresult)
	{
	    if(arrIndex>=srcArr.length) {
	      result.push(aresult);
	      return;
	    };
	    var aArr=srcArr[arrIndex].values;
	    if(!aresult) aresult=new Array();
	    for(var i=0;i<aArr.length;i++)
	    {
	      var theResult=aresult.slice(0,aresult.length);
	      theResult.push(aArr[i]);
	      toResult(arrIndex+1,srcArr,result,theResult);
	    }
	}
    toResult(0,pivotObj.x,result_x);//x轴处理笛卡尔
    xde = result_x;
    toResult(0,pivotObj.y,result_y);//y轴处理笛卡尔
    yde = result_y;
	//end
	
    //填充页选择器start
    if(pivotObj.d){
    	d_length = pivotObj.d.length;
    	for (var dde_index = 0; dde_index < d_length; dde_index++) {
	        var d_idx_row =  row + dde_index;
	        var d_dt=pivotObj.d[dde_index].dataType;
	        var d_id=pivotObj.d[dde_index].id;

	        var td_d=jQuery(jS.getTd(jS.i, d_idx_row, col));
	 	    var cell_d = jS.spreadsheets[jS.i][d_idx_row][col];
	 	    var formula_d;
	        if(d_dt === 2){
	        	if(d_id.length === 6) {
	        		dimId = d_id
	        	}else{
	        		dimId = getAjaxValue(router.getDimId,'text',{'subSetId':d_id},function(data){
						return data;
					});
	        	}
	        	
				dimComsTemp.push({
					level : pivotObj.d[dde_index].levels,
					type : 'd',
					id : dimId,
					value : d_idx_row
				})
	            formula_d="=ENAME(\""+d_id+"\",\""+pivotObj.d[dde_index].values[0].id+"\")";
		 	   	cell_d.value=pivotObj.d[dde_index].values[0].id;
			}else if(d_dt === -1){
				meaRlation = {
					type : 'd',
					value : d_idx_row
				}
				formula_d="=ENAME(\"measure\",\""+pivotObj.d[dde_index].values[0].code+"\")";
		     	cell_d.value=pivotObj.d[dde_index].values[0].code;
			}else if(d_dt === 7){
	            periodRelation = {
	            	type : 'd',
	            	value : d_idx_row
	            }
	            var periodTmp_d = pivotObj.d[dde_index].values[0].id
	            compareRes = compareDay(periodTmp_d,defaultPeriod)
		 		preday="," + compareRes.days;
		 		formula_d="=PERIODNAME(\"$report_date\",\""+compareRes.periodLabel+"\""+preday+")";
			}
			td_d.attr('formula',formula_d);
		 	td_d.html(pivotObj.d[dde_index].values[0].name);
		 	cell_d.formula=formula_d
	    }
    }
    
    //end

	//填充横轴维度 start
	for (var xde_index = 0; xde_index < x_length; xde_index++) {
		var x_id=pivotObj.x[xde_index].id;//x属性轴id
		
		var x_dt=pivotObj.x[xde_index].dataType;//x轴属性类型
		var x_idx_row = row+d_length+xde_index;//x轴数据起始行
		if(x_dt === 2){
			if(x_id.length === 6){
				dimId = x_id;
			}else{
				dimId = getAjaxValue(router.getDimId,'text',{'subSetId':x_id},function(data){
					return data;
				});
			}
			
			dimComsTemp.push({
				level : pivotObj.x[xde_index].levels,
				type : 'x',
				id : dimId,
				value : x_idx_row
			})
		}else if(x_dt === -1){
			meaRlation = {
				type : 'x',
				value : x_idx_row
			}
		}else if(x_dt === 7){
            periodRelation = {
            	type : 'x',
            	value : x_idx_row
            }
		}
		for(var i=col;i<xde.length+col;i++){
            if ((i+y_length) == jS.sheetSize().width) {
	            jS.controlFactory.addColumn(':last');
	        }
	 	    var td_x=jQuery(jS.getTd(jS.i, x_idx_row, i+y_length));
	 	    var cell_x = jS.spreadsheets[jS.i][x_idx_row][i+y_length];
	 	    var formula_x,
	 	        index_x = i-col;//当前x轴下标
	 	    if(x_dt === 7 ){
	 	        var periodTmp_x = xde[index_x][xde_index].id
	 		    compareRes = compareDay(periodTmp_x,defaultPeriod)
		 		preday="," + compareRes.days;
		 		formula_x="=PERIODNAME(\"$report_date\",\""+compareRes.periodLabel+"\""+preday+")";
	 	    }else if(x_dt === -1){
	     	   formula_x="=ENAME(\"measure\",\""+xde[index_x][xde_index].code+"\")";
	     	   cell_x.value=xde[index_x][xde_index].code;
	 	    }else{
	 	   	   formula_x="=ENAME(\""+x_id+"\",\""+xde[index_x][xde_index].id+"\")";
	 	   	   cell_x.value=xde[index_x][xde_index].id;
	 	    }
	 	    td_x.attr('formula',formula_x);
	 	    td_x.html(xde[index_x][xde_index].name);
	 	    cell_x.formula=formula_x
        }
	};
	//end

	//填充纵轴维度 start
	for (var yde_index = 0; yde_index < y_length; yde_index++) {
		var y_id=pivotObj.y[yde_index].id;//y属性轴id

		var y_dt=pivotObj.y[yde_index].dataType;//y轴属性类型
		var y_idx_col = col+yde_index;//y轴数据起始列
		if(y_dt === 2){
			if(y_id.length === 6){
				dimId = y_id;
			}else{
				dimId = getAjaxValue(router.getDimId,'text',{'subSetId':y_id},function(data){
					return data;
				});
			}
			
			dimComsTemp.push({
				level : pivotObj.y[yde_index].levels,
				type : 'y',
				id : dimId,
				value : y_idx_col
			})
		}else if(y_dt === -1){
			meaRlation = {
				type : 'y',
				value : y_idx_col
			}
		}else if(y_dt === 7){
            periodRelation = {
            	type : 'y',
            	value : y_idx_col
            }
		}
		for(var j=row;j<yde.length+row;j++){
		    if ((j+d_length+x_length) == jS.sheetSize().height) {
	            jS.controlFactory.addRow(':last');
	        }
	 	   var td_y=jQuery(jS.getTd(jS.i, j+d_length+x_length, y_idx_col));
	 	   var cell_y = jS.spreadsheets[jS.i][j+d_length+x_length][y_idx_col];
	 	   var formula_y,
	 	       index_y = j-row;//当前y轴下标
	 	   if(y_dt === 7 ) {
	 	   	   var periodTmp_y = yde[index_y][yde_index].id
	 		   compareRes = compareDay(periodTmp_y,defaultPeriod)
		 	   preday="," + compareRes.days;
		 	   formula_y="=PERIODNAME(\"$report_date\",\""+compareRes.periodLabel+"\""+preday+")";
	 	   }else if(y_dt === -1){
	     	   formula_y="=ENAME(\"measure\",\""+yde[index_y][yde_index].code+"\")";
	     	   cell_y.value=yde[index_y][yde_index].code;
	 	   }else{
	 	   	   formula_y="=ENAME(\""+y_id+"\",\""+yde[index_y][yde_index].id+"\")";
	 	   	   cell_y.value=yde[index_y][yde_index].id;
	 	   }
	 	   td_y.attr('formula',formula_y);
	 	   td_y.html(yde[index_y][yde_index].name);
	 	   cell_y.formula=formula_y
	    }
	};
    //end

    //填充数据 start
    dimComsTemp.sort(function(a,b){//确保维度数据按维度id从小到大排序
    	if(a.id.length == 6 && b.id.length == 6) return a.id < b.id ? 1 : -1;
    	return a.id > b.id ? 1 : -1;
    })
    
    for(var k=row+d_length+x_length;k<yde.length+row+x_length+d_length;k++){
 	  for(var h=col+y_length;h<xde.length+col+y_length;h++){
 		    var newTd=jQuery(jS.getTd(jS.i, k, h));
			var cellNew = jS.spreadsheets[jS.i][k][h];
			var dimComs=[];
			
			//确定维度集合引用关系start
			for (var dim_inx = 0; dim_inx < dimComsTemp.length; dim_inx++) {
				var cellInx;
				if(dimComsTemp[dim_inx].type === 'x'){
					cellInx = jSE.columnLabelString(h)+"$"+(dimComsTemp[dim_inx].value+1);
                    dimComs.push(cellInx);
				}
                
                if(dimComsTemp[dim_inx].type === 'y'){
					cellInx = "$"+jSE.columnLabelString(dimComsTemp[dim_inx].value)+(k+1);
                    dimComs.push(cellInx);
				}

				if(dimComsTemp[dim_inx].type === 'd'){
					cellInx = "$"+jSE.columnLabelString(col)+"$"+(dimComsTemp[dim_inx].value+1);
                    dimComs.push(cellInx);
				}

			};
			//end
			//确定度量引用关系start
            if(meaRlation.type === 'x'){
            	measureId = jSE.columnLabelString(h)+"$"+(meaRlation.value+1);
            }else if(meaRlation.type === 'y'){
            	measureId = "$"+jSE.columnLabelString(meaRlation.value)+(k+1);
            }else if(meaRlation.type === 'd'){
            	measureId = "$"+jSE.columnLabelString(col)+"$"+(meaRlation.value+1);
            }
			//end
			//确定周期引用关系start
            if(periodRelation.type === 'x'){
            	periodName = jSE.columnLabelString(h)+"$"+(periodRelation.value+1);
            }else if(periodRelation.type === 'y'){
            	periodName = "$"+jSE.columnLabelString(periodRelation.value)+(k+1);
            }else if(periodRelation.type === 'd'){
            	periodName = "$"+jSE.columnLabelString(col)+"$"+(periodRelation.value+1);
            }
			//end
			if(dimComs.length > 0){
				newtdValue="DATA(\""+pivotObj.cubeId+"\","+periodName+","+dimComs.toString()+","+measureId+")";
			}else{
				newtdValue="DATA(\""+pivotObj.cubeId+"\","+periodName+","+measureId+")";
			}
			
			
			newTd.attr("formula","="+newtdValue);
			newTd.html('0');
	      	cellNew.formula=newtdValue;
 	   }
    }
    setTimeout(function(){
		refreshCache();
	},50);
    //end
}

function getAjaxValue(url,dataType,params,handler){
	var result;
	jQuery.ajax({
	  	url: url,
	  	type: 'POST',
	  	dataType: dataType,
	  	data: params,
	  	async: false,
	  	success: function(data, textStatus, xhr) {
	    	//called when successful
	    	result = handler(data);
	  	},
	  	error: function(xhr, textStatus, errorThrown) {
	    	//called when there is an error
	    	throw new Error(textStatus);
	  	}
	});
	return result;
}

function compareDay(periodId,day2){
	var days,
	    periodLabel;
	var url = router.getSubDays;
    var params = {
       	day1 : periodId,
       	day2 : day2
    };
    jQuery.ajax({
      	url: url,
      	type: 'POST',
      	async: false,
      	data: params,
      	success: function(data, textStatus, xhr) {
      		var value = data.split(',');
        	days = value[0];
        	periodLabel = value[1];
      	},
      	error: function(xhr, textStatus, errorThrown) {
        	console.log(textStatus);
      	}
    });
	return {
		days:days,
		periodLabel:periodLabel
	}
}

function releaseJob(id, type){
	if (id == null || id=="") {
		id = $('#reportId').val();
	}
	   jQuery.post(router.doRelease,
             {
			   'reportId':id,
			   'type':type
			  },
			  function (rdata, textStatus){
				  var returnId = rdata;
				  if (returnId == -1) {
					  alert("报表未保存，请先保存再发布.");
				  } else if (returnId == -2) {
					  alert("没有可以发布的报表，请检查报表是否已经发布.");
				  } else {
					  alert("发布成功.");
					  window.location.href="reportList.do?actionName=preEdit&makeCopy=false&id=" + returnId;
				  }
				  //window.opener.location.reload();
			  },
		'text');
  } 

function parsePid(vs,cell,td){
	var reportDate=vs[0];
	if(reportDate == '$report_date') reportDate=useParam(reportDate);
	var periodLabel=vs[1];
	var period,preDay;

	if(vs.length==3){
		preDay=vs[2];
	}else if(vs.length==2){
	    preDay=0;
	}

	if(periodMap.get(reportDate+'_'+periodLabel+'_'+preDay)) return periodMap.get(reportDate+'_'+periodLabel+'_'+preDay);

    var url = router.doPeriod;
	var params="reportDate="+reportDate+"&periodLabel="+periodLabel+"&preDay="+preDay;
	var xmlHttpRequest=getXmlHttpRequest();
	ajaxSubmit_false(xmlHttpRequest,url,params,computeFormula_CB)

	function computeFormula_CB(v){
	 	if(xmlHttpRequest.readyState == 4){  
       		if(xmlHttpRequest.status == 200){
           		var responseText = xmlHttpRequest.responseText;//服务器回传文本  
                var resObj = eval("(" + responseText + ")");
                period=resObj.periodId;
                periodMap.put(reportDate+'_'+periodLabel+'_'+preDay,period);
	        }  
	    }  
	}
	return period;
}

function parsePname(vs,cell,td){
	var reportDate=vs[0];
	if(reportDate == '$report_date') reportDate=useParam(reportDate);
	var periodLabel=vs[1];
	var pid,pname,preDay;
	if(vs.length==3){
		preDay=vs[2];
	}else if(vs.length==2){
	    preDay=0;
	}

	if(periodMap.get(reportDate+'_'+periodLabel+'_'+preDay+'_name')) {
		pname=periodMap.get(reportDate+'_'+periodLabel+'_'+preDay+'_name');
        td.html(pname);
        td.attr("title",reportInfo.tip+pname);
		return periodMap.get(reportDate+'_'+periodLabel+'_'+preDay);
	}

    var url = router.doPeriod;
	var params="reportDate="+reportDate+"&periodLabel="+periodLabel+"&preDay="+preDay;
	var xmlHttpRequest=getXmlHttpRequest();
	ajaxSubmit_false(xmlHttpRequest,url,params,computeFormula_CB)

	function computeFormula_CB(v){
	 	if(xmlHttpRequest.readyState == 4){  
       		if(xmlHttpRequest.status == 200){
	            var responseText = xmlHttpRequest.responseText;//服务器回传文本  
	            var resObj = eval("(" + responseText + ")");
	            pid=resObj.periodId;
	            pname=resObj.periodName;
	            td.html(pname);
	            td.attr("title",reportInfo.tip+pname);
	            periodMap.put(reportDate+'_'+periodLabel+'_'+preDay+'_name',pname);
	            periodMap.put(reportDate+'_'+periodLabel+'_'+preDay,pid);
	    	}  
		}  
	}
	
	return pid;
			 
}

function parseEid(vs,cell,td){
	var url,params,eid;
	var dimId = vs[0];
	var eleId = Array.prototype.slice.call(vs,1).toString();
	
    url = router.getEid;
    params = {
		dimId : dimId,
		eleId : eleId
	};
	if(eMap.get(dimId+"_"+eleId)){
        td.html(eMap.get(dimId+"_"+eleId));
        return eMap.get(dimId+"_"+eleId);
	};
    jQuery.ajax({
      url: url,
      type: 'POST',
      async: false,
      data: params,
      success: function(data, textStatus, xhr) {
        eid = data
        td.html(eid);
        td.attr("title",reportInfo.tip+eid);
        eMap.put(dimId+"_"+eleId,eid);
      }
    });
    return eid;
}

function parseEname(vs,cell,td){
	var url,params,eid;
	
    url = router.getEname;
    params = {
		dimId : vs[0],
		eleId : vs[1]
	};

    if(eMap.get(vs[0]+"_"+vs[1]+"_name")){
        td.html(eMap.get(vs[0]+"_"+vs[1]+"_name"));
        return eMap.get(vs[0]+"_"+vs[1]);
	};

    jQuery.ajax({
      	url: url,
      	type: 'POST',
      	async: false,
      	data: params,
      	success: function(data, textStatus, xhr) {
        	var resObj = eval("(" + data + ")");
        	eid = resObj.dimId
        	td.html(resObj.dimName);
        	td.attr("title",reportInfo.tip+resObj.dimName);
        	eMap.put(vs[0]+"_"+vs[1],eid);
        	eMap.put(vs[0]+"_"+vs[1]+"_name",resObj.dimName);
      	}
    });
    return eid;
}

function copyCell(ifcut){
	copytmp =[];
    var startLoc,endLoc;
    var cells = jS.obj.cellHighlighted();
    startLoc = jS.getTdLocation(cells.first());
    endLoc = jS.getTdLocation(cells.last());
    var arri = new Array();
    for(var i=startLoc.col;i<=endLoc.col;i++){
    	var arrj= new Array();
    	for(var j=startLoc.row;j<=endLoc.row;j++){
    		var newTd=jQuery(jS.getTd(jS.i, j, i));
			var cellNew = jS.spreadsheets[jS.i][j][i];
			var tdbak=jS.getTd(jS.i, j, i).cloneNode(true);//克隆对象
			var cellbak=jQuery.extend(true, {}, cellNew);
			var copyCell={
					td : tdbak,
					cell : cellbak
			};
			arrj.push(copyCell);
			if(ifcut){//如果是剪切
				newTd.html('');
				newTd.attr('formula','');
				newTd.attr('format','');
				newTd.attr('style','');
				newTd.attr('rowspan','');
				newTd.attr('colspan','');
				newTd.attr('tetext','');
				newTd.attr('cellvalue','');
				cellNew.value='';
				cellNew.formula='';
			}
    	}
    	arri.push(arrj);
    }
    copytmp = arri;
}

function pasteCell(){
	var td=jS.highlightedLast.td;
	var loc ={
			row : jS.highlightedLast.rowStart,
			col : jS.highlightedLast.colStart
	};
	var cell = jS.spreadsheets[jS.i][loc.row][loc.col];
	for(var i =0; i < copytmp.length; i++){
		for(var j=0;j < copytmp[i].length; j++){
			var tdnew = jQuery(jS.getTd(jS.i, j+loc.row, i+loc.col));
			var cellnew= jS.spreadsheets[jS.i][j+loc.row][i+loc.col];
			tdnew.html(copytmp[i][j].td.innerHTML);
			tdnew.attr('formula',copytmp[i][j].td.getAttribute('formula'));
			tdnew.attr('format',copytmp[i][j].td.getAttribute('format'));
			tdnew.attr('style',copytmp[i][j].td.getAttribute('style'));
			tdnew.attr('colspan',copytmp[i][j].td.getAttribute('colspan'));
			tdnew.attr('rowspan',copytmp[i][j].td.getAttribute('rowspan'));
			tdnew.attr('tdtext',copytmp[i][j].td.getAttribute('tdtext'));
			tdnew.attr('cellvalue',copytmp[i][j].td.getAttribute('cellvalue'));
			cellnew.value = copytmp[i][j].cell.value;
			cellnew.formula = copytmp[i][j].cell.formula;
		}
	}
}

//处理各种引用类型公用方法
function parseRef(ignored,offset,loc,flag){
	var ref,offsetnew;
	if(flag){
		if(ignored.match(/\$/g).length == 2){
			offsetnew={
					row : 0,
					col : 0
			};
			ref = jS.makeFormula(loc, offsetnew);
		}else if(ignored.charAt(0) == '$'){
			offsetnew={
					row : offset.row,
					col : 0
			};
			ref = jS.makeFormula(loc, offsetnew);
		}else{
			offsetnew={
					row : 0,
					col : offset.col
			};
			ref = jS.makeFormula(loc, offsetnew);
		}
	}else{
		ref = jS.makeFormula(loc);
	}
	
	
	
	var colStr = ref.match(/[A-Za-z]+/);
	var rowStr = ref.match(/\d+/);
	
	if(ignored.match(/\$/g).length == 2){
		return '$'+colStr+'$'+rowStr;
	}else if(ignored.charAt(0) == '$'){
		return '$'+colStr+rowStr;
	}else{
		return colStr+'$'+rowStr;
	}
}

//调用Parser&&显示格式化函数计算结果
function doParser(cell,sheet, row, col, s){
	if(!cell) cell = jS.spreadsheets[sheet][row][col];
	var Parser = getParser(jS,cell,sheet, row, col, s);
    var formulaHigh=cell.formula;
    if(!formulaHigh) return;
    if(formulaHigh.indexOf('=') == 0) formulaHigh=formulaHigh.replace('=','');
	var oldValue=cell.oldValue;
	var td = jQuery(jS.getTd(jS.i, row, col));
	var reg=/\$?([a-zA-Z]+)\$?([0-9]+)/gi;
	
    if(/^[A-Z]+\d+$/.test(formulaHigh)){
    	var loc = jSE.parseLocation(formulaHigh);
    	var td_parse=jQuery(jS.getTd(sheet, loc.row, loc.col))
    	var cell_parse=jS.spreadsheets[sheet][loc.row][loc.col];
    	var formula_parse=cell_parse.formula;
    	
    	if(formula_parse && (formula_parse.indexOf('PERIODNAME') != -1 || formula_parse.indexOf('ENAME') != -1)){
    		jQuery(jS.updateCellValue(sheet, loc.row, loc.col));
    		vv=td_parse.html();
    		td.attr('cellvalue',cell_parse.value);
    	}else{
    		vv=Parser.parse(formulaHigh);
    	}
    }else{
    	vv=Parser.parse(formulaHigh);
    }

    if(vv!=reportInfo.hold){//如果为 reportInfo.hold 则由hold 部分处理cell的值
    	cell.value =vv;
    }
    
}
//显示格式化函数计算结果
function formatRes(cell,sheet, row, col, s){
	
	if(!cell) cell = jS.spreadsheets[sheet][row][col];
	if (cell.html) { //if cell has an html front bring that to the value but preserve it's value
        jQuery(jS.getTd(sheet, row, col)).html(cell.html);
    }
    else {
    	var cur_td=jQuery(jS.getTd(sheet, row, col));
        var varNum;
    	if(cell.formula && cell.formula.indexOf("DATA") ===-1 && (cell.formula.indexOf("ENAME") !=-1 || cell.formula.indexOf("PERIODNAME") !=-1)){
    		var td_html=cur_td.html();
    		varNum=td_html;
    	}else{
    		varNum=cell.value;
    	}
    	
    	var cur_format=cur_td.attr("format");
    	var reg=/^-?\d+\.?\d*[Ee]?-?\d*$/;
    	var new_val,defVal;
    	var numNew = Number(varNum);
    	if(numNew < 1){
    		if(varNum.length >6){
    			defVal=numNew.toFixed(6).replace(".000000","");
    		}else{
    			defVal=varNum;
    		}
    	}else{
    		defVal=numNew.toFixed(2).replace(".00","");
    	}
			
		var title=cur_td.attr('title');
		if(title && title.indexOf('#value#') != -1) title=title.replace('#value#',defVal);
		cur_td.attr('title',title);
		if(reg.test(varNum) && cur_format && cur_format != "undefined"){
			if(cur_format.indexOf('%') != -1){
				var formats=cur_format.split(",");
				if(formats[0] >= 0 && formats[0] <= 20){
					varNum=varNum*(Math.pow(10, 2));
  				new_val=varNum.toFixed(formats[0]);
  				
  				cur_td.html(new_val+'%');
				}else{
					cur_td.html(varNum);
				}
				
			}else if(cur_format.indexOf('%') == -1){
				var reg_d=/^-?\d+$/;
            if(reg_d.test(cur_format) && cur_format >= 0 && cur_format <= 20){
					cur_td.html(numNew.toFixed(cur_format));
				}else{
					cur_td.html(defVal);
				}
			}
		}else{
			if(cell.formula && reg.test(varNum)){
				cur_td.html(defVal);
			}else{
				cur_td.html(varNum);
			}
		}
    }
}

//获取parser对象
function getParser(jS,cell,sheet, row, col, s){
	var Parser;
    if (jS.callStack) { //we prevent parsers from overwriting each other
        if (!cell.parser) { //cut down on un-needed parser creation
            cell.parser = (new jS.parser);
        }
        Parser = cell.parser
    }
    else {//use the sheet's parser if there aren't many calls in the callStack
        Parser = jS.Parser;
    }
    
    jS.callStack++
    Parser.lexer.cell = {
        sheet: sheet,
        row: row,
        col: col,
        cell: cell,
        s: s,
        editable: true,
        jS: jS
    };
    Parser.lexer.cellHandlers = jS.cellHandlers;
    return Parser;
}

//查找单元格递归引用列表
function getRecursiveRef(key){
    var refcells=map.get(key);
    if(refcells){
    	cellRec+=refcells+',';
    	var subrefs=refcells.split(',');
    	for(var i=0;i<subrefs.length;i++){
    		if(map.get(subrefs[i])) getRecursiveRef(subrefs[i]);
    	}
    }
    if(cellRec.split(',').length > 1000){
		console.log(key);
	}
    return cellRec.substring(0,cellRec.length-1);
}

function showDataDetail(){
	ifDataDetail = true;
	var cell = jS.spreadsheets[jS.i][jS.highlightedLast.rowStart][jS.highlightedLast.colStart];
	cell.calcCount = 0;
	jS.updateCellValue(jS.i,jS.highlightedLast.rowStart,jS.highlightedLast.colStart);
}