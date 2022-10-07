<template>
  <div />
</template>

<script>
import Stomp from 'stompjs'
import { ActiveMQ } from '@/constants/active-mq'
import { getToken } from '@/utils/auth'
import { RabbitMQ } from '@/constants/rabbit-mq'

export default {
  name: 'StompMq',
  data() {
    return {
      momType: 0,
      client: null
    }
  },
  created() {
    this.RuYiAdmin.Get('NGAdminSystem/GetMomType', null).then(response => {
      this.momType = parseInt(response.object)
      this.client = this.momType === 0
        ? Stomp.client(ActiveMQ.ConnectionString)
        : Stomp.client(RabbitMQ.Service)
      console.log('client created')
      this.connect()
    })
  },
  mounted() {
  },
  methods: {
    onConnected: function(frame) {
      console.log('Connected: ' + frame)
      const topic = this.momType === 0
        ? '/topic/' + ActiveMQ.TopicName
        : '/exchange/' + RabbitMQ.ExchangeName + '/' + RabbitMQ.QueueName
      this.client.subscribe(topic, this.responseCallback, this.onFailed)
    },
    onFailed: function(frame) {
      console.log('Failed: ' + frame)
    },
    responseCallback: function(frame) {
      // console.log('responseCallback msg=>' + frame.body)
      // console.log('------')
      const user = JSON.parse(sessionStorage.getItem(getToken()))
      const message = JSON.parse(decodeURIComponent(frame.body))
      if (message.MessageType === this.MessageType.ForceLogout) {
        const id = message.Object.Id
        if (id === user.id) {
          this.$alert('您好，您被强制下线！', '系统强制下线通知', {
            confirmButtonText: '确定',
            showClose: false,
            callback: async action => {
              this.RuYiAdmin.Logout(getToken())
              await this.$store.dispatch('user/logout')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
          })
        }
      } else if (message.MessageType === this.MessageType.Notification) {
        const id = message.Object.Id
        if (id === user.id) {
          this.$notify({ title: '您有新的通知，请注意查收！', message: message.Object.Title, type: 'success', duration: 0 })
        }
      } else if (message.MessageType === this.MessageType.Announcement) {
        this.$notify({ title: '您有新的公告，请注意查收！', message: message.Object.Title, type: 'success', duration: 0 })
      } else if (message.MessageType === this.MessageType.Broadcast) {
        if (message.Object.MessageLevel === this.MessageLevel.Warning ||
          message.Object.MessageLevel === this.MessageLevel.Error ||
          message.Object.MessageLevel === this.MessageLevel.Severity ||
          message.Object.MessageLevel === this.MessageLevel.Emergency
        ) {
          if (user.isSupperAdmin === 1) {
            this.$notify({
              title: message.Object.Title,
              message: message.Object.Message,
              type: 'error',
              duration: 0 })
          }
        } else {
          this.$notify({
            title: message.Object.Title,
            message: message.Object.Message,
            type: 'success',
            duration: 0 })
        }
      }
    },
    connect: function() {
      const headers = {
        login: this.momType === 0 ? ActiveMQ.UserName : RabbitMQ.UserName,
        passcode: this.momType === 0 ? ActiveMQ.Password : RabbitMQ.Password
      }
      console.log('connecting')
      this.client.connect(headers, this.onConnected, this.onFailed)
    }
  }
}
</script>

<style scoped>

</style>
