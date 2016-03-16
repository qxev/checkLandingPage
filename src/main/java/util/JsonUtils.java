package util;

import java.io.Reader;
import java.lang.reflect.Type;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JsonUtils {

	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public static String toJson(Object o) {
		Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
		return gson.toJson(o);
	}

	@SuppressWarnings("unchecked")
	public static <T> T toObject(String json, Type type) {
		Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
		return (T) gson.fromJson(json, type);
	}

	@SuppressWarnings("unchecked")
	public static <T> T toObject(Reader json, Type type) {
		Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
		return (T) gson.fromJson(json, type);
	}
}
