package util;

import java.io.IOException;
import java.security.KeyStore;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

public class DarwinHttpClient {

	{
		try {
			KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
			SSLSocketFactory socketFactory = new SSLSocketFactory(trustStore);
			Scheme sch = new Scheme("https", 443, socketFactory);
			DefaultHttpClient httpclient = new DefaultHttpClient();
			httpclient.getConnectionManager().getSchemeRegistry().register(sch);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public String get(String url) {
		HttpEntity entity = getEntity(url);
		try {
			return EntityUtils.toString(entity, HTTP.UTF_8);
		} catch (Exception e) {
			e.printStackTrace();
			return "404";
		}
	}

	public byte[] getBytes(String url) {
		HttpEntity entity = getEntity(url);
		try {
			return EntityUtils.toByteArray(entity);
		} catch (IOException e) {
			throw new RuntimeException(e.getCause());
		}
	}

	public String post(String url, List<NameValuePair> nvps) {
		HttpPost httpost = new HttpPost(url);
		httpost.setHeader("User-Agent",
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.1 (KHTML, like Gecko) Ubuntu/11.10 Chromium/14.0.835.202 Chrome/14.0.835.202 Safari/535.1");

		try {
			httpost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
			DefaultHttpClient httpclient = new DefaultHttpClient();
			HttpResponse response = httpclient.execute(httpost);
			HttpEntity entity = response.getEntity();
			return EntityUtils.toString(entity, HTTP.UTF_8);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getCause());
		}
	}

	private HttpEntity getEntity(String url) {
		try {
		HttpGet httpget = new HttpGet(url);
		httpget.setHeader("User-Agent",
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.1 (KHTML, like Gecko) Ubuntu/11.10 Chromium/14.0.835.202 Chrome/14.0.835.202 Safari/535.1");
		httpget.setHeader("Accept-Language","zh-cn,zh;q=0.5");
		

		// 允许死循环方式的重定向
		httpget.getParams().setParameter("http.protocol.allow-circular-redirects", true);

		HttpResponse response;
		DefaultHttpClient httpclient = new DefaultHttpClient();
		HttpConnectionParams.setConnectionTimeout(httpclient.getParams(), 3000);  
		HttpConnectionParams.setSoTimeout(httpclient.getParams(), 3000);  
		response = httpclient.execute(httpget);
		return response.getEntity();
		} catch (Exception e){
			e.printStackTrace();
			System.out.println("404");
		}
		return null;
	}

}
