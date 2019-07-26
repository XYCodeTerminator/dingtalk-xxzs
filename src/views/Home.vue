<template>
  <div class="home">
    <div class="bottom">
      <a-icon @click="showDrawer" type="menu-unfold" style="color: #1FAFFF;font-size: 25px;" />
      <a-icon type="edit" style="color: #1FAFFF;font-size: 25px;" />
    </div>
    <div class="spin">
      <a-spin class="spin" :spinning="spinning" size="large" />
    </div>
    <a-drawer
      placement="left"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <div slot="title">aaaa</div>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
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
      spinning: false
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
  },
  components: {
  },
  mounted() {
    this.$dd.ready(() => {
      this.spinning = true
      this.$dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: res => {
          this.$http.post('/users/login', {
            authCode: res.code
          })
          .then(res => {
            this.spinning = false
          }).catch(err => {
            alert(JSON.stringify(err))
          })
        },
        onFail : err => {
          alert(JSON.stringify(err))
        }
  
    });
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
</style>

