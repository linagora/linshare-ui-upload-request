<template>
  <div class="upload-bar">
    <v-menu
      v-model="visible"
      offset-y
      content-class="upload-bar-menu"
      :close-on-content-click="false"
    >
      <template #activator="{ on, attrs }">
        <v-badge
          :content="files.length <= 99 ? files.length : '99+'"
          :value="files.length"
          color="red"
          overlap
        >
          <v-icon
            class="upload-icon"
            v-bind="attrs"
            v-on="on"
          >
            ls-icons-uploads
          </v-icon>
        </v-badge>
      </template>
      <div>
        <div class="upload-bar-header">
          {{ $t("UPLOAD_BAR.UPLOADS") }}
        </div>
        <div v-if="files.length">
          <UploadItem
            v-for="file in files"
            :key="file.uniqueIdentifier"
            :data="file"
            :completed="file.isCompleted"
            :error="file.error"
            :error-message="file.errorMessage"
            :doing-async-upload="file.doingAsyncUpload"
            :paused="file.paused"
            :remaining-time="file.timeRemaining()"
            @removeItem="removeItem"
            @pause="pause"
            @resume="resume"
            @cancel="cancel"
            @retry="retry"
          />
        </div>
        <div
          v-if="!files.length"
          class="upload-bar-empty"
        >
          <i18n path="UPLOAD_BAR.EMPTY">
            <template #icon>
              <v-icon class="upload-bar-add-icon">
                add
              </v-icon>
            </template>
          </i18n>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import UploadItem from './UploadItem';
import { FlowService } from '@/services';
import { validateUpload } from '@/common';

export default {
  name: 'UploadBar',
  components: {
    UploadItem,
  },
  data() {
    return {
      files: [],
      visible: false
    };
  },
  created() {
    const flow = FlowService.getFlowObject();

    flow.on('filesSubmitted', (files) => {
      this.files.push(...files);
      this.visible = true;
    });

    flow.on('fileSuccess', (file, response) => {
      try {
        response = JSON.parse(response);
      } catch (e) {
        response = {};
      }

      if (response.chunkUploadSuccess) {
        this.files = this.files.map((f) => {
          if (f.uniqueIdentifier === file.uniqueIdentifier) {
            f.isCompleted = true;
          }

          return f;
        });
      } else {
        this.files = this.files.map((f) => {
          if (f.uniqueIdentifier === file.uniqueIdentifier) {
            f.isCompleted = true;
            f.error = true;
            f.errorMessage = `UPLOAD_BAR.SERVER_RESPONSE.${response.errCode || 'NONE'}`;
          }

          return f;
        });
      }
    });

    flow.on('fileRemoved', () => {
      if (this.$store.getters.uploadRequest.closed) {
        this.files = [];
      }
    });
  },
  methods: {
    validateFileBeforeUpload(files) {
      return validateUpload(files, {
        ...this.$store.getters.uploadRequest,
        currentFiles: this.$store.getters.entries
      });
    },
    removeItem(item) {
      this.files = this.files.filter(
        (f) => f.uniqueIdentifier !== item.uniqueIdentifier
      );
    },
    pause(file) {
      file.pause();
    },
    resume(file) {
      const error = this.validateFileBeforeUpload([file]);

      if (error) {
        this.$alert.open(error, { type: 'error' });

        return;
      }

      file.resume();
    },
    cancel(file) {
      file.cancel();
      this.removeItem(file);
    },
    retry(file) {
      const error = this.validateFileBeforeUpload([file]);

      if (error) {
        this.$alert.open(error, { type: 'error' });

        return;
      }

      file.retry();
    },
  },
};
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  .upload-bar {
    .upload-icon {
      color: #fff;
      cursor: pointer;
      &:hover,
      &:focus {
        color: #eee;
      }
    }
  }
  .upload-bar-menu {
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    @media (min-width: 769px) {
      width: 350px;
    }
    padding-bottom: 20px;
    max-height: 360px;
    overflow-y: auto;
  }
  .upload-bar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-bottom: 1px solid #bbb;
    font-size: 15px;
    text-transform: uppercase;
    color: #5E5E5E;
    line-height: 15px;
    font-weight: 500;
  }
  .upload-bar-empty {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;

    .upload-bar-add-icon {
      color: $primary-color;
    }
  }
</style>
