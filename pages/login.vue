<template>
  <form>
    <v-text-field
      v-model="username"
      :rules="[rules.max]"
      label="Username"
      :counter="32"
      required
    />
    <v-text-field
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min, rules.max]"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
      hint="At least 8 characters"
      class="input-group--focused"
      @click:append="showPassword = !showPassword"
    />
    <v-checkbox
      v-model="checkbox"
      label="Remember me"
      @change="$v.checkbox.$touch()"
      @blur="$v.checkbox.$touch()"
    />

    <v-btn
      class="mr-4"
      @click="submit"
    >
      submit
    </v-btn>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'

export default {
  mixins: [validationMixin],
  layout: 'auth',

  validations: {
    checkbox: {
      checked (val) {
        return val
      }
    }
  },

  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
      min: value => value.length >= 8 || 'Min 8 characters',
      max: value => value.length <= 32 || 'Max 8 characters'
    },
    username: '',
    password: '',
    showPassword: false,
    checkbox: false
  }),
  mounted () {
    // console.log(this.$auth.local.token.get())
  },

  methods: {
    async submit () {
      await this.$auth.loginWith('local', {
        data: {
          username: this.username,
          password: this.password
        }
      })
      // const user = await this.$auth.fetchUser()
      // console.log(user)
      // this.$auth.loggedIn = true
    }
  }
}
</script>
