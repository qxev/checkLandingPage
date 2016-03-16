package util;

import helper.Align;
import helper.DateTime;
import helper.Display;
import helper.FieldName;
import helper.GridSettings;
import helper.Hide;
import helper.Sortable;
import helper.Width;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

public abstract class JQueryFlexigrid {

	protected abstract <T> List<Map<String, Object>> getRowsJson(List<T> list);

	/**
	 * "rows": [{"cell":[2, 3, 4], "id": 1}, {"cell":[12, 13, 14]}] cells =>
	 * {"cell":[2, 3, 4], "id": 1}, {"cell":[12, 13, 14]}
	 * 
	 * @param <T>
	 * @param page
	 * @param total
	 * @param list
	 * @param grid
	 * @return
	 */
	public final static <T> String getGridJson(int page, int total, List<T> list, JQueryFlexigrid grid) {
		List<Map<String, Object>> rows = grid.getRowsJson(list);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("total", total);
		map.put("rows", rows);
		return JsonUtils.toJson(map);
	}

	/**
	 * JSON格式： {"page": ${page}, "total": ${total}, "rows": [${rows}]}
	 * 其中page和total是指当前页号和总条目数，rows的JSON格式为： "rows": [{"cell":[2, 3, 4]},
	 * {"cell":[12, 13, 14]}] 默认的一份获取GRID JSON字符串的方法，更复杂的需要自已定义JQueryFlexigrid子类
	 * 这个JSON串是用于ajax更新flexigrid的
	 * 
	 * @param <T>
	 * @param page
	 * @param total
	 * @param list
	 * @return String
	 */
	public final static <T> String getGridJson(List<T> list, int page, int total) {
		return getGridJson(page, total, list, new JQueryFlexigrid() {

			@SuppressWarnings("hiding")
			@Override
			protected <T> List<Map<String, Object>> getRowsJson(List<T> list) {
				List<Map<String, Object>> cells = new ArrayList<Map<String, Object>>();
				for (T item : list) {
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("cell", item);
					cells.add(map);
				}
				return cells;
			}

		});
	}

	/**
	 * @param <T>
	 * @param settings
	 * @param clazz
	 * @return
	 */
	public static <T> String getGridSettings(GridSettings settings, Class<?> clazz) {
		List<Map<String, Object>> models = new ArrayList<Map<String, Object>>();
		Map<String, Object> model;
		Field[] fields = clazz.getDeclaredFields();
		String name;
		for (int i = 0; i < fields.length; i++) {
			Field field = fields[i];
			name = field.getName();
			String displayName = upCaseFirstLetter(name);
			String textAlign = Align.Position.CENTER.toString().toLowerCase();
			int columnWidth = 120;

			model = new HashMap<String, Object>();

			FieldName fieldName = field.getAnnotation(FieldName.class);
			if (fieldName == null) {
				model.put("name", name);
			} else {
				model.put("name", fieldName.value());
			}

			Display display = field.getAnnotation(Display.class);
			if (display != null) {
				displayName = display.value();
			}
			model.put("display", displayName);

			Width width = field.getAnnotation(Width.class);
			if (width != null) {
				columnWidth = width.value();
			}
			model.put("width", columnWidth);

			Align align = field.getAnnotation(Align.class);
			if (align != null) {
				textAlign = align.value().toString().toLowerCase();
			}
			model.put("align", textAlign);

			boolean sortable = field.isAnnotationPresent(Sortable.class);
			model.put("sortable", sortable);
			boolean hide = field.isAnnotationPresent(Hide.class);
			model.put("hide", hide);

//			Currency currency = field.getAnnotation(Currency.class);
//			if (currency == null) {
//				model.put("currency", false);
//			} else {
//				model.put("currency", currency.value());
//			}

			DateTime datetime = field.getAnnotation(DateTime.class);
			if (datetime == null) {
				model.put("datetime", false);
			} else {
				model.put("datetime", datetime.value());
			}

			models.add(model);
		}
		settings.setColModel(models);
		return JsonUtils.toJson(settings);
	}

	/**
	 * 将字符串的首字母大写
	 * 
	 * @param source
	 * @return
	 */
	public static String upCaseFirstLetter(String source) {
		String pe, upcase = "";
		char ch[];
		StringTokenizer st = new StringTokenizer(source);
		while (st.hasMoreTokens()) {
			pe = st.nextToken();
			ch = pe.toCharArray();
			if (ch[0] >= 'a' && ch[0] < 'z') {
				ch[0] = (char) (ch[0] - 32);
			}
			String s = new String(ch);
			upcase = s + " ";
		}
		return upcase;
	}

}
