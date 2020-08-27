<template>
  <nav class="ls-navbar">
    <ul class="header-inner">
      <li class="logo">
        <router-link :to="{ name: 'home' }">
          <img
            src="../assets/images/linshare-logo-white.png"
            alt="Linshare Logo"
          >
        </router-link>
      </li>
      <li class="header-title">
        <span>Upload request</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style lang="scss" scoped>
  .ls-navbar {
    display: flex;
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
        img {
          width: 100%;
        }
      }
      .header-title {
        border-left: 1px solid #fff;
        margin-left: 10px;
        padding-left: 10px;
        span {
          font-size: 14px;
          color: #fff;
          text-transform: uppercase;
        }
      }
    }
  }
</style>