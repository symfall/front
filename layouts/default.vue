<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
    >
      <v-list>
        <v-autocomplete
          v-model="select"
          :loading="loading"
          :items="items"
          :search-input.sync="search"
          cache-items
          class="ma-6"
          flat
          hide-no-data
          hide-details
          label="Search chat"
          :append-outer-icon="select ? 'mdi-plus' : ''"
          @click:append-outer="chatTitle"
        />
        <v-list-item
          v-for="(chat, index) in chats"
          :key="index"
          :to="chat.id"
          router
          exact
        >
          <v-list-item-action
            @click="removeChat(chat.id, index)"
          >
            <v-icon
              v-if="chat.creator.id === $auth.user.id"
              @click="removeChat(chat.id, index)"
            >
              mdi-minus-circle
            </v-icon>
            <v-icon
              v-else
              @click="exitChat(chat.id, index)"
            >
              mdi-arrow-left
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="chat.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
            >
              Add Chat
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Create new chat
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="chatTitle"
                class="ma-8 mx-4 "
                flat
                label="Create chat"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="createChat"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <template #append>
        <div class="pa-2">
          <v-btn block @click="logout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main
      class="d-flex align-content-end flex-wrap"
    >
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  asyncData ({ params }) {
    const currentChat = params.chat
    return { currentChat }
  },
  data () {
    return {
      drawer: false,
      chats: [],
      miniVariant: false,
      title: 'Symfall',
      currentChat: null,
      dialog: false,
      chatTitle: '',
      select: false,
      loading: false,
      items: [],
      search: null,
      states: [],
    }
  },
  watch: {
    search (value) {
      value && value !== this.select && this.querySelections(value)
    }
  },
  async mounted () {
    await this.fetchChats()
  },
  methods: {
    async logout () {
      await this.$auth.logout()
    },
    async removeChat (chatId, index) {
      await this.$axios.$delete(`chat/${chatId}/`)
      this.chats.splice(index, 1)
      if (chatId === this.currentChat) {
        await this.$router.push('Home')
      }
    },
    async createChat () {
      const addedChat = await this.$axios.$post('chat/', {
        title: this.chatTitle,
        creator: this.$auth.user.id
      })
      this.chats.unshift(addedChat)
      this.dialog = false
    },
    async addChat () {
      const response = await this.$axios.$get('chat/', {
        params: {
          title: this.select
        }
      })
      const chat = response.results[0]
      chat.creator = chat.creator.id
      chat.invited.push(this.$auth.user.id)
      const addedChat = await this.$axios.$put(`chat/${chat.id}/`, chat)
      this.chats.unshift(addedChat)
      this.select = ''
      this.items = []
    },
    async fetchChats () {
      const response = await this.$axios.$get('chat/', {
        params: {
          invited__in__or: this.$auth.user.id,
          creator__or: this.$auth.user.id
        }
      })
      this.chats = response.results
    },
    async querySelections (value) {
      this.loading = true
      // Simulated ajax query
      const response = await this.$axios.$get('chat/search/', {
        params: {
          search: value
        }
      })
      let items = []
      response.results.forEach((chat) => {
        items.push(chat.title)
      })
      this.items = items
      this.loading = false
    }
  }
}
</script>

<style>
html { overflow-y: auto !important; }
</style>
