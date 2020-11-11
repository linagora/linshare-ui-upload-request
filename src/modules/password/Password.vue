<template>
  <div>
    <Header />
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
            <div class="password-page__input-container">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="showPassword ? 'text' : 'password'"
                :error="!!errorMessage"
                :error-messages="errorMessage"
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
    <Footer />
    <AppAlert />
  </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ErrorService } from '@/services';
import { PasswordStore } from '@/store';
import router from '@/router';
export default {
  name: 'Password',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      password: '',
      errorMessage: '',
      showPassword: false,
      rules: {
        required: value => !!value || this.$t('MESSAGE.REQUIRED')
      }
    };
  },
  methods: {
    async submitPassword(e) {
      e.preventDefault();
      const requestId = this.$route.params.id;

      if (this.$refs.form.validate()) {
        const errorAuthenticated = await ErrorService.checkPasswordError(requestId, this.password);

        if (!errorAuthenticated) {
          PasswordStore.assign(requestId, this.password);
          router.push({ name: 'home', params: { id: requestId }});
        } else {
          this.errorMessage = this.$t('MESSAGE.INCORRECT_PASSWORD');
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

