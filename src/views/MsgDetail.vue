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
  methods: {
    fetchData() {
      return new Promise((resolve, reject) => {
        let {id, tag} = this.$route.params
        this.$http.get('/msg/detail', {
          params: { id, tag }
        }).then(res => {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }).catch(err => reject(err))
      })
    }
  },
  mounted() {
    this.fetchData().then(data => {
      alert(JSON.stringify(data))
    }).catch(err => {
      alert(JSON.stringify(err))
    })
  }
}
</script>