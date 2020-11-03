<template>
  <div class="upload-bar">
    <v-menu offset-y content-class="upload-bar-menu" :close-on-content-click="false" :close-on-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          :content="1"
          :value="1"
          color="red"
          overlap
        >
          <v-icon 
            class="upload-icon"
            v-bind="attrs"
            v-on="on"
          >
            mdi-cloud-upload
          </v-icon>
        </v-badge>
      </template>
      <div>
        <v-tabs class="upload-bar-tabs">
          <v-tab>
            Uploads
          </v-tab>
          <v-tab-item>
            <UploadItem />
            <UploadItem />
            <UploadItem />
            <UploadItem />
          </v-tab-item>
        </v-tabs>
      </div>
    </v-menu>
  </div>
</template>

<script>
import UploadItem from './UploadItem';
export default {
  name: 'UploadBar',
  components: {
    UploadItem
  }
};
</script>

<style lang="scss">
  .upload-bar {
    .upload-icon {
      color: #fff;
      cursor: pointer;
      &:hover, &:focus {
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
    padding-bottom: 30px;
  }
  .upload-bar-tabs {
    .v-tabs-slider-wrapper {
      width: 100%;
    }
    .v-tab {
      width: 100%;
      max-width: auto;
    }
  }
</style>