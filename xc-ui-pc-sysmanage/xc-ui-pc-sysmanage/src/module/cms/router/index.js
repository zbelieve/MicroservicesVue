import Home from '@/module/home/page/home.vue';
import page_list from '@/module/cms/page/page_list.vue';
import page_add from '@/module/cms/page/page_add.vue';
import page_edit from '@/module/cms/page/page_edit.vue';
export default [{
    path: '/',  //代表后面通过什么路径可以访问
    component: Home,   //代表上面导入的组件
    name: 'CMS',//菜单名
    hidden: false,
    // ,
    // redirect: '/home',
    children:[
      /*下面的hidden是来控制菜单列表显示与否的(导航栏)*/
      /*首先是浏览器输入地址，然后根据地址找到这儿的路由，之后根据这儿找到相应的page_list.vue
      * 然后根据里面的方法，找到api中的cms.js，然后根据配置，由node.js转发给服务端新的地址
      * */
      {path:'/cms/page/list',name:'页面列表',component: page_list,hidden:false},
      /*下面的component来源于导入的组件，是引入了写过的界面*/
      {path:'/cms/page/add',name:'新增页面',component: page_add,hidden:true},
      {path:'/cms/page/edit/:pageId',name:'修改页面',component: page_edit}
    ]
  }/*,
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  }*/
]

//建立路由首先要把新增页面给导入进来import进来
//然后在children下建立path
