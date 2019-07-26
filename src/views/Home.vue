<template>
  <div class="home">
    <div class="bottom">
      <a-icon @click="showDrawer" type="menu-unfold" style="color: #1FAFFF;font-size: 25px;" />
      <a-icon type="edit" style="color: #1FAFFF;font-size: 25px;" />
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
      visible: false
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
      this.$dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: res => {
          alert('success')
          alert(res.code)
          console.log(res)
          this.$http.post('/users/login', {
            authCode: res.code
          })
          .then(userInfo => {
            alert(userInfo.userName)
          }).catch(err => {
            console.log(err)
          })
        },
        onFail : err => {
          alert('err')
          console.log(err, 'err')
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
</style>

