<template>
  <div class="home">
    <!-- <div class="header">
      <div class="title">
        收件箱
      </div>
    </div> -->
    <div class="bottom">
      <a-icon @click="showDrawer" type="menu-unfold" style="color: #1FAFFF;font-size: 25px;" />
      <a-icon @click="newMsg" type="form" style="color: #1FAFFF;font-size: 25px;" />
    </div>

    <div class="content" v-if="!isInNewMsg">
      <div class="content-header">
        <div class="content-header-title">{{msgBoxLabel}}</div>
        <a-icon @click="initMsgList" type="reload" style="color: #1FAFFF;font-size: 16px;" />
      </div>
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
        <a-list-item slot="renderItem" slot-scope="msg" @click="goMsgDetail(msg.id)">
          <a slot="actions" @click.stop="alert('删除')" style="color: red;">删除</a>
          <a-list-item-meta
            :description="msg.title.substring(0, 18)"
          >
            <div slot="title">{{msgBoxTag == 2 || msgBoxTag == 3 ? msg.to_name : msg.from_name}}</div>
            <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> -->
          </a-list-item-meta>
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
        <div class="list-item" :class="{ selected: item.label == msgBoxLabel }" @click="changeMsgBox(item)"  v-for="(item, i) in listItems" :key="i" >
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
          <a @click="send">发送</a>
        </div>
        <div class="to">
          <div class="to-name">收信人：</div>
          <input type="text" v-model="toUserName" :disabled="true" placeholder="请选择收信人" >
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
            :multiple="true"
            action="/files/upload"
            @change="handleChange"
            :fileList="fileList"
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
      isSendBtnDisabled: true,
      isInNewMsg: false,
      newMsgVisible: false,
      visible: false,
      spinning: false,
      userInfo: null,
      msgBoxLabel: '收件箱',
      msgBoxTag: 1,
      listItems: [
        { label: '收件箱', tag: 1, icon: 'inbox' },
        { label: '已发送', tag: 2, icon: 'check' },
        { label: '已删除', tag: 0, icon: 'delete' },
        { label: '草稿箱', tag: 3, icon: 'file' }
      ],
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      msgList: [],
      toUserName: '',
      toUserId: [],
      toUsers: [],
      title: '',
      content: '',
      fileList: [],
      defaultFileList: []
    }
  },
  methods: {
    handleChange (info) {
      let file = info.file
      let fileList = [...info.fileList]
      console.log(fileList)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data.url
        }
        return file
      })
      this.fileList = fileList
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.newMsgVisible = false
    },
    changeMsgBox (item) {
      this.msgBoxTag = item.tag
      this.msgBoxLabel = item.label
      this.msgList = []
      this.initMsgList()
    },
    getUserInfo () {
      // this.spinning = true
      // this.$dd.runtime.permission.requestAuthCode({
      //   corpId,
      //   onSuccess: res => {
      //     this.$http.post('/users/login', {
      //       authCode: res.code
      //     }).then(res => {
      //       this.spinning = false
      //       this.userInfo = res.data
      //       this.initMsgList()
      //     }).catch(err => {
      //       alert(JSON.stringify(err))
      //     })
      //   },
      //   onFail: err => {
      //     alert(JSON.stringify(err))
      //   }
      // })
      return new Promise((resolve, reject) => {
        this.$dd.ready(() => {
          this.$dd.runtime.permission.requestAuthCode({
            corpId,
            onSuccess: res => {
              this.$http.post('/users/login', {
                authCode: res.code
              }).then(res => {
                resolve(res.data)
              }).catch(err => {
                reject(err)
              })
            },
            onFail: err => {
              reject(err)
            }
          })
        })
      })

    },
    initMsgList () {
      // this.loadingMore = true
      let start = 0
      this.$http.get('/msg/list', {
        params: {
          tag: this.msgBoxTag,
          start,
          size: 5
        }
      }).then(res => {
        // alert(JSON.stringify(res.data))
        // this.loadingMore = false
        this.msgList = res.data.data
      }).catch(err => {
        // this.loadingMore = false
        alert(JSON.stringify(err))
      })
    },
    fetchMsg () {
      return new Promise((resolve, reject) => {
        let start = this.msgList.length || 0
        this.$http.get('/msg/list', {
          params: {
            tag: this.msgBoxTag,
            start,
            size: 5
          }
        }).then(res => {
          if (res.data.success) {
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    onLoadMore () {
      this.loadingMore = true
      this.fetchMsg().then(data => {
        // alert(JSON.stringify(data))
        this.msgList = this.msgList.concat(data)
        this.loadingMore = false
      }).catch(err => {
        this.loadingMore = false
        this.$message.error('加载数据失败')
      })
    },
    newMsg () {
      setTimeout(() => {
        this.isInNewMsg = true
      }, 500)
      this.newMsgVisible = true
    },
    cancelSend () {
      // this.newMsgVisible = false
      // this.isInNewMsg = false
      // this.toUserName = ''
      // this.toUsers = []
      // this.title = ''
      // this.content = ''
      this.clear()
    },
    clear () {
      this.newMsgVisible = false
      this.isInNewMsg = false
      this.title = ''
      this.content = ''
      this.toUserName = ''
      this.toUserId = ''
      this.toUsers = []
      this.fileList = []
    },
    goMsgDetail(id) {
      this.$router.push({ name: 'msgDetail', params: { id }})
    },
    send () {
      if (this.toUsers.length == 0) {
        this.$message.error('请选择收信人')
      } else if (!this.title) {
        this.$message.error('主题不能为空')
      } else if (!this.content) {
        this.$message.error('正文不能为空')
      } else {
        this.isSendBtnDisabled = false
        this.$http.post('/msg/send', {
          title: this.title,
          content: this.content,
          fileList: this.fileList,
          toUserName: this.toUserName,
          toUserId: this.toUserId,
          fromUserName: this.userInfo.userName,
          fromUserId: this.userInfo.userId
        })
          .then(res => {
          // alert(JSON.stringify(res))
            if (res.data.success) {
              this.$message.success('发送成功')
              this.newMsgVisible = true
              this.isInNewMsg = true
              this.clear()
            } else {
              this.$message.error('发送失败')
            }
          }).catch(err => {
            alert(JSON.stringify(err))
          })
      }
    },
    chooseTo () {
      this.$dd.ready(() => {
        this.$dd.biz.contact.complexPicker({
          title: '请选择收信人',
          corpId,
          multiple: true,
          limitTips: '最多可选100人',
          maxUsers: 100,
          pickedUsers: [],
          pickedDepartments: [],
          disabledUsers: [],
          disabledDepartments: [],
          requiredUsers: [],
          requiredDepartments: [],
          appId,
          permissionType: 'GLOBAL',
          responseUserOnly: false,
          // startWithDepartmentId: 0,
          onSuccess: result => {
            // alert(JSON.stringify(result))
            if (result.users) {
              let toUsers = result.users
              this.toUsers = toUsers
              this.toUserName = toUsers.map(user => user.name).join(',')
              this.toUserId = toUsers.map(user => user.emplId).join(',')
            }
          },
          onFail: function (err) {
            alert(JSON.stringify(err))
          }
        })
      })
    },
    uploadFile () {

    }
  },
  components: {
  },
  beforeCreate () {
    this.from = this.$form.createForm(this)
  },
  mounted () {
    // this.$dd.ready(() => {
    //   this.getUserInfo()
    // })
    this.spinning = true
    if (localStorage.getItem('userInfo')) {
      this.spinning = false
      return
    }
    this.getUserInfo().then(data => {
      this.spinning = false
      this.userInfo = data
      localStorage.setItem('userInfo', this.userInfo)
      this.initMsgList()
    }).catch(err => {
      this.spinning = false
      alert(JSON.stringify(err))
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
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
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
      &.selected {
        background-color: #eee;
      }
      .label {
        margin: 0 10px;
      }
    }
  }

  .new-msg {
    overflow: hidden;
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
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
      position: relative;
      /deep/ .ant-upload-btn {
        height: 25px;
      }
      /deep/ .ant-upload-list {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
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
