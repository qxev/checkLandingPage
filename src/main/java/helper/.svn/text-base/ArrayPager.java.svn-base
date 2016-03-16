package helper;

import java.util.ArrayList;
import java.util.List;

public abstract class ArrayPager {

	public static <T> List<T> fetch(List<T> list, int page, int perPage) {
		int fromIndex, toIndex;
		int total = list.size();

		fromIndex = (page - 1) * perPage;
		toIndex = page * perPage;
		toIndex = total > toIndex ? toIndex : total;
		if (fromIndex <= toIndex) {
			return list.subList(fromIndex, toIndex);
		} else {
			return new ArrayList<T>();
		}
	}

}
