<template>
  <div
    class="upload-item"
    @click="toggleDisplayFullMessage"
  >
    <div class="upload-item-info">
      <div class="upload-item-info-text-container">
        <div class="upload-item-info-name-container">
          <h5>{{ data.name }}</h5>
        </div>
      </div>
      <div class="upload-item-info-progress-container">
        <div class="upload-item-info-progress-flex">
          <span
            :class="['upload-item-info-progress-container-status', { 'display-full' : showFullMessage }]"
          >
            {{ uploadStatus }}
          </span>
          <div class="upload-item-info-size-container">
            <p>{{ size }}</p>
          </div>
        </div>
        <div>
          <v-progress-linear
            background-color="#aaa"
            :color="colorStatus"
            :value="data.progress() * 100"
          />
        </div>
      </div>
    </div>
    <div class="upload-item-actions-container">
      <v-icon
        v-show="error"
        class="upload-item-actions-container-icon upload-item-actions-container-retry"
        @click="retry($event)"
      >
        mdi-restart
      </v-icon>
      <v-icon
        v-show="!completed && !paused"
        class="upload-item-actions-container-icon upload-item-actions-container-pause"
        @click="pause($event)"
      >
        mdi-pause
      </v-icon>
      <v-icon
        v-show="!completed && paused"
        class="upload-item-actions-container-icon upload-item-actions-container-resume"
        @click="resume($event)"
      >
        mdi-play
      </v-icon>
      <v-icon
        v-show="completed && !error"
        class="upload-item-actions-container-icon upload-item-actions-container-check"
        @click="removeItem($event)"
      >
        mdi-check
      </v-icon>
      <v-icon
        v-show="!completed || error"
        class="upload-item-actions-container-icon upload-item-actions-container-cancel"
        @click="cancel($event)"
      >
        mdi-close
      </v-icon>
    </div>
  </div>
</template>

<script>
import { formatBytes, convertSecToTimeDisplay } from '@/common';
export default {
  name: 'UploadItem',
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    },
    completed: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    doingAsyncUpload: {
      type: Boolean,
      default: false,
    },
    paused: {
      type: Boolean,
      default: false,
    },
    remainingTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showFullMessage: false
    };
  },
  computed: {
    size() {
      return formatBytes(this.data.size);
    },
    uploadStatus() {
      if (this.data) {
        if (this.completed && !this.error) {
          return this.$t('UPLOAD_BAR.DONE');
        }
        if (this.doingAsyncUpload && !this.error) {
          return this.$t('UPLOAD_BAR.SERVER_PROCESSING');
        }
        if (this.paused && !this.completed && !this.error) {
          return this.$t('UPLOAD_BAR.PAUSED');
        }
        if (this.error) {
          return this.$t(this.errorMessage) || this.$t('UPLOAD_BAR.ERROR');
        }

        return convertSecToTimeDisplay(this.remainingTime);

      } else {
        return '';
      }
    },
    colorStatus() {
      if (this.paused) {
        return '#ce9222';
      }
      if (this.error) {
        return '#d60404';
      }

      return '#00bfa5';
    }
  },
  methods: {
    removeItem(event) {
      event.stopPropagation();
      this.$emit('removeItem', this.data);
    },
    pause(event) {
      event.stopPropagation();
      this.$emit('pause', this.data);
    },
    resume(event) {
      event.stopPropagation();
      this.$emit('resume', this.data);
    },
    cancel(event) {
      event.stopPropagation();
      this.$emit('cancel', this.data);
    },
    retry(event) {
      event.stopPropagation();
      this.$emit('retry', this.data);
    },
    toggleDisplayFullMessage() {
      this.showFullMessage = !this.showFullMessage;
    }
  }
};
</script>

<style lang="scss">
  .upload-item {
    padding: 8px 8px 8px 14px;
    display: flex;
    border-bottom: 1px solid #eee;
    &:hover {
      background: #eee;
    }
    &-info {
      flex: 1;
      min-width: 0;
      &-text-container {
        display: flex;
        align-items: center;
        .upload-item-info-name-container {
          flex: 1;
          min-width: 0;
          h5 {
            font-weight: 500;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
      &-progress-container {
        &-status {
          font-size: 10px;
          color: #888;
          font-style: italic;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          flex: 1;
        }
        .display-full {
          text-overflow: initial;
          overflow: visible;
          white-space: inherit;
        }
        .upload-item-info-size-container {
          margin-left: 10px;
          p {
            font-size: 10px;
            color: #888;
            margin-bottom: 0;
          }
        }
        .upload-item-info-progress-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 5px;
        }
      }
    }
    &-actions-container {
      display: flex;
      align-items: center;
      margin-left: 5px;
      margin-right: 5px;
      min-width: 68px;
      justify-content: center;
      &-icon {
        cursor: pointer;
        margin: 0px 5px;
      }
      &-check {
        &:hover {
          color: #008000;
        }
      }
      &-view {
        &:hover {
          color: #0eb1ff;
        }
      }
      &-retry {
        &:hover {
          color: #0eb1ff;
        }
      }
      &-pause {
        &:hover {
          color: #ce9222;
        }
      }
      &-resume {
        &:hover {
          color: #ce9222;
        }
      }
      &-cancel {
        &:hover {
          color: #d60404;
        }
      }
    }
  }
</style>