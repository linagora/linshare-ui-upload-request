<template>
  <div>
    <theHeader />
    <div class="landing-page">
      <div>
        <h2 class="landing-page__big-title">
          {{ $t('LANDING.SHARE') }}
          <b>{{ $t('LANDING.EASILY_EFFICIENTLY_WITH_CONFIDENCE') }}</b>
        </h2>
        <h3 class="landing-page__sub-title">
          {{ $t('LANDING.DESCRIPTION') }}
        </h3>
      </div>
    </div>
    <theFooter />
  </div>
</template>

<script>
import theHeader from '@/components/the-header';
import theFooter from '@/components/the-footer';

export default {
  name: 'TheLanding',
  components: {
    theHeader,
    theFooter
  }
};
</script>

<style lang="scss" scoped>
  @import '@/assets/variables.scss';

  .landing-page {
    background-image: url('../../assets/images/bg-linshare-desktop.png');
    background-position: center;
    background-size: cover;
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
      text-transform: uppercase;
      font-size: 2.5em;
      font-weight: 500;
      line-height: 1.1;
      text-shadow: -3px 0px 13px rgba(0, 107, 156,0.7);
    }

    &__sub-title {
      text-align: center;
      margin-top: 0.7em;
      font-size: 1.7em;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.7);
    }
  }
</style>
