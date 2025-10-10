<template>
  <nav class="ls-navbar">
    <ul class="header-inner">
      <li class="logo">
        <router-link :to="{ name: 'landing-page' }">
          <img
            class="hidden-sm-and-down"
            src="@/assets/images/linshare-logo-white.svg"
            :alt="$t('HEADER.LOGO_ALT')"
          >
          <img
            class="hidden-md-and-up"
            src="@/assets/images/linshare-logo-icon.png"
            :alt="$t('HEADER.LOGO_ALT')"
          >
        </router-link>
      </li>
      <li class="header-title">
        <span>{{ $t('HEADER.UPLOAD_REQUEST') }}</span>
      </li>
    </ul>
    <div
      v-if="uploadRequest && uploadRequest.subject"
      class="header-subject"
    >
      {{ uploadRequest.subject }}
    </div>
    <div class="header-right-side-container">
      <div class="upload-bar-container">
        <slot />
      </div>
      <div class="header-right-side">
        <LanguageSelector />
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import LanguageSelector from './LanguageSelector';
export default {
  name: 'TheHeader',
  components: {
    LanguageSelector
  },
  computed: {
    ...mapGetters({
      uploadRequest: 'uploadRequest'
    }),
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';
  @import '@/assets/variables.scss';

  .ls-navbar {
    position: fixed;
    width: 100%;
    top: 0px;
    display: flex;
    justify-content: space-between;
    z-index: 3;
    align-items: center;
    min-height: 50px;
    height: 50px;
    background-color: $primary-color;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
    padding: 0px 7px;

    .header-inner {
      display: flex;
      align-items: center;
      list-style: none;
      min-width: 30%;
      margin-bottom: 0;
      padding-left: 12px;

      .logo {
        width: 115px;
        border-right: 1px solid #fff;
        margin-right: 10px;
        padding-right: 10px;

        @media #{map-get($display-breakpoints, 'sm-and-down')} {
          width: auto;

          a {
            display: flex;
            align-items: center;

            img {
              width: 10px;
            }
          }
        }

        img {
          width: 100%;
        }
      }

      .header-title {
        span {
          font-size: 14px;
          color: #fff;
          text-transform: uppercase;
        }
      }
    }
    .header-right-side-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 30%;
      .upload-bar-container {
        margin-right: 25px;
      }
      .header-right-side {
        padding-right: 10px;
      }
    }
    .header-subject {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 30%;
      color: #fff;
      text-transform: uppercase;
      font-size: 16px;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: none;
      }
    }
  }
</style>
