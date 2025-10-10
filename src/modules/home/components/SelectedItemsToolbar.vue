<template>
  <div>
    <v-expand-transition>
      <div
        v-show="selected.length"
        class="selected-items-toolbar"
      >
        <div class="selected-items-toolbar__items-indicator">
          <v-btn
            class="toolbar-title-button"
            depressed
            small
            color="primary"
            @click="toggleShowSelectedItems()"
          >
            {{ $tc('TOOLBAR.TITLE', selected.length, { count: selected.length }) }}
          </v-btn>
          <v-btn
            class="toolbar-show-selected-icon"
            outlined
            small
            color="primary"
            @click="toggleShowSelectedItems()"
          >
            <v-icon small>
              {{ showSelectedItems ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </v-btn>
        </div>

        <div class="selected-items-toolbar__action">
          <v-btn
            v-if="canDeleteDocument"
            plain
            text
            x-small
            color="#656565"
            :ripple="false"
            @click="showDeleteWarning = true"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
            {{ $t('TOOLBAR.DELETE') }}
          </v-btn>
        </div>

        <div class="selected-items-toolbar__action">
          <v-btn
            plain
            text
            x-small
            color="#656565"
            :ripple="false"
            @click="onDownloadButtonPress"
          >
            <v-icon small>
              mdi-download
            </v-icon>
            {{ $t('TOOLBAR.DOWNLOAD') }}
          </v-btn>
        </div>
      </div>
    </v-expand-transition>

    <v-dialog
      v-model="showDownloadWarning"
      content-class="ls-popover"
      max-width="290"
    >
      <div>
        <p class="ls-popover-title">
          {{ $t('MESSAGE.DOWNLOAD_ENTRIES_WARNING', { length: selected.length || 0, size: totalSizeOfSelectedEntries}) }}
        </p>
        <div class="ls-popover-btn-container">
          <v-btn
            small
            @click="showDownloadWarning = false"
          >
            {{ $t('HOME.CANCEL') }}
          </v-btn>
          <v-btn
            class="ls-delete-btn"
            small
            color="primary"
            @click="downloadSelectedEntries()"
          >
            {{ $t('TOOLBAR.DOWNLOAD') }}
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <v-dialog
      v-model="showDeleteWarning"
      max-width="290"
      content-class="ls-popover"
    >
      <div>
        <p class="ls-popover-title">
          {{ $t('MESSAGE.DELETE_ENTRIES_WARNING', {length: selected.length || 0}) }}
        </p>
        <div class="ls-popover-btn-container">
          <v-btn
            small
            @click="showDeleteWarning = false"
          >
            {{ $t('HOME.CANCEL') }}
          </v-btn>
          <v-btn
            class="ls-delete-btn"
            small
            color="error"
            @click="deleteSelectedEntries()"
          >
            {{ $t('HOME.DELETE') }}
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { formatBytes } from '@/common';
export default {
  name: 'SelectedItemsToolbar',
  props: {
    selected: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showSelectedItems: {
      type: Boolean,
      default: false
    },
    canDeleteDocument: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    showDownloadWarning: false,
    showDeleteWarning: false
  }),
  computed: {
    totalSizeOfSelectedEntries() {
      return formatBytes(this.selected.reduce((size, entry) => size + (entry.originalSize || 0), 0));
    }
  },
  methods: {
    onDownloadButtonPress() {
      if (this.selected.length < 5) {
        this.downloadSelectedEntries();

        return;
      }

      this.showDownloadWarning = true;
    },
    downloadSelectedEntries() {
      this.$emit('downloadSelected');

      this.showDownloadWarning = false;
    },
    deleteSelectedEntries() {
      this.$emit('deleteSelected');

      this.showDeleteWarning = false;
    },
    toggleShowSelectedItems() {
      this.$emit('toggleShowSelectedItems');
    }
  },
};
</script>

<style lang='scss' scoped>
  .selected-items-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 20px;
    border-bottom: 1px solid #E2E2E2;

    &__items-indicator {
      flex: 0 235px;
    }

    &__action {
      margin: 10px;
      flex: 0 1;
    }

    .toolbar-title-button {
      border-radius: 4px 0px 0px 4px;
    }
    .toolbar-show-selected-icon.v-btn:not(.v-btn--round).v-size--small {
      border-radius: 0px 4px 4px 0px;
      min-width: 28px;
      width: 28px;
    }
  }
</style>