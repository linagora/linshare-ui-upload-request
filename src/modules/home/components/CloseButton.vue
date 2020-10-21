<template>
  <v-menu
    top
    :close-on-content-click="true"
    content-class="ls-popover"
    min-width="300"
    min-height="80"
    offset-x
    absolute
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        :disabled="isClosed"
        :color="'#E2E2E2'"
        :elevation="0"
        class="close-button"
        v-on="on"
      >
        {{ isClosed ? 'Closed' : 'Close' }}
      </v-btn>
    </template>

    <div>
      <p class="ls-popover-title">
        {{ $t('HOME.CLOSE_UPLOAD_REQUEST_WARNING') }}
      </p>
      <div class="ls-popover-btn-container">
        <v-btn small>
          {{ $t('HOME.CANCEL') }}
        </v-btn>
        <v-btn
          class="ls-delete-btn"
          small
          color="error"
          @click="closeUploadRequest()"
        >
          {{ $t('HOME.PROCEED') }}
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'CloseButton',
  props: {
    isClosed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeUploadRequest() {
      this.$emit('closeUploadRequest');
    }
  }
};
</script>

<style lang="scss" scoped>
  .close-button {
    color: #7E7E7E;
    text-transform: none;
    padding: 0 24px !important;
  }
</style>