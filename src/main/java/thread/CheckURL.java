package thread;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.collections.Buffer;
import org.apache.commons.collections.buffer.BlockingBuffer;
import org.apache.commons.collections.buffer.BoundedFifoBuffer;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dao.JobDao;

@Service
public class CheckURL {

	private static final Buffer buffer = BlockingBuffer.decorate(new BoundedFifoBuffer());

	static {
		BufferListener listener = new BufferListener(buffer);
		Thread listenerThread = new Thread(listener);
		listenerThread.start();
	}

	@Autowired
	private JobDao jobDao;

	public void addJob(MultipartFile file, String project, String path) throws IOException {
		POIFSFileSystem fs = new POIFSFileSystem(file.getInputStream());
		HSSFWorkbook wb = new HSSFWorkbook(fs);
		HSSFSheet sheet = wb.getSheetAt(0);
		int rowNum = initNum(sheet);
		int jobId = jobDao.insert(0, rowNum, new Date(), project);
		FileOutputStream os = new FileOutputStream(path + "upload/" + jobId + ".xls");
		wb.write(os);
		os.close();
		TaskModel model = new TaskModel();
		model.setFile(file);
		model.setProject(project);
		model.setPath(path);
		model.setRowNum(rowNum);
		model.setJobId(jobId);
		model.setJobDao(jobDao);
		buffer.add(model);
	}

	private int initNum(HSSFSheet sheet) {
		int rowNum = 0;
		for (int i = 1; i <= 60000; i++) {
			HSSFRow row = sheet.getRow(i);
			if (row == null)
				break;
			if (row.getCell(0) == null)
				break;
			if (StringUtils.isBlank(row.getCell(0).getStringCellValue()))
				break;
			rowNum = i;
		}
		return rowNum;
	}

}
