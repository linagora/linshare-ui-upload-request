<template>
  <div class="upload-item">
    <div class="upload-item-info">
      <div class="upload-item-info-text-container">
        <div class="upload-item-info-name-container">
          <h5>Screenshot from 2020/10/30 Screenshot from 2020/10/30</h5>
        </div>
        <div class="upload-item-info-size-container">
          <p>200.1 kb</p>
        </div>
      </div>
      <div class="upload-item-info-progress-container">
        <div>
          <span class="upload-item-info-progress-container-status">done</span>
        </div>
        <div>
          <v-progress-linear
            background-color="#aaa"
            color="#00bfa5"
            value="15"
          />
        </div>
      </div>
    </div>
    <div class="upload-item-check-container">
      <v-icon class="upload-item-check-container-icon upload-item-check-container-view">mdi-eye</v-icon>
      <v-icon class="upload-item-check-container-icon upload-item-check-container-check">mdi-check</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadItem',
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
    }
  }
</style>