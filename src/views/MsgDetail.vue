<template>
  <div class="detail">
    msgDetail:
    {{$route.params.id}}
  </div>
</template>

<script>
export default {
  name: 'msgDetail',
  data() {
    return {

    }
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>