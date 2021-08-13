<template>
  <v-container
    style="max-width: none;"
  >
    <v-row
      ref="chat"
      class="d-flex justify-center mb-6 chat"
    >
      <v-col
        v-for="(message, index) in messages"
        :key="message.id"
        cols="8"
      >
        <v-card
          elevation="0"
          class="mx-auto"
        >
          <v-list-item three-line>
            <v-list-item-avatar
              tile
              size="50"
              color="grey"
            />
            <v-list-item-content>
              <div class="text-overline mb-4 text--disabled">
                {{ message.created_at | formatDate }}
              </div>
              <v-list-item-title />
              <p>{{ message.message }}</p>
              <v-img
                v-for="file in message.file_set"
                :key="file.id"
                :src="file.document"
                max-width="200"
              />
            </v-list-item-content>
            <!--            <v-icon-->
            <!--              v-if="message.sender === 12"-->
            <!--              @click="editMessage(message.id, index)"-->
            <!--            >-->
            <!--              mdi-pencil-->
            <!--            </v-icon>-->

            <v-icon
              v-if="message.sender === $auth.user.id"
              @click="message.show = true"
            >
              mdi-delete
            </v-icon>

            <div class="text-center">
              <v-dialog
                v-model="message.show"
                max-width="290"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    Do you want to delete message?
                  </v-card-title>

                  <v-card-text>
                    It will permanently delete the message for you and other users.
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />

                    <v-btn
                      color="red darken-1"
                      text
                      @click="message.show = false; removeMessage(message.id, index)"
                    >
                      Yes
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-list-item>
          <v-card-actions />
        </v-card>
      </v-col>
    </v-row>

    <v-row
      class="d-flex justify-center mb-6"
      fixed
    >
      <v-col
        cols="6"
      >
        <v-textarea
          v-model="message"
          name="input-7-4"
          rows="3"
          label="Message"
          @keydown.prevent.enter="putMessage"
        />
      </v-col>
      <v-col
        cols="1"
      >
        <v-btn
          fab
          dark
          color="red lighten-2"
          @click="putMessage"
        >
          <v-icon>
            mdi-send
          </v-icon>
        </v-btn>
        <label for="file">
          <v-btn
            fab
            dark
            color="red lighten-2"
            @click="postFile"
          >
            <input
              id="file"
              ref="file"
              type="file"
              style="display:none"
              @change="handleFileUpload()"
            >
            <v-icon>
              mdi-file
            </v-icon>
          </v-btn>
        </label>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  asyncData ({ params }) {
    const currentChat = params.chat
    return { currentChat }
  },
  data: () => ({
    messages: [],
    message: '',
    currentChat: null,
    removeNotify: false
  }),
  async mounted () {
    await this.fetchMessages()
    this.scrollDown()
  },
  methods: {
    scrollDown () {
      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
    },
    async editMessage (messageId, index) {
      const response = await this.$axios.$put(`message/${messageId}/`, {
        sender: this.$auth.user,
        chat: this.currentChat,
        message: '!!!',
        status: 1
      })
      this.messages.splice(index, 1)
      this.messages.insert(index, response)
    },
    async removeMessage (messageId, index) {
      await this.$axios.$delete(`message/${messageId}/`, {
        params: {
          chat: this.currentChat
        }
      })
      this.messages.splice(index, 1)
      this.dialog = false
    },
    async fetchMessages () {
      const response = await this.$axios.$get('message/', {
        params: {
          chat: this.currentChat
        }
      })
      const messages = []
      response.results.forEach((message) => {
        message.sender = message.sender.id
        message.show = false
        messages.push(message)
      })
      this.messages = messages.reverse()
    },
    async putMessage () {
      if (this.message) {
        const addedMessage = await this.$axios.$post('message/', {
          sender: this.$auth.user.id,
          chat: this.currentChat,
          message: this.message
        })
        if (addedMessage !== undefined) {
          this.message = ''
          addedMessage.show = false
          this.messages.push(addedMessage)
          this.$nextTick(function () {
            this.scrollDown()
          })
        }
      }
    },
    /*
        Submits the file to the server
      */
    postFile () {
      /*
              Initialize the form data
          */
      let formData = new FormData();

      /*
          Add the form data we need to submit
      */
      formData.append('file', this.file);

      /*
        Make the request to the POST /single-file URL
      */
      axios.post( '/single-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function(){
        console.log('SUCCESS!!');
      })
        .catch(function(){
          console.log('FAILURE!!');
        });
    },

    /*
      Handles a change on the file upload
    */
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    }
  }
}
</script>

<style>
.chat {
  height: calc(100vh - 270px); overflow-y: scroll
}
.chat::-webkit-scrollbar {
  width: 5px;
}

.chat::-webkit-scrollbar-track {
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
}

.chat::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
</style>
