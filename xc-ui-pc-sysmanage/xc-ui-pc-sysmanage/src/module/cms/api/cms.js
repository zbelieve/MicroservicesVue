import http from './../../../base/api/public'//public是对axios的工具类封装，定义了http请求方法
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

//页面查询
export const page_list = (page,size,params) =>{
  //将params对象数据拼装成key/value串，传过来的parms是json格式的数据,就是拼接成？=那种格式
  let queryString = querystring.stringify(params);
 //请求服务端的页面查询接口所有以api和cms开头的都会转换成index里面对应的url，由中间件进行转换，其在config下的index.js来配置
  //请求以后，由中间服务器将其转成tomcat服务器的请求码，然后返回数据后直接接受，之后跳转页面啥的是前端来完成的
  return http.requestQuickGet(apiUrl+'/cms/page/list/'+page+'/'+size+'?'+queryString);
}

//新增页面
export const  page_add=params=>{
  return http.requestPost(apiUrl+'/cms/page/add',params)
}


//根据id查询页面
export const page_get = id =>{
  return http.requestQuickGet(apiUrl+'/cms/page/get/'+id)
}
//修改页面提交
export const page_edit = (id,params) =>{
  return http.requestPut(apiUrl+'/cms/page/edit/'+id,params)
}

//删除页面
// export const page_del = (id) =>{
//   return http.requestDelete(apiUrl+'/cms/page/del/'+id);
// }
export const page_del= id =>{
  return http.requestDelete(apiUrl+'/cms/page/del/'+id)
}

/*发布页面
* */
export const page_postPage=id=>{
  return http.requestPost(apiUrl+'/cms/page/postPage/'+id);
}



