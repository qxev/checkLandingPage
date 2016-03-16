package util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public final class SpringUtil {

    private static ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath*:spring/spring-main.xml");
    
    public static Object getBean(String beanName){
         return ctx.getBean(beanName);
    }    
}