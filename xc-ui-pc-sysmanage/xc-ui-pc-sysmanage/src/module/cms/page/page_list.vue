<template xmlns:router-link="http://www.w3.org/1999/html">
    <div>
      <el-button type="primary" size="small" v-on:click="query">查询</el-button>
      <!--<!‐‐查询表单,提交的表单信息存在params中‐‐>-->
      <el-form :model="params">
        <el-select v-model="params.siteId" placeholder="请选择站点">
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">                                             <!--label是呈现给用户的站点名称，实际查询拿的是对应的siteid-->
          </el-option>
        </el-select>
        页面别名：<el-input v-model="params.pageAliase"  style="width: 100px"></el-input>
        <el-button type="primary" size="small" v-on:click="query">查询</el-button>
        <!--下面是vue自带的链接标签，里面写的是路由地址,这个路由暂时没有，就建一个，在index.js中-->
        <!--转入另一个页面的时候携带参数，就是query后面的值-->
        <router-link :to="{path:'/cms/page/add',query:{
          page:this.params.page,
          siteId:this.params.siteId
        }}">
          <el-button type="primary" size="small">新增页面</el-button>
        </router-link>
      </el-form>

      <el-table
        :data="list"
        style="width: 100%"><!--list是下面data列表数据，他是服务端返回的list数据,index是序列1，2，3-->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="pageName" label="页面名称" width="120"><!--pageName是服务端传过来的列表属性-->
        </el-table-column>
        <el-table-column prop="pageAliase" label="别名" width="120">
        </el-table-column>
        <el-table-column prop="pageType" label="页面类型" width="150">
        </el-table-column>
        <el-table-column prop="pageWebPath" label="访问路径" width="250">
        </el-table-column>
        <el-table-column prop="pagePhysicalPath" label="物理路径" width="250">  </el-table-column>
        <el-table-column prop="pageCreateTime" label="创建时间" width="180" >  </el-table-column>

        <el-table-column label="操作" width="80">
          <!--//定义了一列，就是以插槽的方式拿到数据，"page"就是变量名，然后下面row就是拿到一行的数据，然后
          这儿主要拿到了pageId，后面在方法中进行了处理-->
          <template slot-scope="page">
            <el-button
              size="small"type="text"
              @click="edit(page.row.pageId)">编辑
            </el-button>
            <el-button
              size="small"type="text"
              @click="del(page.row.pageId)">删除
            </el-button>
            <el-button @click="preview(page.row.pageId)" type="text" size="small">页面预览</el-button>
            <el-button @click="postPage(page.row.pageId)" size="small" type="primary" plain="">页面发布</el-button>
          </template>
        </el-table-column>
        </el-table>
      <!--、定义分页视图，使用v-on监听更改分页事件-->
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        style="float:right"
        :page-size="params.size"
        :current-page="params.page"
        @current-change="changePage"
        >
      </el-pagination>
    </div>
</template>

<script>
  /*编写页面静态部分，即model及vm部分
  * 这个数据对象通过上面绑定，在dom元素渲染后，呈现页面
  * */
  import * as cmsApi from '../api/cms'
  export default {
    data() {
      return {
        siteList:[],
        list: [],
        total:50,
        params:{
          page:1,
          size:10,
          siteId:'',
          pageAliase:''
        },
        }
      },
      methods:{
        query:function () {
           // alert('查询')
          //调用服务端接口,then前面是向服务端发起调用的（服务端返回的结果传到then中），后面是发起调用后返回方法，就是前面请求，请求后服务端返回的json数据返回处理
          //当前页和一页多少数据
          //把params表单中提交的信息拿出来查询
          cmsApi.page_list(this.params.page,this.params.size,this.params).then((res)=>{
                //将res赋值给数据模型对象，res就是服务端返回的responsebody,queryResult.list这都是res里面的
                this.list = res.queryResult.list;
                this.total = res.queryResult.total;
          })
        },
        //分页
        changePage:function (page) {
           this.params.page = page;
           this.query()
        },
        //上面拿到了pageId传给这儿
        edit:function(pageId){
          //打开修改页面，这样就要改变路由了，注意路由是router里面的不是api里面的。
          this.$router.push({
            path:'/cms/page/edit/'+pageId
          })
        },
        //上面那个操作主要是跳转到操作页面，然后具体在操作页面中调用的api接口
        //下面这个操作主要是在这儿直接进行操作，所以直接调用api接口就可以了
        // del:function (pageId) {
        //   this.$confirm('您确认删除吗?', '提示', { }).then(() => {
        //     //调用服务端接口
        //     cmsApi.page_del(pageId).then(res=>{
        //       if(res.success){
        //         this.$message.success('删除成功')
        //         //重新调用查询方法就可以重新查询
        //         this.query()
        //       }else{
        //         this.$message.error('删除失败')
        //       }
        //     })
        //   })
        //
        // },
        del:function (pageId) {

          this.$confirm('您确认删除吗?', '提示', { }).then(() => {
            //调用服务端接口
            cmsApi.page_del(pageId).then((res)=>{
              if(res.success){
                this.$message.success("删除成功")
                //刷新页面
                this.query()
              }else{
                this.$message.error("删除失败")
              }
            })
          })

        },
        preview:function (pageId) {
          //打开浏览器窗口,这儿使用nginx反向代理的
          window.open("http://www.xuecheng.com/cms/preview/"+pageId)
        },
        postPage:function (pageId){
          this.$confirm('确认发布该页面吗?', '提示', {}).then(() => {
            cmsApi.page_postPage(pageId).then((res) =>{
              if(res.success){
                console.log('发布页面id='+pageId);
                this.$message.success('发布成功，请稍后查看结果');
              }else{
                this.$message.error('发布失败');
              }
            })
          }).catch(() => {
          });
        }
      },


      //这个钩子方法是vue实例创建完成，但是还没有渲染数据时执行
      created(){
        /*从路由上取的值一般为字符串，将其取出后转换成int，为了防止路由上没有值，所以做一个或的判断
        * 如果前面不为空，直接不会取到后面的1，如果为空就会取到后面的1
        * $route.query.page取当前的路由的值
        * */
        this.params.page = Number.parseInt(this.$route.query.page||1);//将当前的路由上的这个参数在渲染数据之前，加载到这个参数上
        this.params.siteId = this.$route.query.siteId||'';
      },
      //这个钩子方法是渲染完成后，就是页面加载完成后
      mounted() {
        //默认查询页面，钩子方法，页面一出现就执行
        this.query()
        //初始化站点列表,这是一个钩子方法，初始化了部分数据对象的值
        this.siteList = [
          {
            siteId:'5a751fab6abb5044e0d19ea1',
            siteName:'门户主站'
          },
          {
            siteId:'102',
            siteName:'测试站'
          }
        ]
      }
  }
</script>

<style scoped>

</style>
