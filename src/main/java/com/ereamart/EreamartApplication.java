package com.ereamart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


@SpringBootApplication
@RestController
public class EreamartApplication {

	public static void main(String[] args) {
		SpringApplication.run(EreamartApplication.class, args);
	
		System.out.println("********************************************************");
		System.out.println("********************************************************");
		System.out.println("************** Project start successfully **************"); 
		System.out.println("********************************************************");
		System.out.println("********************************************************");
	}

 
	
	// mapping for return index page
	@RequestMapping(value = {"/index","/index.html"}) 
	public ModelAndView uiIndexPage(){ 
		ModelAndView indexPage = new ModelAndView();
		indexPage.setViewName("index.html"); 
		return indexPage;
	} 
 
} 
 
  