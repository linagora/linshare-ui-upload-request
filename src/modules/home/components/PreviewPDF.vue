<template>
  <div class="pdf-container">
    <VuePdfApp :pdf="pdf" />
  </div>
</template>

<script>
import VuePdfApp from 'vue-pdf-app';

export default {
  name: 'PreviewPDF',
  components: {
    VuePdfApp
  },
  props: {
    pdf: ArrayBuffer
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
  @import '~vue-pdf-app/dist/icons/main.css';

  .pdf-container {
    height: 100%;
    overflow-y: auto;
  }
</style>