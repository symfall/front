<template>

</template>

<script>
export default {
  // eslint-disable-next-line require-await
  async asyncData ({ params }) {
    const currentChat = params.chat
    return { currentChat }
  },
  data: () => ({
    messages: []
  }),
  async mounted () {
    await this.fetchMessages()
  },
  methods: {
    async fetchMessages () {
      const response = await this.$axios.$get('message/', {
        params: {
          chat: this.currentChat
        }
      })
      this.messages = response.results
    }
  }
}
</script>
