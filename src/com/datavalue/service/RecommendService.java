package com.datavalue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.mahout.cf.taste.eval.RecommenderBuilder;
import org.apache.mahout.cf.taste.impl.common.LongPrimitiveIterator;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.springframework.stereotype.Service;

import com.datavalue.util.RecommendFactory;
import com.datavalue.util.RecommenderEvaluator;

@Service("recommendService")
public class RecommendService {

    public  Map<String, List<RecommendedItem>> result() throws Exception {
    	String file = "D:/wy/mahout/datafile/job/pv.csv";
        DataModel dataModel = RecommendFactory.buildDataModelNoPref(file);
        RecommenderBuilder recommenderBuilder = RecommenderEvaluator.itemLoglikelihood(dataModel);
        LongPrimitiveIterator iter = dataModel.getUserIDs();
        Map<String,List<RecommendedItem>> resultMap = new HashMap<String,List<RecommendedItem>>();
        while (iter.hasNext()) {
            long uid = iter.nextLong();
            List<RecommendedItem> list = recommenderBuilder.buildRecommender(dataModel).recommend(uid, 3);
            resultMap.put(String.valueOf(uid), list);
        }
        return resultMap;
    }
}
