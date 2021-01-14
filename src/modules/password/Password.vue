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
                :error-messages="$t(errorMessage)"
                autofocus
                name="input-password"
                :label="$t('PASSWORD.ENTER_PASSWORD')"
                @click:append="showPassword = !showPassword"
                @change="errorMessage = ''"
                @click="errorMessage = ''"
              >
                <template #message="{ message }">
                  {{ $t(message) }}
                </template>
              </v-text-field>
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
import { isRequired } from '@/common';
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
        required: value => isRequired(value) || 'MESSAGE.REQUIRED'
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
          this.$store.dispatch('setPassword', this.password);
          router.push({ name: 'home', params: { id: requestId }});
        } else {
          this.errorMessage = 'MESSAGE.INCORRECT_PASSWORD';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';

  .password-page {
    position: relative;
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      min-height: 100vh;
    }
    background-color: #E5E5E5;
    &__card-container {
      padding: 10px;
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
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        display: none;
      }
    }
    &-content {
      margin-top: -150px;
      margin-left: auto;
      margin-right: auto;
      @media #{map-get($display-breakpoints, 'md-and-up')} {
        width: 35%;
      }
      @media #{map-get($display-breakpoints, 'md-and-down')} {
        width: 60%;
      }
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        margin-top: 0px;
        margin-left: 0px;
        margin-right: 0px;
        padding-top: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
        background-image: url("../../assets/images/bandeau_accueil_linshare.svg");
        background-size: cover;
        .password-page__card-container {
          margin: 20px;
        }
      }
    }
  }
</style>

