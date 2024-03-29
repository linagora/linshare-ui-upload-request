<template>
  <div>
    <Header />
    <div class="update-password-page">
      <div class="update-password-page-first-background" />
      <div class="update-password-page-content">
        <v-card
          class="update-password-page__card-container"
          elevation="2"
        >
          <v-form
            ref="form"
            @submit="submitPassword"
          >
            <v-card-title>{{ $t("PASSWORD.CHANGE_PASSWORD_TITLE") }}</v-card-title>
            <v-card-subtitle>{{ $t("PASSWORD.CHANGE_PASSWORD_SUBTITLE") }}</v-card-subtitle>
            <div class="update-password-page__input-container">
              <v-text-field
                v-model="oldPassword"
                :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="showOldPassword ? 'text' : 'password'"
                :error="!!errorMessage"
                :error-messages="$t(errorMessage, errorCode)"
                autofocus
                tabindex="1"
                name="old-password"
                :label="$t('PASSWORD.PASSWORD_PROVIDED')"
                @click:append="showOldPassword = !showOldPassword"
                @change="errorMessage = '', errorCode = ''"
                @click="errorMessage = '', errorCode = ''"
              >
                <template #message="{ message }">
                  {{ $t(message) }}
                </template>
              </v-text-field>

              <v-text-field
                v-model="newPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.valid]"
                :type="showPassword ? 'text' : 'password'"
                name="new-password"
                tabindex="2"
                :label="$t('PASSWORD.UPDATE_PASSWORD')"
                @click:append="showPassword = !showPassword"
              >
                <template #message="{ message }">
                  {{ $t(message) }}
                </template>
              </v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, passwordConfirmationRule]"
                :type="showConfirm ? 'text' : 'password'"
                name="confirm-password"
                tabindex="3"
                :label="$t('PASSWORD.UPDATE_PASSWORD_CONFIRM')"
                @click:append="showConfirm = !showConfirm"
              >
                <template #message="{ message }">
                  {{ $t(message) }}
                </template>
              </v-text-field>
            </div>
            <v-card-actions class="update-password-page__action-container">
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
import { UploadRequestService } from '@/services';
import { isRequired, isPasswordValid } from '@/common';
import router from '@/router';
export default {
  name: 'Password',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showOldPassword: false,
      showConfirm: false,
      errorMessage: '',
      errorCode: '',
      rules: {
        required: value => isRequired(value) || 'MESSAGE.REQUIRED',
        valid: value => isPasswordValid(value) || 'MESSAGE.VALIDATE_PASSWORD',
      }
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () => (this.newPassword === this.confirmPassword) || 'MESSAGE.PASSWORD_MUST_MATCH';
    }
  },
  methods: {
    async submitPassword(e) {
      e.preventDefault();
      const requestId = this.$route.params.id;

      try {
        if (this.$refs.form.validate()) {
          await UploadRequestService.updatePassword(requestId, {
            newPassword: this.newPassword,
            oldPassword: this.oldPassword
          });

          this.$store.dispatch('setPassword', this.newPassword);
          router.push({ name: 'home', params: { id: requestId }});
        }
      } catch (error) {
        this.errorMessage = error.getMessage();
        this.errorCode = error.getErrorCode();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';
  @import '@/assets/variables.scss';

  .update-password-page {
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
      background-image: url("../../assets/images/banner_homepage_linshare.png");
      background-size: cover;
      background-color: $primary-color;
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
        height: 100%;
        width: 100%;
        background-image: url("../../assets/images/banner_homepage_linshare.png");
        background-size: cover;
        background-color: $primary-color;
        .update-password-page__card-container {
          margin: 20px;
        }
      }
    }
  }
</style>

