package thread;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.HashMap;

import org.apache.commons.collections.Buffer;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import util.DarwinHttpClient;
import dao.JobDao;

public class BufferListener implements Runnable {

	private Buffer buffer;

	public BufferListener(Buffer buffer) {
		this.buffer = buffer;
	}

	public String replaceStr(String str) {
		str = str.replace("{creative}", "1");
		str = str.replace("{domain}", "1");
		str = str.replace("{placement}", "1");
		str = str.replace("{keyword.id}","1");
		str = str.replace("{","1");
		str = str.replace("}","1");
		str = str.replace("|", "");
		return str;
	}

	private static String[] errors = { "很遗憾，我们不能处理您的交易", "很遗憾，我们找不到您查找的网页", "在所要求的日期没有可以提供的酒店" };

	private static String[] sephoraErrors = { "暂无库存"  };
	
	private static String[] macauErrors = { "未找到页面 (404" };


	private void deleteRow(HSSFSheet sheet, int rowNum) {
		for (int i = rowNum; i > 0; i--) {
			HSSFRow row = sheet.getRow(i);
			if (row == null) {
				sheet.shiftRows(i + 1, rowNum + 1, -1);
			} else if (row.getCell(0) == null) {
				sheet.shiftRows(i + 1, rowNum + 1, -1);
			} else if ("".equals(row.getCell(0).getRichStringCellValue().toString())) {
				sheet.shiftRows(i + 1, rowNum + 1, -1);
			}
		}
	}

	public void run() {
		while (true) {
			try {
				TaskModel taskModel = (TaskModel) buffer.remove();
				JobDao jobDao = taskModel.getJobDao();
				int rowNum = taskModel.getRowNum();
				int jobId = taskModel.getJobId();
				String path = taskModel.getPath();
				String project = taskModel.getProject();
				DarwinHttpClient httpClient = new DarwinHttpClient();
				File uploadFile = new File(path + "upload/" + jobId + ".xls");
				POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadFile));
				HSSFWorkbook wb = new HSSFWorkbook(fs);
				HSSFSheet sheet = wb.getSheetAt(0);
				try {
					for (int i = 1; i <= rowNum; i++) {
						HSSFRow row = sheet.getRow(i);
						if (row == null)
							break;
						HSSFCell cell = row.getCell(0);
						if (i==1){
							jobDao.updateStatus(jobId);
						}
						jobDao.updateNum(i, jobId);
						String url = replaceStr(cell.getRichStringCellValue().toString());
						HashMap<String, String> urls = jobDao.findRightUrlsOneDay();
						if (urls.get(url) == null) {
							String content = httpClient.get(url);
							Integer status = 0;
							String errorMessage = "";
							if ("HRS".equals(project)){
								for (String error : errors) {
									if (content.contains(error)) {
										status = 1;
										HSSFCell cell1 = row.createCell((short) 10);
										cell1.setCellValue(error);
										errorMessage = error;
									}
								}
							}
							if ("sephora".equals(project)){
								Thread.sleep(5000);
								for (String error : sephoraErrors) {
									if (content.contains(error)) {
										status = 1;
										HSSFCell cell1 = row.createCell((short) 10);
										cell1.setCellValue(error);
										errorMessage = error;
									}
								}
								if (!content.contains("https://search.szfw.org/cert/l/CX20120905001612001687")){
									status = 1;
									HSSFCell cell1 = row.createCell((short) 10);
									cell1.setCellValue("页面失效");
									errorMessage = "页面失效";
								}
							}
							if ("macau".equals(project)){
								if ("404".equals(content)){
									status = 1;
									HSSFCell cell1 = row.createCell((short) 10);
									cell1.setCellValue("404");
									errorMessage = "404";
								} else {
									for (String error : macauErrors) {
										if (content.contains(error)) {
											status = 1;
											HSSFCell cell1 = row.createCell((short) 10);
											cell1.setCellValue(error);
											errorMessage = error;
										}
									}
								}
								
							}
							if (status == 0)
								sheet.removeRow(row);
							
							jobDao.insertUrl(status, url, errorMessage);
						} else {
							sheet.removeRow(row);
						}
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
				deleteRow(sheet, rowNum);
				FileOutputStream os = new FileOutputStream(path + "xls/" + jobId + ".xls");
				wb.write(os);
				os.close();
				jobDao.updateFinish(jobId, new Date());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
