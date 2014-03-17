package com.datavalue.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.datavalue.model.MetaObject;

@Component("metaObjectDao")
public class MetaObjectDao extends BaseDao {

	public List<MetaObject> select() {
		return this.readSqlSession.selectList("com.datavalue.dao.MetaObjectDao.select");
	}
	
	public int insert(MetaObject metaObject) {
		return this.writerSqlSession.insert("com.datavalue.dao.MetaObjectDao.insert", metaObject);
	}
	
	public int delete(int id) {
		return this.writerSqlSession.delete("com.datavalue.dao.MetaObjectDao.delete", id);
	}
	
}
