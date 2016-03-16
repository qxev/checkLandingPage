package thread;

import org.springframework.web.multipart.MultipartFile;

import dao.JobDao;

public class TaskModel {
	
	private MultipartFile file;

	private String project;

	private String path;
	
	private int rowNum;

	private int jobId;
	
	private JobDao jobDao;
	
	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public void setRowNum(int rowNum) {
		this.rowNum = rowNum;
	}

	public int getRowNum() {
		return rowNum;
	}

	public void setJobDao(JobDao jobDao) {
		this.jobDao = jobDao;
	}

	public JobDao getJobDao() {
		return jobDao;
	}

	public void setJobId(int jobId) {
		this.jobId = jobId;
	}

	public int getJobId() {
		return jobId;
	}
	
	
}
