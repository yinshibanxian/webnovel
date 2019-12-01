<template>
    <div class="container" v-loading="loading"  element-loading-text="爬取中，请稍候" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="form">
              <el-form-item label="景点名称" prop="name">
                <el-input v-model="formData.name" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="爬取页数" prop="pageNum"> 
                  <el-input v-model="formData.pageNum" type="number" size="mini"></el-input>
              </el-form-item>
               <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即爬取</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
              </el-form-item>
          </el-form>
          <a :href="href" class="download-btn" v-show="showDownloadBtn">下载爬取内容</a>
  </div>
</template>

<script type="text/babel">
// import { async } from 'q';
import axios from 'axios';
export default {
  data() {
    return {
        formData: {
            name: '',
            pageNum: ''
        },
        rules: {
            name: [
                {required: true, message: '请输入景点名称', trigger: 'blur'},
                {min: 1, max: 12, message: '长度在1到12个字符', trigger: 'blur'}
            ],
            pageNum: [
                {required: true, message: '请输入爬取页数', trigger: 'blur'},
                {min: 1, max: 20, message: '大小在1与12之间', trigger: 'blur'}
            ]
        },
        loading: false,
        showDownloadBtn: false,
        href: ''
    }
  },
  components: {

  },
  methods: {
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if(valid) {
                this.loading = true;
                this.href = `/download?file=${this.formData.name}`;
                try {
                axios.get('/trip',{
                  params: {
                    attraction: this.formData.name,
                    pageNum: this.formData.pageNum
                  }
                }).then(res => {
                  this.loading = false;
                  console.log(res.data);
                  if(res.data) {
                    this.$message.success('爬取成功!');
                    this.showDownloadBtn = true;
                  }else {
                    this.$message.error('爬取失败，请重试!');
                  }
                })}catch(err) {
                  if(err) {
                    this.loading = false;
                    this.$message.error('爬取失败，请重试!'+err);
                  }
                }
                
              }else {
                  this.$message.error('提交失败');
              }
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      download() {
        axios.get('/download').then(res=> {
          console.log(res);
        })
      }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  vertical-align: center;
  align-items: center;
}
.download-btn {
    margin-top: 300px;
    margin-left: -200px;
    display: block;
    width: 100px;
    height: 30px;
    background: #3f9eff;
    font-size: 8px;
    text-decoration:none;
    text-align: center;
    line-height: 28px;
    color:#ffffff;
}
</style>