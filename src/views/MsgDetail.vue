<template>
  <div class="detail">
    <div class="title">{{msgDetail.title}}</div>
    <div class="info">
      <div class="info-item">
        <div class="item-label">发件人：</div>
        <div class="item-content">{{msgDetail.from_name}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">收件人：</div>
        <div class="item-content">{{$route.params.tag === 1? $route.params.userInfo.userName : msgDetail.to_name}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">时&nbsp;&nbsp;&nbsp;间：</div>
        <div class="item-content">{{msgDetail.time}}</div>
      </div>
    </div>
    <div class="content">{{msgDetail.content}}</div>
    <div class="file-list">
      <!-- <a-list
        header="附件"
        size="small"
        itemLayout="horizontal"
        :dataSource="msgDetail.fileList"
      >
        <a-list-item slot="renderItem" slot-scope="file">
          <a-list-item-meta :description="bytesToSize(file.size)">
            <a slot="title" :href="file.url" :download="file.file_name">{{file.file_name}}</a>
            <a-icon slot="avatar" type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
          </a-list-item-meta>
        </a-list-item>
      </a-list> -->
      <div class="list-header">附&nbsp;&nbsp;&nbsp;件：</div>
      <div class="list">
        <div class="list-item" v-for="(file, index) in msgDetail.fileList" :key="index">
          <a-icon type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
          <div class="item-content">
            <a class="content-title" :href="file.file_url" :download="file.file_name">{{file.file_name}}</a>
            <div class="content-desc">{{bytesToSize(+file.file_size)}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { bytesToSize } from '@/utils'
export default {
  name: 'msgDetail',
  data () {
    return {
      msgDetail: {}
    }
  },
  methods: {
    bytesToSize,
    fetchData () {
      return new Promise((resolve, reject) => {
        let { id, tag } = this.$route.params
        this.$http.get('/test/msg/detail', {
          params: { id, tag }
        }).then(res => {
          if (res.data.success) {
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        }).catch(err => reject(err))
      })
    }
  },
  mounted () {
    this.fetchData().then(data => {
      this.msgDetail = data
      // alert(JSON.stringify(data))
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
</style>
