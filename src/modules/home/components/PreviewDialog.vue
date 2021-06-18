<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
    >
      <v-card class="preview-card">
        <v-row class="preview-file-info black pa-3 text-center">
          <v-col cols="6" offset="3">
            <span class="white--text">{{ item.name }}</span>
          </v-col>
          <v-col cols="3" class="dialog-actions-ctn">
            <v-icon class="close-dialog-btn" @click="closeDialog">
              mdi-close
            </v-icon>
          </v-col>
        </v-row>
        <v-row
          justify="center"
          class="black preview-content"
        >
          <v-col
            md="8"
            xl="6"
            class="preview-content"
          >
            <PreviewPDF
              v-if="(item.previewMode === PREVIEW_MODES.PDF || item.previewMode === PREVIEW_MODES.OTHER) && item.thumbnail"
              :pdf="item.thumbnail"
            />
            <img
              v-if="item.previewMode === PREVIEW_MODES.IMAGE && item.thumbnail"
              class="image-responsive"
              :src="`data:image/png;base64,${item.thumbnail}`"
              alt=""
            />
            <PreviewUnavailable v-if="!item.thumbnail" />
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PreviewPDF from './PreviewPDF.vue';
import PreviewUnavailable from './PreviewUnavailable.vue';
import { PREVIEW_MODES } from '@/services';
export default {
  name: 'PreviewDialog',
  components: {
    PreviewPDF,
    PreviewUnavailable
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: true,
      PREVIEW_MODES
    };
  },
  created() {
    //
    if (this.dialog) {
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100%';
    }
  },
  methods: {
    closeDialog() {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
      this.dialog = false;
      this.$emit('closeDialog');
    }
  }
};
</script>

<style lang="scss">
  .v-dialog--fullscreen {
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>

<style lang="scss" scoped>
  .preview-card {
    display: flex;
    flex-direction: column;

    .preview-file-info {
      flex: inherit;
      border-bottom: 1px solid #6f6f6f !important;
    }

    .preview-content {
      flex: 1;
    }

    .image-responsive {
      width: 100%;
    }
  }

  .dialog-actions-ctn {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .close-dialog-btn {
      color: #FFF;
      cursor: pointer;
    }
  }
</style>