<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(chat, i) in chats"
          :key="i"
          :to="chat.id"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-apps</v-icon>
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
            >
              Add Chat
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Add or search chat
            </v-card-title>
            <v-autocomplete
              v-model="select"
              :loading="loading"
              :items="items"
              :search-input.sync="search"
              cache-items
              class="mx-4"
              flat
              hide-no-data
              hide-details
              label="Search chat"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="red"
                text
                @click="dialog = false; addChat()"
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
  data () {
    return {
      drawer: false,
      chats: [],
      miniVariant: false,
      title: 'Symfall',
      currentChat: null,
      dialog: false,
      select: false,
      loading: false,
      items: [],
      search: null,
      states: []
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
    async addChat () {
      const response = await this.$axios.$get('chat/', {
        params: {
          title: this.select
        }
      })
      let chat = response.results[0]
      chat.creator = chat.creator.id
      chat.invited.push(this.$auth.user.id)
      const addedChat = await this.$axios.$put(`chat/${chat.id}/`, chat)
      this.chats.push(addedChat)
    },
    async fetchChats () {
      const response = await this.$axios.$get('chat/', {
        params: {
          invited__in: this.$auth.user.id
        }
      })
      this.chats = response.results
    },
    async querySelections (value) {
      this.loading = true
      // Simulated ajax query
      const response = await this.$axios.$get('chat/', {
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
