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
                :error-messages="errorMessage"
                autofocus
                tabindex="1"
                name="old-password"
                :label="$t('PASSWORD.PASSWORD_PROVIDED')"
                @click:append="showOldPassword = !showOldPassword"
                @change="errorMessage = ''"
                @click="errorMessage = ''"
              />
              <v-text-field
                v-model="newPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.valid]"
                :type="showPassword ? 'text' : 'password'"
                name="new-password"
                tabindex="2"
                :label="$t('PASSWORD.UPDATE_PASSWORD')"
                @click:append="showPassword = !showPassword"
              />
              <v-text-field
                v-model="confirmPassword"
                :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.valid, passwordConfirmationRule]"
                :type="showConfirm ? 'text' : 'password'"
                name="confirm-password"
                tabindex="3"
                :label="$t('PASSWORD.UPDATE_PASSWORD_CONFIRM')"
                @click:append="showConfirm = !showConfirm"
              />
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
import { PasswordStore } from '@/store';
import { isPasswordValid } from '@/common';
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
      rules: {
        required: value => !!value || this.$t('MESSAGE.REQUIRED'),
        valid: value => isPasswordValid(value)
          || this.$t('MESSAGE.VALIDATE_PASSWORD'),
      }
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () => (this.newPassword === this.confirmPassword) || this.$t('MESSAGE.PASSWORD_MUST_MATCH');
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

          PasswordStore.assign(requestId, this.newPassword);
          router.push({ name: 'home', params: { id: requestId }});
        }
      } catch (error) {
        this.errorMessage = this.$t('MESSAGE.INCORRECT_PASSWORD');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .update-password-page {
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

