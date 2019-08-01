<template>
  <div id="app">
    <keep-alive>
       <router-view />
    </keep-alive>
  </div>
</template>
<script>
import Home from '@/views/Home'
export default {
  components: {
    Home
  },
  beforeDestroy() {
    localStorage.clear()
  }
}
</script>
<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
