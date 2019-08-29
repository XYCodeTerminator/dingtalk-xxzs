<template>
  <div id="app">
    <keep-alive include="home">
       <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  mounted () {
    console.log(this.$route)
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
