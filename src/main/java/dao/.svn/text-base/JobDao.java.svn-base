package dao;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import model.Job;
import model.Url;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.simple.SimpleJdbcDaoSupport;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import util.JQueryFlexigrid;

@Repository
public class JobDao extends SimpleJdbcDaoSupport{

    public List<Job> findALLJob() {
        List<Job> jobs = new ArrayList<Job>();;
        String sql = "select * from job order by startAt desc ";
        List list = getSimpleJdbcTemplate().queryForList(sql); 
        Iterator iterator = list.iterator();
        Job job = null;
        while (iterator.hasNext()) {
            Map mapjob = (Map) iterator.next();
            job = new Job();
            job.setId((Integer) mapjob.get("id"));
            job.setName((String)mapjob.get("name"));
            jobs.add(job);
        }
        return jobs;
    }    
    
    public HashMap<String,String> findRightUrlsOneDay() {
    	HashMap<String,String> urls = new HashMap<String,String>();;
        String sql = "select * from url where status = 0 and TIMEDIFF(NOW(),createAt) <1 ";
        List list = getSimpleJdbcTemplate().queryForList(sql); 
        Iterator iterator = list.iterator();
        Url url = null;
        while (iterator.hasNext()) {
            Map mapjob = (Map) iterator.next();
            urls.put((String)mapjob.get("url"),(String)mapjob.get("url"));
        }
        return urls;
    }
    
    public String findRecent10() {
        List<Job> jobs = new ArrayList<Job>();;
        String sql = "select * from job order by startAt desc limit 10";
        List list = getSimpleJdbcTemplate().queryForList(sql); 
        Iterator iterator = list.iterator();
        Job job = null;
        while (iterator.hasNext()) {
            Map mapjob = (Map) iterator.next();
            job = new Job();
            job.setId((Integer) mapjob.get("id"));
            job.setName((String)mapjob.get("name"));
            job.setStartAt((Date)mapjob.get("startAt"));
            job.setEndAt((Date)mapjob.get("endAt"));
            job.setCurrentNum((Integer)mapjob.get("currentNum"));
            job.setTotalNum((Integer)mapjob.get("totalNum"));
            job.setStatus((String)mapjob.get("status"));
            jobs.add(job);
        }
        return JQueryFlexigrid.getGridJson(jobs, 1, 10);
    }    
    
    public int delete(int bid){
        String sql = "delete from BookInfo where bid =?";
        return getSimpleJdbcTemplate().update(sql, new Object[]{bid});
    }   
    
    public int updateNum(int currentNum, int jobId){
        String sql = "update job set currentNum = ? where id =?";
        return getSimpleJdbcTemplate().update(sql, new Object[]{currentNum,jobId});
    } 
    
    public int updateStatus(int jobId){
        String sql = "update job set status = '正在执行' where id =?";
        return getSimpleJdbcTemplate().update(sql, new Object[]{jobId});
    } 
    
    public void updateFinish(int jobId,Date date){
        String sql = "update job set status = '完成', endAt = ? where id =?";
        getSimpleJdbcTemplate().update(sql, new Object[]{date,jobId});
    } 

    public int insert(Integer currentNum,Integer totalNum,Date startAt,String name){
    	SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(this.getDataSource()).withTableName("job").usingGeneratedKeyColumns("id").usingColumns("currentNum", "totalNum", "startAt", "name", "status");
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("currentNum", currentNum);
		parameters.put("totalNum", totalNum);
		parameters.put("startAt", startAt);
		parameters.put("name", name);
		parameters.put("status", "等待中");
		Number newId = simpleJdbcInsert.executeAndReturnKey(parameters);
        return newId.intValue();
    }    
    
    public int insertUrl(Integer status,String url,String errorMessage){
    	SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(this.getDataSource()).withTableName("url").usingGeneratedKeyColumns("id").usingColumns("url", "createAt", "errorMessage", "status");
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("errorMessage", errorMessage);
		parameters.put("status", status);
		parameters.put("createAt", new Date());
		parameters.put("url", url);
		Number newId = simpleJdbcInsert.executeAndReturnKey(parameters);
        return newId.intValue();
    } 

    public static void main(String[] args) {   
    	ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath*:spring-main.xml");
    	JobDao jobDao = (JobDao)ctx.getBean("jobDao");
    	
        int i = jobDao.insert(0,94,new Date(),"harry倒入");
    }
    
}