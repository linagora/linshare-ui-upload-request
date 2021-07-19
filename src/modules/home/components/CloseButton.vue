<template>
  <v-menu
    top
    :close-on-content-click="true"
    content-class="ls-popover"
    min-width="300"
    min-height="80"
    max-width="240"
    offset-x
    absolute
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="data.canClose || initiallyCanClose"
        v-bind="attrs"
        :disabled="isClosed"
        :elevation="0"
        :color="'#5E5E5E'"
        class="close-button"
        v-on="on"
      >
        {{ isClosed ? $t('HOME.CLOSED') : $t('HOME.CLOSE') }}
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
          class="ls-popover-btn-container-delete-btn"
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
import { FlowService } from '@/services';
import { mapGetters } from 'vuex';

export default {
  name: 'CloseButton',
  data() {
    return {
      initiallyCanClose: true
    };
  },
  computed: {
    ...mapGetters({
      data: 'uploadRequest'
    }),
    isClosed() {
      return this.$store.getters.uploadRequest.closed;
    }
  },
  watch: {
    isClosed() {
      const flow = FlowService.getFlowObject();

      flow.cancel();
    }
  },
  created() {
    this.initiallyCanClose = this.data.canClose;
  },
  methods: {
    closeUploadRequest() {
      this.$store.dispatch('closeUploadRequest').catch(error => {
        this.$alert.open(this.$t(error.getMessage(), { errCode: error.getErrorCode() }), {
          type: 'error'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .close-button {
    color: #FEFEFE;
    text-transform: none;
    padding: 0 24px !important;
  }
</style>