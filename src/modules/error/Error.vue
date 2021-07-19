<template>
  <div>
    <Header />
    <div class="error-page">
      <div>
        <h1 class="error-page__big-title">
          {{ statusCode }}
        </h1>
        <h3 class="error-page__sub-title">
          {{ message }}
        </h3>
      </div>
    </div>
    <Footer />
    <AppAlert />
  </div>
</template>

<script>
import { generateHttpErrorMessage, validHttpErrorStatusCode } from '@/common';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default {
  name: 'Error',
  components: {
    Header,
    Footer
  },
  computed: {
    statusCode() {
      return validHttpErrorStatusCode(Number(this.$route.params.status)) && Number(this.$route.params.status) || '';
    },
    message() {
      return generateHttpErrorMessage(this.statusCode);
    }
  }
};
</script>

<style lang="scss" scoped>
  .error-page {
    background-image: url('../../assets/images/bg-linshare-desktop.png');
    background-color: #05B1FF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 100%;
    height: calc(100vh - 55px);

    &__big-title {
      text-align: center;
      color: #fff;
      font-size: 65px;
    }

    &__sub-title {
      text-align: center;
      color: #fff;
      font-size: 30px;
    }
  }
</style>