<template>
  <div>
    <theHeader />
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
    <theFooter />
    <AppAlert />
  </div>
</template>

<script>
import { generateHttpErrorMessage, validHttpErrorStatusCode } from '@/common';
import theHeader from '@/components/the-header';
import theFooter from '@/components/the-footer';

export default {
  name: 'TheError',
  components: {
    theHeader,
    theFooter
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
  @import '@/assets/variables.scss';

  .error-page {
    background-image: url('../../assets/images/bg-linshare-desktop.png');
    background-color: $primary-color;
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
