package controller;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.Buffer;
import org.apache.commons.collections.buffer.BlockingBuffer;
import org.apache.commons.collections.buffer.BoundedFifoBuffer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import thread.CheckURL;
import util.HttpServletUtils;
import dao.JobDao;

@Controller
public class HRSController {

	private static final long serialVersionUID = 1L;

	@Autowired
	private JobDao jobDao;

	@Autowired
	private CheckURL checkURL;

	@RequestMapping(value = { "/show" }, method = RequestMethod.GET)
	public String show(HttpServletRequest request, HttpServletResponse response) throws IOException {
		return "xls";
	}

	@RequestMapping(value = { "/importXls" }, method = RequestMethod.POST)
	public String importXls(HttpServletRequest request, HttpServletResponse response, @RequestParam("file") MultipartFile file, String project) throws FileNotFoundException,
			IOException, InterruptedException {
		checkURL.addJob(file, project, request.getSession().getServletContext().getRealPath("/"));
		Thread.sleep(2000);
		return "redirect:show";
	}

	public String show() {
		return "success";
	}

	@RequestMapping(value = "/jobGrid", method = RequestMethod.POST)
	public void jobGrid(HttpServletRequest request, HttpServletResponse response) {
		HttpServletUtils.renderJson(response, jobDao.findRecent10());
	}
}