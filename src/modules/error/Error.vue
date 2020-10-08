<template>
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
</template>

<script>
import { generateHttpErrorMessage, validHttpErrorStatusCode } from '@/common';

export default {
  name: 'Error',
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
    height: 100%;
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