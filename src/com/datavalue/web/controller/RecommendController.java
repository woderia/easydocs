package com.datavalue.web.controller;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.datavalue.service.RecommendService;

/**
 * 获取推荐列表
 */
@Controller
public class RecommendController {
	@Resource(name="recommendService")
	private RecommendService recommendService;
	
	@RequestMapping(value="/recommend/result",method=RequestMethod.GET)
	public ResponseEntity<String> listRecommend(String callback) throws Exception{
		Map<String,List<RecommendedItem>> resultMap = recommendService.result();
		Iterator<String> iter = resultMap.keySet().iterator();
		JSONObject re = new JSONObject();
		int i=0;
		while(iter.hasNext()){
			if(i > 200) break;
			String key = iter.next();
			List<RecommendedItem> ritems = resultMap.get(key);
			List<String> reIds = new ArrayList<String>();
			for(RecommendedItem ritem : ritems){
				reIds.add(String.valueOf(ritem.getItemID()));
			}
			re.accumulate(key, reIds);
			i++;
		}
		return new ResponseEntity<String>(callback+"("+re.toString()+")", new HttpHeaders(), HttpStatus.OK);
	}
}
