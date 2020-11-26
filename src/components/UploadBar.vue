<template>
  <div class="upload-bar">
    <v-menu
      offset-y
      content-class="upload-bar-menu"
      :close-on-content-click="false"
      :close-on-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          :content="files.length"
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
            <template v-slot:icon>
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
export default {
  name: 'UploadBar',
  components: {
    UploadItem,
  },
  props: {
    validateFileBeforeUpload: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      files: [],
    };
  },
  created() {
    const flow = FlowService.getFlowObject();

    flow.on('filesSubmitted', (files) => {
      this.files.push(...files);
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
      }
    });
  },
  methods: {
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
    color: #05b1ff;
  }
}
</style>