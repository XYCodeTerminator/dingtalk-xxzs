<template>
  <div class="home">
    <!-- <div class="header">
      <div class="title">
        收件箱
      </div>
    </div> -->
    <!-- <div @click="chooseTo">选择联系人</div> -->
    <div class="bottom">
      <a-icon @click="showDrawer" type="menu-unfold" style="color: #1FAFFF;font-size: 25px;" />
      <a-icon @click="newMsg" type="form" style="color: #1FAFFF;font-size: 25px;" />
    </div>

    <div class="content" v-if="!isInNewMsg">
      <div class="content-header">收件箱</div>
      <a-list
        class="msg-list"
        :loading="false"
        itemLayout="horizontal"
        :dataSource="msgList"
      >
        <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
          <a-spin v-if="loadingMore" />
          <a-button v-else @click="onLoadMore" size="small">加载更多</a-button>
        </div>
        <a-list-item slot="renderItem" slot-scope="msg, index">
          <a slot="actions">删除</a>
          <a-list-item-meta
            :description="msg.content.substring(0, 18)"
          >
            <div slot="title">{{msg.from}}</div>
            <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> -->
          </a-list-item-meta>
          <!-- <div>content</div> -->
        </a-list-item>
      </a-list>
    </div>

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
        <div class="list-item" v-for="(item, i) in listItems" :key="i" >
          <a-icon :type="item.icon" style="color: #1FAFFF;font-size: 18px;" />
          <div class="label">{{item.label}}</div>
        </div>
      </div>
    </a-drawer>

    <a-drawer
      ref="newMsg"
      height="100%"
      placement="bottom"
      :closable="false"
      @close="onClose"
      :visible="newMsgVisible"
    >
      <div class="new-msg">
        <div class="new-msg-nav">
          <a @click="cancelSend">取消</a>
          <div class="nav-title">发消息</div>
          <a @click="send" :disabled="true">发送</a>
        </div>
        <div class="to">
          <div class="to-name">收信人：</div>
          <input type="text" v-model="toUserName">
          <a-icon @click="chooseTo" type="user-add" style="color: #1FAFFF;font-size: 20px;" />
        </div>
        <div class="title">
          <div class="title-label">主&nbsp;&nbsp;&nbsp;题：</div>
          <input type="text" v-model="title">
        </div>
        <div class="new-msg-content">
          <textarea placeholder="请输入正文..." v-model="content" />
        </div>
        <!-- <div class="new-msg-buttons">
          <div class="upload-btn">
            <a-icon @click="uploadFile" type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
          </div>
        </div> -->
        <div class="upload-files">
          <a-upload 
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76" 
            :defaultFileList="defaultFileList">
            <div>
              <a-icon @click="uploadFile" type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
            </div>
          </a-upload>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { corpId, appId } from '@/config/dingtalk.config'
export default {
  name: 'home',
  data () {
    return {
      isInNewMsg: false,
      newMsgVisible: false,
      visible: false,
      spinning: false,
      userInfo: null,
      listItems: [
        { label: '收件箱', icon: 'inbox' },
        { label: '已发送', icon: 'check' },
        { label: '已删除', icon: 'delete' },
        { label: '草稿箱', icon: 'file' },
      ],
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      msgList: [
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' },
        { from: 'Sunrise', title: '消息助手测试', content: '消息助手测试消息助手测试消息助手测试' }
      ],
      toUserName: '',
      toUsers: [],
      title: '',
      content: '',
      defaultFileList: [{
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
      }, {
        uid: '2',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      }, {
        uid: '3',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      }, {
        uid: '4',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      }, {
        uid: '5',
        name: 'zzz.png',
        status: 'error',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
      }, {
        uid: '6',
        name: 'zzz.png',
        status: 'error',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
      }],
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.newMsgVisible = false
    },
    getUserInfo () {
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
        onFail: err => {
          alert(JSON.stringify(err))
        }
      })
    },
    fetchMsgList() {
      
    },
    onLoadMore () {

    },
    newMsg() {
      setTimeout(() => {
        this.isInNewMsg = true
      }, 500);
      this.newMsgVisible = true
    },
    cancelSend() {
      this.newMsgVisible = false
      this.isInNewMsg = false
      this.toUserName = ''
      this.toUsers = []
      this.title = ''
      this.content = ''
    },
    send() {

    },
    chooseTo () {
      this.$dd.ready(() => {
        this.$dd.biz.contact.complexPicker({
          title: "请选择收信人",      
          corpId,                   
          multiple: true,            
          limitTips: "最多可选100人",     
          maxUsers: 100,           
          pickedUsers: [],       
          pickedDepartments: [],       
          disabledUsers: [],          
          disabledDepartments: [],   
          requiredUsers: [],          
          requiredDepartments: [], 
          appId,     
          permissionType: "GLOBAL",  
          responseUserOnly: false,   
          // startWithDepartmentId: 0, 
          onSuccess: function(result) {
            alert(JSON.stringify(result))
            if (res.users) {
              let toUsers = res.users
              this.toUsers = toUsers
              let toUserName = ''
              toUserName = toUsers.map(user => user.name).join(',')
              this.toUserName = toUserName
            }
          },
          onFail : function(err) {
            alert(JSON.stringify(err))
          }
        });
      })
    },
    uploadFile() {

    }
  },
  components: {
  },
  beforeCreate() {
    this.from = this.$form.createForm(this)
  },
  mounted () {
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
            'biz.contact.choose' ]
        })
      }).catch(err => {
        alert('err')
      })
    this.$dd.error(function (err) {
      alert(JSON.stringify(err))
    })
  }
}
</script>

<style lang="less" scoped>
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
    z-index: 1000;
    background-color: #fff;
  }
  .content {
    // margin: 48px 0 0 0 ;
    padding: 44px 20px 58px 20px;
    .content-header {
      border-bottom: solid 1px #eee;
      font-size: 16px;
      line-height: 44px;
      font-weight: bold;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      height: 44px;
      padding: 0 20px;
      background-color: #fff;
      z-index: 1000;
    }
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

  .new-msg {
    overflow: hidden !important;
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    overflow: auto;
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;
    .new-msg-nav {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      // border-bottom: solid 1px #eee;
      padding: 10px 0;
      a {
        font-size: 15px;
      }
      .nav-title {
        font-size: 16px;
        font-weight: 400;
      }
    }
    .to {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 10px 5px;
      border-bottom: 1px solid #eee;
      input {
        flex: 1 1 auto;
        border: none;
        outline: none;
      }
    }
    .title {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 10px 5px;
      border-bottom: 1px solid #eee;
      input {
        flex: 1 1 auto;
        border: none;
        outline: none;
      }
    }
    .new-msg-content {
      flex: 1 1 auto;
      border-bottom: 1px solid #eee;
      padding: 10px 5px;
      textarea {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        resize: none;
        padding: 20px;
      }
    }
    .new-msg-buttons {
      border-bottom: 1px solid #eee;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 5px 10px;
    }
    .upload-files {
      flex: 1 1 auto;
      padding: 10px;
      max-height: 150px;
      // overflow: auto;
      // -webkit-overflow-scrolling: touch;
      position: relative;
      /deep/ .ant-upload-btn {
        height: 25px;
      }
      /deep/ .ant-upload-list {
        overflow: auto;
        -webkit-overflow-scrolling: auto;
        height: calc(100% - 25px);
        &::-webkit-scrollbar {
          display: none;
        }
      }
      /deep/ .ant-upload-list-item .anticon-close {
        font-size: 12px;
        opacity: 1;
      }
    }
  }
</style>
