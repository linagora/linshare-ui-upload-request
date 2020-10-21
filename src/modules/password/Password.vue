<template>
  <div class="password-page">
    <div class="password-page-first-background" />
    <div class="password-page-content">
      <v-card
        class="password-page__card-container"
        elevation="2"
      >
        <v-form
          ref="form"
          @submit="submitPassword"
        >
          <v-card-title>{{ $t("PASSWORD.TITLE") }}</v-card-title>
          <v-card-subtitle>{{ $t("PASSWORD.SUBTITLE") }}</v-card-subtitle>
          <div class="password-page__input-container">
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="showPassword ? 'text' : 'password'"
              name="input-password"
              :label="$t('PASSWORD.ENTER_PASSWORD')"
              @click:append="showPassword = !showPassword"
            />
          </div>
          <v-card-actions class="password-page__action-container">
            <v-btn
              color="#1976D2"
              text
              type="submit"
            >
              {{ $t("PASSWORD.CONFIRM") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import { ErrorService } from '@/services';
import { PasswordStore } from '@/store';
import router from '@/router';
export default {
  name: 'Password',
  data() {
    return {
      password: '',
      showPassword: false,
      rules: {
        required: value => !!value || 'Required.'
      }
    };
  },
  methods: {
    async submitPassword(e) {
      e.preventDefault();
      const requestId = this.$route.params.id;

      if (this.$refs.form.validate()) {
        const result = await ErrorService.checkPasswordError(requestId, this.password);

        if (result) {
          PasswordStore.assign(requestId, this.password);
          router.push({ name: 'home', params: { id: requestId }});
        } else {
          this.$refs.form.reset();
          this.$alert.open(this.$t('MESSAGE.INCORRECT_PASSWORD'), {
            type: 'error'
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .password-page {
    position: relative;
    min-height: 100vh;
    background-color: #E5E5E5;
    &__card-container {
      padding: 10px;
      min-width: 600px;
    }
    &__input-container {
      padding: 20px;
    }
    &__action-container {
      display: flex;
      justify-content: flex-end;
    }
    &-first-background {
      background-image: url("../../assets/images/bandeau_accueil_linshare.svg");
      background-size: cover;
      width: 100%;
      height: 350px;
    }
    &-content {
      margin-top: -150px;
      margin-left: auto;
      margin-right: auto;
      width: 50%;
    }
  }
</style>

