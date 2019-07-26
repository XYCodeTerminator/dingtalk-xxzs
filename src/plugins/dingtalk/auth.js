  export function jsApiOAuth(jsApiList) {
    return new Promise((resolve, reject) => {
      this.$http.get('/dingtalk/config')
      .then(res => {
        let data = res.data
        const config = {
          agentId: data.agentId || '',
          corpId: data.corpId || '',
          timeStamp: data.timeStamp || '',
          nonceStr: data.nonceStr || '',
          signature: data.signature || '',
          jsApiList: jsApiList || []
        }
        
        resolve(config)
      }).cath(err => reject(err))
    })
  }

