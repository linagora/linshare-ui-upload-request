<template>
  <div class="upload-item">
    <div class="upload-item-info">
      <div class="upload-item-info-text-container">
        <div class="upload-item-info-name-container">
          <h5>{{ data.name }}</h5>
        </div>
        <div class="upload-item-info-size-container">
          <p>{{ size }}</p>
        </div>
      </div>
      <div class="upload-item-info-progress-container">
        <div>
          <span class="upload-item-info-progress-container-status">
            {{ uploadStatus }}
          </span>
        </div>
        <div>
          <v-progress-linear
            background-color="#aaa"
            color="#00bfa5"
            :value="data.progress() * 100"
          />
        </div>
      </div>
    </div>
    <div class="upload-item-check-container">
      <v-icon
        v-show="completed && error"
        class="upload-item-check-container-icon upload-item-check-container-retry"
        @click="retry()"
      >
        mdi-restart
      </v-icon>
      <v-icon
        v-show="!completed && !paused"
        class="upload-item-check-container-icon upload-item-check-container-pause"
        @click="pause()"
      >
        mdi-pause
      </v-icon>
      <v-icon
        v-show="!completed && paused"
        class="upload-item-check-container-icon upload-item-check-container-resume"
        @click="resume()"
      >
        mdi-play-circle
      </v-icon>
      <v-icon
        v-show="completed"
        class="upload-item-check-container-icon upload-item-check-container-check"
        @click="removeItem()"
      >
        mdi-check
      </v-icon>
      <v-icon
        v-show="!completed"
        class="upload-item-check-container-icon upload-item-check-container-cancel"
        @click="cancel()"
      >
        mdi-cancel
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
          return this.errorMessage;
        }
        
        return convertSecToTimeDisplay(this.remainingTime);
        
      } else {
        return '';
      }
    }
  },
  methods: {
    removeItem() {
      this.$emit('removeItem', this.data);
    },
    pause() {
      this.$emit('pause', this.data);
    },
    resume() {
      this.$emit('resume', this.data);
    },
    cancel() {
      this.$emit('cancel', this.data);
    },
    retry() {
      this.$emit('retry', this.data);
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
        .upload-item-info-size-container {
          margin-left: 10px;
          p {
            font-size: 10px;
            color: #888;
            margin-bottom: 0;
          }
        }
      }
      &-progress-container {
        &-status {
          font-size: 10px;
          color: #888;
          font-style: italic;
        }
      }
    }
    &-check-container {
      display: flex;
      align-items: center;
      margin-left: 5px;
      margin-right: 5px;
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