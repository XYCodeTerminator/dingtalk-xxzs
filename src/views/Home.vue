<template>
  <div class="home">
    <!-- <div class="header">
      <div class="title">
        收件箱
      </div>
    </div> -->
    <div @click="chooseTo">选择联系人</div>
    <div class="bottom">
      <a-icon @click="showDrawer" type="menu-unfold" style="color: #1FAFFF;font-size: 25px;" />
      <a-icon type="form" style="color: #1FAFFF;font-size: 25px;" />
    </div>
    <div class="content">aaa</div>
    <div class="spin">
      <a-spin class="spin" :spinning="spinning" tip="登录中..." size="large" />
    </div>
    <a-drawer
      placement="left"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <div slot="title" class="user">
        <img class="user-avatar" :src="userInfo && userInfo.avatar" alt="👮‍">
        <div class="user-name">{{userInfo && userInfo.userName}}</div>
      </div>
      <div class="list">
        <div class="list-item">
          <a-icon type="inbox" style="color: #1FAFFF;font-size: 18px;" />
          <div class="label">收件箱</div>
        </div>
        <div class="list-item">
          <a-icon type="check" style="color: #1FAFFF;font-size: 18px;" />
          <div class="label">已发送</div>
        </div>
        <div class="list-item">
          <a-icon type="delete" style="color: #1FAFFF;font-size: 18px;" />
          <div class="label">已删除</div>
        </div>
        <div class="list-item">
          <a-icon type="file" style="color: #1FAFFF;font-size: 18px;" />
          <div class="label">草稿箱</div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { corpId } from '@/config/dingtalk.config'
export default {
  name: 'home',
  data() {
    return {
      visible: false,
      spinning: false,
      userInfo: null
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    getUserInfo() {
      this.spinning = true
      this.$dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: res => {
          this.$http.post('/users/login', {
            authCode: res.code
          })
          .then(res => {
            this.spinning = false
            this.userInfo = res.data
          }).catch(err => {
            alert(JSON.stringify(err))
          })
        },
        onFail : err => {
          alert(JSON.stringify(err))
        }
      });
    },
    // pullToRefresh() {
    //   this.$dd.ui.pullToRefresh.enable({
    //     onSuccess: () => {
    //       alert('下拉刷新')
    //     },
    //     onFail: (err) => {
    //       alert(JSON.stringify(err))
    //       this.$dd.ui.pullToRefresh.stop()
    //     }
    //   })
    // }
    chooseTo() {
      this.$dd.ready(() => {
        this.$dd.biz.contact.complexPicker({
          title:"测试标题",            //标题
          corpId,              //企业的corpId
          multiple:true,            //是否多选
          limitTips:"超出了",          //超过限定人数返回提示
          maxUsers:1000,            //最大可选人数
          pickedUsers:[],            //已选用户
          pickedDepartments:[],          //已选部门
          disabledUsers:[],            //不可选用户
          disabledDepartments:[],        //不可选部门
          requiredUsers:[],            //必选用户（不可取消选中状态）
          requiredDepartments:[],        //必选部门（不可取消选中状态）
          appId: 278037178,              //微应用的Id
          permissionType:"GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
          responseUserOnly:false,        //返回人，或者返回人和部门
          startWithDepartmentId:0 ,   //仅支持0和-1
          onSuccess: function(result) {
            alert(JSON.stringify(result))
              /**
              {
                  selectedCount:1,                              //选择人数
                  users:[{"name":"","avatar":"","userid":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
                  departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
              }
              */
          },
          onFail : function(err) {
            alert(JSON.stringify(err))
          }
        });
      })
    }
  },
  components: {
  },
  mounted() {
    this.$dd.ready(() => {
      this.getUserInfo()
      // this.$dd.runtime.info({
      //   onSuccess: function(info) {
      //     alert('runtime info: ' + JSON.stringify(info));
      //   },
      //   onFail: function(err) {
      //     alert('fail: ' + JSON.stringify(err));
      //   }
      // })
      // this.pullToRefresh()
    })
    this.$http.get('/dingtalk/js_api_config?url=' + window.location.href)
      .then(res => {
        let config = res.data
        this.$dd.config({
          ...config,
          jsApiList: [
            'runtime.info',
            'biz.contact.complexPicker',
            'biz.contact.choose'          ]
        })
      }).catch(err => {
        alert('err')
      })
    this.$dd.error(function(err) {
      alert(JSON.stringify(err))
    })
  }
}
</script>

<style lang="less" scoped>
  // .header {
  //   position: fixed;
  //   height: 44px;
  //   width: 100%;
  //   top: 0;
  //   left: 0;
  //   border-bottom: solid 1px #eee;
  //   display: flex;
  //   flex-flow: row nowrap;
  //   align-items: center;
  //   justify-content: center;
  //   font-size: 16px;
  //   font-weight: bold;
  // }
  .bottom {
    position: fixed;
    height: 48px;
    width: 100%;
    left: 0;
    bottom: 0;
    border-top: solid 1px #eee;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  .content {
    // margin: 48px 0 0 0 ;

  }
  .spin {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100px;
    height: 100px;
    text-align: center;
    margin: auto;
  }
  .user {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .user-name {
      margin: 0 10px;
    }
  }
  .list {
    .list-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 30px;
      padding: 20px 0;
      border-bottom: solid 1px #eee;
      .label {
        margin: 0 10px;
      }
    }
  }
</style>

