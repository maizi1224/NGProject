export default {
  data() {
    return {
      lastTime: null, //第一次点击
      currentTime: null, //当前点击时间
      quitTIme: 0,
      timeOut: 10 * 60 * 1000,//设置超时时间：10分钟
      clearTimer: 0
    }
  },
  methods: {
    doSomeThing() {
      this.currentTime = new Date().getTime() // 记录当前点击的时间
      if (this.currentTime - this.lastTime > this.timeOut) {
        window.clearInterval(this.quitTIme)
        this.$store.dispatch('lockScreen/setlock', true)
        this.clearTimer = setInterval(() => { //获取第一次时间，避免刚点击就又锁屏了
          this.lastTime = new Date().getTime()
          clearInterval(this.clearTimer)
        }, 200)
      } else {
        this.lastTime = new Date().getTime() //如果10分之内点击，则把最新时间记录覆盖掉之前存的最后一次点击时间
      }
    }
  },
  created() {
    this.lastTime = new Date().getTime() // 网页第一次打开时，记录当前时间
  },
  mounted() {
    this.quitTIme = window.setInterval(this.doSomeThing, 1000)
  }
}

