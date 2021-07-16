<template>
  <div class="preview-unavailable-container">
    <div class="square-box">
      <div class="square-box__content">
        <v-icon class="preview-unavailable-icon">
          mdi-eye-off
        </v-icon>
        <h1 class="preview-unavailable-text">
          {{ $t('HOME.NO_PREVIEW_AVAILABLE') }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewUnavailable',
};
</script>

<style lang="scss" scoped>
  .preview-unavailable-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .square-box {
      width: 60%;
      background-color: #cecece;
      border: 10px solid #fff;
      position: relative;

      &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }

      &__content {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .preview-unavailable-icon {
          font-size: 8em;
        }

        .preview-unavailable-text {
          margin-top: 1.25em;
          font-size: 33px;
          font-weight: 400;
          color: #7b7b7b;
          text-align: center;
        }
      }
    }
  }
</style>