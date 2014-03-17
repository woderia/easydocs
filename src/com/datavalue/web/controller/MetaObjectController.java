package com.datavalue.web.controller;


import java.nio.charset.Charset;
import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.datavalue.model.MetaObject;
import com.datavalue.service.MetaObjectService;
import com.datavalue.util.DateUtil;

@Controller
public class MetaObjectController {
	
	@Resource(name="metaObjectService")
	private MetaObjectService metaObjectService;
	
	@RequestMapping(value="/listObject",method=RequestMethod.GET)
	public ResponseEntity<String> listObject(){
		List<MetaObject> objs = metaObjectService.select();
		JSONArray results = new JSONArray();
		for(MetaObject metaobj : objs){
			JSONObject obj = new JSONObject();
			obj.put("name", metaobj.getName());
			obj.put("id", metaobj.getId());
			obj.put("gmtModified", DateUtil.formateDate(metaobj.getGmtModified(), DateUtil.TIME));
			results.add(obj);
		}
		
		HttpHeaders headers = new HttpHeaders();     
        MediaType mediaType=new MediaType("text","html",Charset.forName("UTF8"));     
        headers.setContentType(mediaType); 
		return new ResponseEntity<String>(results.toString(), headers, HttpStatus.OK);
	}
}
