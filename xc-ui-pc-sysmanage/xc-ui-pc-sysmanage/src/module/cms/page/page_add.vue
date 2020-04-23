<template>
    <div>
      <!--model="pageForm"就是下面这个form表单绑定的数据对象-->
      <!--用rules绑定数据对象作为规则，数据绑定有冒号，ref后面跟的是一个校验，在下面提交方法的时候会用到-->
      <el-form   :model="pageForm" label-width="80px" :rules="pageFormRules" ref="pageForm">
        <el-form-item label="所属站点" prop="siteId">
          <el-select v-model="pageForm.siteId" placeholder="请选择站点">
            <el-option
              v-for="item in siteList"
              :key="item.siteId"
              :label="item.siteName"
              :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择模版" prop="templateId">
          <el-select v-model="pageForm.templateId" placeholder="请选择">
            <el-option
              v-for="item in templateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面名称" prop="pageName">
          <el-input v-model="pageForm.pageName" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="别名" prop="pageAliase">
          <el-input v-model="pageForm.pageAliase" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="pageWebPath">
          <el-input v-model="pageForm.pageWebPath" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="物理路径" prop="pagePhysicalPath">
          <el-input v-model="pageForm.pagePhysicalPath" auto-complete="off" ></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-radio-group v-model="pageForm.pageType">
            <el-radio class="radio" label="0">静态</el-radio>
            <el-radio class="radio" label="1">动态</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker type="datetime" placeholder="创建时间" v-model="pageForm.pageCreateTime"></el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit" >提交</el-button>
        <el-button type="primary" @click="go_back" >返回</el-button>
      </div>
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
        templateList:[],
        pageForm:{
          siteId:'',
          templateId:'',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter:'',
          pagePhysicalPath:'',
          pageType:'',
          pageCreateTime: new Date()
        },
        /*rules的数据对象*/
        pageFormRules: {
          siteId:[
            {required: true, message: '请选择站点', trigger: 'blur'}
          ],
          templateId:[
            {required: true, message: '请选择模版', trigger: 'blur'}
          ],
          pageName: [
            {required: true, message: '请输入页面名称', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径', trigger: 'blur'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'}
          ]
        }
        }
      },
      methods:{
        addSubmit:function () {
          /*在提交处进行表单校验，这是elementui提供的
          * 校验ref是这个pageForm的表单
          * */
          this.$refs['pageForm'].validate((valid) => {
            if (valid) {//表单校验成功
              //确认提示
              this.$confirm('您确认提交吗?', '提示', { }).then(() => {
                //调用page_add方法请求服务端的新增页面接口
                cmsApi.page_add(this.pageForm).then(res => {
                  //解析服务端相应内容，res.message是服务端返回的内容
                  //res.success代表返回的是一个josn数据，然后这个success对应的值
                  if (res.success) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    })
                    //将表单提交后，要将其清空，防止用户还想添加
                    //将表单清空，下面这个page定位到这个ref
                    this.$refs['pageForm'].resetFields();
                  }else if(res.message){
                    this.$message.error(res.message)
                }else {
                    /*下面这种写法其实和上面一样*/
                    this.$message.error("提交失败")
                  }
                });

              })

            }
          });
        },
        //返回，就是要更改当前路由
        go_back:function () {
          this.$router.push({
            path:'/cms/page/list',
            query:{
              page:this.$route.query.page,//取出路由的参数，之前在page_list是取的数据对象
              siteId:this.$route.query.siteId
            }
          })
        }

      },
      mounted() {
        //初始化站点列表
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
        //模板列表
        this.templateList = [
          {
            templateId:'5a962b52b00ffc514038faf7',
            templateName:'首页'
          },
          {
            templateId:'5a962bf8b00ffc514038fafa',
            templateName:'轮播图'
          }
        ]
      }
  }
</script>

<style scoped>

</style>
