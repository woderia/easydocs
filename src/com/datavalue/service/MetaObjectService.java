package com.datavalue.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.datavalue.dao.MetaObjectDao;
import com.datavalue.model.MetaObject;

@Service("metaObjectService")
public class MetaObjectService {

	@Resource(name="metaObjectDao")
	private MetaObjectDao metaObjectDao;
	
	/**
	 * 获取所有的对象
	 * @return
	 */
	public List<MetaObject> select(){
		return metaObjectDao.select();
	}
	
	
	
	
}
