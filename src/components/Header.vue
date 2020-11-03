<template>
  <nav class="ls-navbar">
    <ul class="header-inner">
      <li class="hidden-sm-and-down logo">
        <router-link :to="{ name: 'home' }">
          <img
            src="../assets/images/linshare-logo-white.png"
            :alt="$t('HEADER.LOGO_ALT')"
          >
        </router-link>
      </li>
      <li class="header-title">
        <span>{{ $t('HEADER.UPLOAD_REQUEST') }}</span>
      </li>
    </ul>
    <div class="header-right-side-container">
      <div class="upload-bar-container">
        <UploadBar />
      </div>
      <div class="header-right-side">
        <LanguageSelector />
      </div>
    </div>
  </nav>
</template>

<script>
import LanguageSelector from './LanguageSelector';
import UploadBar from './UploadBar';
export default {
  name: 'Header',
  components: {
    LanguageSelector,
    UploadBar
  }
};
</script>

<style lang="scss" scoped>
  .ls-navbar {
    display: flex;
    justify-content: space-between;
    z-index: 3;
    align-items: center;
    min-height: 50px;
    height: 50px;
    background-color: #06B1FF;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
    padding: 0px 7px;

    .header-inner {
      display: flex;
      align-items: center;
      list-style: none;
      margin-bottom: 0;

      .logo {
        width: 115px;
        border-right: 1px solid #fff;
        margin-right: 10px;
        padding-right: 10px;

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
      .upload-bar-container {
        margin-right: 20px;
      }
      .header-right-side {
        padding-right: 10px;
      }
    }
  }
</style>