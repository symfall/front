<template>
  <form>
    <v-text-field
      v-model="name"
      :error-messages="nameErrors"
      label="Name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    />
    <v-text-field
      v-model="password"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
      required
      hint="At least 8 characters"
      @click:append="showPassword = !showPassword"
    />
    <v-checkbox
      v-model="checkbox"
      :error-messages="checkboxErrors"
      label="Remember me"
      required
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
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  layout: 'auth',

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: {
      checked (val) {
        return val
      }
    }
  },

  data: () => ({
    user: {},
    rules: {
      required: value => !!value || 'Required.',
      min: value => value.length >= 8 || 'Min 8 characters',
      emailMatch: () => ('The email and password you entered don\'t match')
    },
    email: '',
    username: '',
    password: '',
    showPassword: false,
    checkbox: false
  }),

  computed: {
    checkboxErrors () {
      const errors = []
      if (!this.$v.checkbox.$dirty) { return errors }
      !this.$v.checkbox.checked && errors.push('You must agree to continue!')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) { return errors }
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) { return errors }
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    }
  },

  methods: {
    submit () {
      this.$v.$touch()
    },
    async login () {
      try {
        await this.$auth.loginWith('local', {
          data: this.user
        })
        this.$toasted.global.defaultSuccess({
          msg: 'Usuário autenticado com sucesso'
        })
      } catch (err) {
        this.$toasted.global.defaultError({
          msg: 'Usuário ou senha inválidos.'
        })
      }
    }
  }
}
</script>
