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
          :to="chat.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ chat.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title v-text="chat.title" />
          </v-list-item-content>

        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      chats: [
        {
          icon: 'mdi-apps',
          title: 'Somechat',
          to: '/ead'
        },
        {
          icon: 'mdi-apps',
          title: 'Chats',
          to: '/ad'
        },
        {
          icon: 'mdi-apps',
          title: 'Dvij',
          to: '/adg'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Symfall'
    }
  }
}
</script>
