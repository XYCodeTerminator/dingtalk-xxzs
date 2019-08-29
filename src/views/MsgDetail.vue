<template>
  <div class="detail">
    <div class="title">{{msgDetail.title}}</div>
    <div class="info">
      <div class="info-item">
        <div class="item-label">发件人：</div>
        <div class="item-content">{{$route.params.tag === 1? getAuthName(msgDetail.from_name) : msgDetail.from_name}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">收件人：</div>
        <div class="item-content">{{$route.params.tag === 1? $route.params.userInfo.name : getAuthName(msgDetail.to_name)}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">时&nbsp;&nbsp;&nbsp;间：</div>
        <div class="item-content">{{msgDetail.time}}</div>
      </div>
    </div>
    <div class="content">{{msgDetail.content}}</div>
    <div class="file-list">
      <div class="list-header">附&nbsp;&nbsp;&nbsp;件：</div>
      <div class="list">
        <div class="list-item" v-for="(file, index) in msgDetail.Attachments" :key="index">
          <a-icon type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
          <div class="item-content">
            <a class="content-title" :href="file.file_url" :download="file.file_name">{{file.file_name}}</a>
            <div class="content-desc">{{bytesToSize(+file.file_size)}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="reply">
        <a-icon type="message" style="color: #1FAFFF;font-size: 18px;" />
        <div class="reply-label" @click="showReply">回复</div>
      </div>
    </div>

    <a-drawer
      ref="newMsg"
      height="100%"
      placement="bottom"
      :closable="false"
      @close="cancelReply"
      :visible="newMsgVisible"
    >
      <div class="new-msg">
        <div class="new-msg-nav">
          <a @click="cancelReply">取消</a>
          <div class="nav-title">发消息</div>
          <a @click="reply" :disabled="isSendBtnDisabled">回复</a>
        </div>
        <div class="to">
          <div class="to-name">收信人：</div>
          <input type="text" v-model="authName" :disabled="true" >
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
            action="/api/v2/file/upload"
            @change="handleChange"
            :fileList="fileList"
            :defaultFileList="fileList">
            <div>
              <a-icon type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
            </div>
          </a-upload>
        </div>
      </div>
    </a-drawer>

  </div>
</template>

<script>
import { bytesToSize } from '@/utils'
export default {
  name: 'msgDetail',
  data () {
    return {
      isSendBtnDisabled: false,
      userInfo: {},
      userDeptInfo: {},
      msgDetail: {},
      newMsgVisible: false,
      toUserName: '',
      toUserId: [],
      title: '',
      content: '',
      fileList: [],
      authName: ''
    }
  },
  methods: {
    getAuthName (name) {
      if (this.userDeptInfo && this.userDeptInfo.outerDept) {
        return this.userDeptInfo.name
      } else {
        return name
      }
    },
    bytesToSize,
    showReply () {
      this.newMsgVisible = true
    },
    cancelReply () {
      this.newMsgVisible = false
    },
    reply () {
      this.isSendBtnDisabled = true
      if (!this.title) {
        this.$message.error('主题不能为空')
      } else if (!this.content) {
        this.$message.error('正文不能为空')
      } else {
        this.$http.post('/app/api/v2/msg/send', {
          title: this.title,
          content: this.content,
          fileList: this.fileList,
          to_name: this.toUserName,
          to_id: this.toUserId,
          from_name: this.userInfo.name,
          from_id: this.userInfo.userid
        }).then(res => {
          if (res.data.msg == 'ok') {
            this.$message.success('回复成功')
            this.newMsgVisible = false
            this.isSendBtnDisabled = false
          } else {
            this.isSendBtnDisabled = false
            this.$message.error('回复失败')
          }
        }).catch(err => {
          this.isSendBtnDisabled = false
          alert(JSON.stringify(err))
        })
      }
    },
    handleChange (info) {
      // alert(JSON.stringify(info))
      // let file = info.file
      let fileList = [...info.fileList]
      // console.log(fileList)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data.url
        }
        return file
      })
      this.fileList = fileList
    },
    fetchData () {
      return new Promise((resolve, reject) => {
        let { id, tag } = this.$route.params
        this.$http.get('/app/api/v2/msg/detail', {
          params: { id, tag }
        }).then(res => {
          if (res.data.msg === 'ok') {
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        }).catch(err => reject(err))
      })
    }
  },
  mounted () {
    this.userInfo = this.$route.params.userInfo
    this.userDeptInfo = this.$route.params.userDeptInfo
    this.fetchData().then(data => {
      this.msgDetail = data
      this.title = `回复：${data.title}`
      this.toUserName = data.from_name
      this.authName = this.getAuthName(data.from_name)
      this.toUserId = data.from_id
    }).catch(err => {
      alert(JSON.stringify(err))
    })
  }
}
</script>

<style lang="less" scoped>
  .detail {
    padding: 10px;
  }
  .bottom {
    height: 40px;
    bottom: 0; left: 0; width: 100%;
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .reply {
      height: 100%;
      display: flex;
      width: 100%;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
      .reply-label {
        font-size: 15px;
        color: #1FAFFF;
        margin-left: 10px;
      }
    }
  }
  .title {
    padding: 20px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
  .info {
    border-bottom: solid #eee 1px;
    .info-item {
      padding: 10px 0;
      display: flex;
      flex-flow: row nowrap;
      .item-label {
        // width: 20%;
        // width: 15%;
        flex: 0 0 auto;
      }
      .item-content {
        flex: 1 1 auto;
      }
    }
  }
  .content {
    padding: 10px 30px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }
  .file-list {
    padding: 10px 0;
    .list-header {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .list {
      .list-item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 5px;
      }
      .item-content {
        margin-left: 10px;
        .content-title {
          font-size: 15px;
        }
        .content-desc{
          font-size: 13px;
          color: rgba(0, 0, 0, 0.45);
        }
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
