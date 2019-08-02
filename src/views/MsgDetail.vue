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
        <div class="item-content">{{msgDetail.to_name}}</div>
      </div>
      <div class="info-item">
        <div class="item-label">时&nbsp;&nbsp;&nbsp;间：</div>
        <div class="item-content">{{msgDetail.time}}</div>
      </div>
    </div>
    <div class="content">{{msgDetail.content}}</div>
    <div class="file-list">
      <a-list 
        itemLayout="horizontal"
        :dataSource="msgDetail.fileList"
      >
        <a-list-item slot="renderItem" slot-scope="file">
          <a-list-item-meta :description="file.size">
            <a slot="title" :href="file.url">{{file.file_name}}</a>
            <a-icon slot="avatar" type="paper-clip" style="color: #1FAFFF;font-size: 22px;" />
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'msgDetail',
  data() {
    return {
      msgDetail: {
        title: `标题标题标题标题标题标题标题标题标标题标题标题题标题标题
          题标题标题题标题标题题标题标题题标题标题题标题标题题标题标题题标
          题标题标题题标题标题题标题标题题标题标题题标题标题题标题标题题标
        `,
        content: `内容内容内容内容内容内容内容内容内容内容内容内容内容内
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
          内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
        `,
        from_name: '张三',
        to_name: `李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,
          李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,李四,`,
        time: '2018 08-02 10:15',
        fileList: [
          { 
            file_name: 'aaa.png',
            file_url: 'http://upt5yj.natappfree.ccpublic/upload/5044c1819fdfe746283237be27989780.png',
            size: 23131323
          },
          { 
            file_name: 'aaa.png',
            file_url: 'http://upt5yj.natappfree.ccpublic/upload/5044c1819fdfe746283237be27989780.png',
            size: 23131323
          }
        ]
      }
    }
  },
  methods: {
    fetchData() {
      return new Promise((resolve, reject) => {
        let {id, tag} = this.$route.params
        this.$http.get('/msg/detail', {
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
  mounted() {
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
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }
</style>
