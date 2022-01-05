package com.zhaxd.core.conf;

import com.zhaxd.common.toolkit.Constant;
import com.zhaxd.common.toolkit.RSACoder;
import com.zhaxd.core.model.KUser;
import com.zhaxd.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;

public class LoginInterceptor implements HandlerInterceptor{

	@Autowired
	private UserService userService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		Object attribute = request.getSession().getAttribute(Constant.SESSION_ID);
		String uri = request.getRequestURI();
		String token = request.getParameter("token");
		System.out.println("TOKEN:" + token);
		if(token == null || token.isEmpty()){
			token = request.getHeader("Authorization");
			System.out.println("Authorization:" + token);
		}
		if (token != null && !token.isEmpty()) {
			String userId;
			try {
				userId = tokenToMessageByPublicKey(token);
			} catch (Exception e) {
				System.out.println("TOKEN认证错误：" + e.getMessage());
				response.sendRedirect(request.getContextPath() + "/view/loginUI.shtml");
				return false;
			}
            System.out.println("TOKEN认证成功，用户ID为" + userId);
			KUser u = userService.getUser(Integer.valueOf(userId));
			request.getSession().setAttribute(Constant.SESSION_ID, u);
			attribute = u;
		}
		//登陆请求不能被拦截
		if(!uri.contains("view/loginUI.shtml") && !uri.contains("index/login.shtml")){
			//判断session中是否有值？
			if(attribute == null){
				response.sendRedirect(request.getContextPath() + "/view/loginUI.shtml");
				return false;
			}
		}
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {	
	}

	public String tokenToMessageByPublicKey(String token) throws Exception{
		if(RSACoder.keyMap == null) {
			RSACoder.keyMap = new HashMap<>(2);
			URL keyURL = RSACoder.class.getClassLoader().getResource("../keys/key.pub");
			if(keyURL != null){
				URI uri = new URI(keyURL.getPath());
				String publicKeyString = RSACoder.readFileContent(uri.getPath());
				System.out.println(publicKeyString);
				RSACoder.keyMap.put(RSACoder.PUBLIC_KEY, publicKeyString);
			}
			else{
				throw new Exception("TOKEN认证错误：未能加载到公钥文件");
			}
		}
		String temp= token.replace(" ", "+");
		temp= temp.substring(0,76)+"\r\n"+	temp.substring(76)+"\r\n";
		String publicKey=RSACoder.getPublicKey();
		byte[] data=RSACoder.decryptBASE64(temp);
		byte[] result=RSACoder.decryptByPublicKey(data, publicKey);//网站b公钥解密
		return new String(result);
	}
}