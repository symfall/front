<template>
  <v-container>
    <v-row>

      <v-col
        cols="12"
        v-for="message in messages"
        :key="message.id"
      >
        <v-card>
          <v-list-item three-line>
            <v-list-item-avatar
              tile
              size="40"
              color="grey"
            ></v-list-item-avatar>
            <v-list-item-content>
              <div class="text-overline mb-4">
                nickname
              </div>
              <v-list-item-title>{{ message.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ message.body }}</v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>

        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="10"
      >
        <v-textarea
          name="input-7-4"
          rows="2"
        ></v-textarea>
      </v-col>
      <v-col
        cols="2"
      >
        <v-btn
          fab
          dark
          color="red lighten-2"
        >
          <v-icon dark>
            mdi-send
          </v-icon>
        </v-btn>
      </v-col>


    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    messages: [],
  }),
  async mounted() {
    try {
      const response = await fetch('https://localhost:8080/messages');
      this.messages = await response.json();
    } catch (e) {
      console.error(e);
    }

  }
}
</script>
