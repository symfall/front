<template>
  <v-app light>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container
        fill-height
        class="d-flex align-center"
      >
        <v-row
          class="d-flex justify-center"
        >
          <v-col cols="6">
            <Nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    title: 'Symfall'
  })
}
</script>
