<template>
  <div class="home-page-upload home-page-card">
    <div class="home-page-upload-toolbar">
      <div class="display-flex">
        <v-btn
          v-if="!data.closed"
          v-flow-browse
          icon
          depressed
          class="hidden-sm-and-down home-page-upload-toolbar-button home-page-upload-toolbar-add-button"
          color="$primary-colory-colory-colory-color"
          large
        >
          <v-icon>add</v-icon>
        </v-btn>
        <div class="home-page-upload-toolbar-link-container vertical-center">
          <span class="home-page-upload-toolbar-subject text-ellipsis">{{ $t('HOME.UPLOADED_FILES') }}</span>
        </div>
      </div>
      <div class="hidden-sm-and-down home-page-upload-toolbar-util">
        <div class="home-page-upload-toolbar-search-container">
          <v-text-field
            v-model="search"
            class="home-page-upload-toolbar-search"
            prepend-inner-icon="mdi-magnify"
            :label="$t('HOME.SEARCH')"
            single-line
            hide-details
          />
        </div>
        <div>
          <SortButton
            :sort-desc="sortDesc"
            :sort-by="sortBy"
            :sort-fields="sortItems"
            @selectSort="selectSort"
          />
        </div>
      </div>
      <div class="hidden-md-and-up home-page-upload-toolbar-close-button">
        <CloseButton />
      </div>
    </div>
    <SelectedItemsToolbar
      :selected="selected"
      :show-selected-items="showSelectedItems"
      :can-delete-document="data.canDeleteDocument"
      @deleteSelected="deleteEntry"
      @downloadSelected="downloadSelectedEntries"
      @toggleShowSelectedItems="toggleShowSelectedItems"
    />
    <div class="home-page-upload-mobile-header hidden-md-and-up">
      <v-icon @click="toggleSelectAll()">
        {{ mobileCheckboxIcon }}
      </v-icon>
      <SortButton
        :sort-desc="sortDesc"
        :sort-by="sortBy"
        :sort-fields="sortItems"
        @selectSort="selectSort"
      />
      <v-icon @click="showSearchInput = !showSearchInput">
        mdi-magnify
      </v-icon>
    </div>
    <v-expand-transition>
      <div
        v-show="showSearchInput"
        class="mobile-search-input"
      >
        <div class="mobile-search-input-wrapper">
          <v-icon
            class="mobile-search-input-close-btn"
            @click="showSearchInput = false"
          >
            mdi-close
          </v-icon>
          <v-text-field
            v-model="search"
            class="home-page-upload-toolbar-search"
            :label="$t('HOME.SEARCH')"
            single-line
            hide-details
          />
        </div>
      </div>
    </v-expand-transition>
    <div
      v-flow-droppable="!data.closed"
      class="home-page-upload-data-table"
      :class="data.closed && 'closed'"
    >
      <v-data-table
        v-model="selected"
        item-key="uuid"
        show-select
        hide-default-footer
        :no-results-text="$t('HOME.NO_RESULT_TEXT')"
        :items-per-page="pageSize"
        :headers="headers"
        :items="showSelectedItems ? selected : entries"
        :search="search"
        :custom-filter="customFilter"
        :custom-sort="customSort"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :page.sync="page"
        :mobile-breakpoint="0"
        @page-count="pageCount = $event"
      >
        <template #[`item.name`]="{ item }">
          <v-list-item
            two-line
            class="table-ellipsis-td"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-content
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-title @click="previewFile(item)">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="data.collective">
                    {{ item.recipient.mail }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-list-item>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            class="ls-preview-icon"
            @click="previewFile(item)"
          >
            mdi-eye-outline
          </v-icon>
          <v-icon @click="downloadEntry(item)">
            mdi-download
          </v-icon>
          <v-menu
            top
            :close-on-content-click="true"
            content-class="ls-popover"
            min-width="200"
            min-height="80"
            max-width="240"
            offset-x
            absolute
          >
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="data.canDeleteDocument"
                v-bind="attrs"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>

            <div>
              <p class="ls-popover-title">
                {{ $t('MESSAGE.DELETE_ENTRY_WARNING') }}
              </p>
              <div class="ls-popover-btn-container">
                <v-btn small>
                  {{ $t('HOME.CANCEL') }}
                </v-btn>
                <v-btn
                  class="ls-delete-btn"
                  small
                  color="error"
                  @click="deleteEntry(item)"
                >
                  {{ $t('HOME.DELETE') }}
                </v-btn>
              </div>
            </div>
          </v-menu>
        </template>
        <template #no-data>
          <div class="drag-and-drop">
            <div class="drag-and-drop-content">
              <div class="drag-icon-container">
                <img
                  v-if="!data.closed"
                  src="../../../assets/images/upload-file.svg"
                >
                <img
                  v-if="data.closed"
                  src="../../../assets/images/upload-file-lock.svg"
                >
              </div>
              <div class="drag-and-drop-text">
                <span>{{ data.closed ? $t('HOME.CLOSED_UPLOAD_REQUEST') : $t('HOME.DROP_YOUR_FILES_HERE') }}</span>
                <p>{{ data.closed ? $t('HOME.CLOSED_UPLOAD_REQUEST_MESSAGE') : $t('HOME.DRAG_AND_DROP_MESSAGE') }}</p>
              </div>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>
    <div class="home-page-card-footer">
      <div class="table-pagination">
        <v-pagination
          v-model="page"
          :length="pageCount"
        />
      </div>

      <div
        class="close-btn-container hidden-sm-and-down "
      >
        <CloseButton />
      </div>
    </div>

    <v-btn
      v-if="!data.closed"
      v-flow-browse
      fab
      large
      color="primary"
      fixed
      right
      bottom
      class="hidden-md-and-up"
    >
      <v-icon dark>
        add
      </v-icon>
    </v-btn>

    <PreviewDialog
      v-if="currentPreviewItem"
      :item="currentPreviewItem"
      @closeDialog="handleClosePreviewDialog"
      @downloadItem="downloadEntry"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CloseButton from './CloseButton';
import SortButton from './SortButton';
import SelectedItemsToolbar from './SelectedItemsToolbar.vue';
import { ConfigService } from '@/services';
import PreviewDialog from './PreviewDialog.vue';
import { ThumbnailService } from '@/services';
import { OtpService } from '@/services';

export default {
  name: 'EntryList',
  components: {
    CloseButton,
    SortButton,
    SelectedItemsToolbar,
    PreviewDialog
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      pageSize: 10,
      search: '',
      showSearchInput: false,
      sortBy: ['name'],
      sortDesc: false,
      selected: [],
      showSelectedItems: false,
      temporaryPageIndex: 1,
      currentPreviewItem: undefined
    };
  },
  computed: {
    ...mapGetters({
      entries: 'entries',
      data: 'uploadRequest'
    }),
    mobileCheckboxIcon() {
      return this.selectedEntriesInPage.length ? (this.selectedEntriesInPage.length === this.entriesInPage.length ? 'mdi-checkbox-marked' : 'mdi-minus-box') : 'mdi-checkbox-blank-outline';
    },
    entriesInPage() {
      const tableEntries = this.customSort(this.entries.filter((item) => this.customFilter(null, this.search, item)), [this.sortBy], [this.sortDesc]);

      return tableEntries.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    },
    selectedEntriesInPage() {
      return this.selected.filter(value => this.entriesInPage.find(entry => entry.uuid === value.uuid));
    },
    headers() {
      return [
        {
          text: this.$t('HOME.NAME'),
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: this.$t('HOME.SIZE'),
          align: 'end',
          sortable: false,
          value: 'size',
        },
        {
          text: this.$t('HOME.ACTIONS'),
          align: 'end',
          value: 'actions',
          sortable: false
        }
      ];
    },
    sortItems(){
      return [
        {
          text: this.$t('HOME.NAME'),
          value: 'name'
        },
        {
          text: this.$t('HOME.SIZE'),
          value: 'size'
        }
      ];
    }
  },
  watch: {
    selected: function(newSelected) {
      if (!newSelected || !newSelected.length) {
        this.showSelectedItems = false;
      }
    },
    showSelectedItems: function(newValue) {
      if (newValue) {
        this.search = '';
        this.temporaryPageIndex = this.page;
        this.page = 1;
      } else {
        this.page = this.temporaryPageIndex;
        this.temporaryPageIndex = 1;
      }
    },
    search: function(newSearch) {
      if (newSearch) {
        this.showSelectedItems = false;
      }
    }
  },
  methods: {
    async deleteEntry(item) {
      const requestId = this.$route.params.id;

      if (!item) {
        const rejectedEntries = await this.$store.dispatch('removeEntries', { requestId, entries: this.selected });

        if (!rejectedEntries || rejectedEntries.length === 0) {
          this.$alert.open(this.$t('MESSAGE.DELETE_ENTRIES_SUCCESS', {length:  this.selected.length}), {
            type: 'success'
          });
          this.selected = [];
        } else {
          this.$alert.open(this.$tc('MESSAGE.DELETE_ENTRIES_ERROR', rejectedEntries.length, {length:  rejectedEntries.length}), {
            type: 'error'
          });
          this.selected = this.selected.filter(selected => rejectedEntries.map(rejectedEntry => rejectedEntry.uuid).includes(selected.uuid));
        }
      } else {
        const rejectedEntry = await this.$store.dispatch('removeEntries', { requestId, entries: [item] });

        if (!rejectedEntry || rejectedEntry.length === 0) {
          this.selected = this.selected.filter(entry => entry.uuid !== item.uuid);
          this.$alert.open(this.$t('MESSAGE.DELETE_ENTRY_SUCCESS'), {
            type: 'success'
          });
        } else {
          this.$alert.open(this.$t(rejectedEntry[0].error.getMessage(), { errCode: rejectedEntry[0].error.getErrorCode() }), {
            type: 'error'
          });
        }
      }
    },
    selectSort (sortBy) {
      this.sortDesc = !this.sortDesc;
      this.sortBy = sortBy;
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'size') {
          if (!isDesc[0]) {
            return a.originalSize < b.originalSize ? -1 : 1;
          } else {
            return b.originalSize < a.originalSize ? -1 : 1;
          }
        } else {
          if (!isDesc[0]) {
            return a[index] < b[index] ? -1 : 1;
          } else {
            return b[index] < a[index] ? -1 : 1;
          }
        }
      });

      return items;
    },
    customFilter(value, query, item) {
      if (!query) {return true;}

      return item.name.indexOf(query) >= 0;
    },
    toggleSelectAll() {
      if (this.selectedEntriesInPage.length === this.entriesInPage.length) {
        this.selected = this.selected.filter(entry => !this.selectedEntriesInPage.some(selected => selected.uuid === entry.uuid));
      } else {
        this.entriesInPage.forEach(entry => {
          if (!this.selected.some(selected => selected.uuid === entry.uuid)) {
            this.selected.push(entry);
          }
        });
      }
    },
    toggleShowSelectedItems() {
      this.showSelectedItems = !this.showSelectedItems;
    },
    async downloadEntry(entry) {
      let url = `${window.origin}${ConfigService.get().apiUrl}/requests/${this.data.uuid}/entries/${entry.uuid}/download`;

      if (this.data.protectedByPassword) {
        try {
          const otp = await OtpService.getOtp(this.data.uuid, entry);

          url = `${url}?otp=${otp.otpPassword}`;
        } catch (error) {
          return error;
        }
      }

      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', entry.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    downloadSelectedEntries() {
      this.selected.forEach(this.downloadEntry);
    },
    async previewFile(item) {
      try {
        this.$alert.open(this.$t('HOME.LOADING_PREVIEW'), {type: 'info'});
        const previewMode = ThumbnailService.getPreviewMode(item);
        const thumbnail = await ThumbnailService.getPreview(this.data, item);

        this.currentPreviewItem = {
          ...item,
          thumbnail,
          previewMode
        };

        this.$alert.close();
      } catch (err) {
        this.currentPreviewItem = {
          ...item,
          thumbnail: undefined
        };
      }
    },
    handleClosePreviewDialog() {
      this.currentPreviewItem = undefined;
    }
  }
};
</script>

<style lang="scss">
  @import '~vuetify/src/styles/styles.sass';
  @import '@/assets/variables.scss';

  .mobile-search-input {
    transition: all 0.3s;
    background-color: #efefef;
    &-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 16px;
    }
  }
  .mobile-search-input-close-btn {
    padding: 5px;
    margin-right: 8px;
  }
  .home-page {
    .home-page-content {
      .home-page-card {
        background-color: #ffffff;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);

        &-footer {
          .table-pagination {
            // Fixed height whether item contain a page item or not
            // Update this value must come with an update of table offset variables
            height: 64px !important;
            padding: 10px 0;
            margin: 0 12px;

            .v-pagination__item.v-pagination__item--active.primary {
              &:hover,
              &:focus,
              &:active {
                outline: none !important;
              }
            }
          }
          .close-btn-container {
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-top: 1px solid #ddd;
          }
        }
      }

      .home-page-upload {
        position: relative;
        overflow: hidden;

        &-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E2E2;
          height: 48px;

          &-button {
            border-radius: 0;
          }
          &-add-button {
            border-right: 1px solid #E2E2E2;
          }
          &-link-container {
            width: 250px;
            flex: 1;
            padding-left: 15px;
            @media (max-width: 360px) {
              width: 200px;
            }
          }
          &-subject {
            text-transform: uppercase;
            font-weight: 500;
            color: $primary-color;
            text-decoration: none;
            font-size: 14px;
          }
          &-search {
            margin-top: 0;
            padding-top: 0;
          }
          &-search-container {
            margin-right: 20px;
            padding: 3px 0px;
          }
          &-util {
            display: flex;
            align-items: center;
            padding-right: 15px;
          }
          &-close-button {
            padding-right: 15px;
          }
        }

        &-mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background-color: #F9F9F9;
        }

        &-data-table {
          thead {
            text-transform: uppercase;
          }

          .v-data-table-header {
            display: none;
          }

          .v-data-table__wrapper {
            height: calc(100vh - #{$table-offset-sm});
            overflow-y: visible;

            .v-data-table__empty-wrapper {
              background: #eeeeee;
              height: calc(100vh - #{$table-empty-offset-sm});
            }
          }

          .table-ellipsis-td {
            max-width: 500px;

            @media (max-width: 1400px) and (min-width: 769px) {
              max-width: 370px;
            }

            @media (max-width: 500px) {
              max-width: 200px;
            }
          }
        }

        .drag-and-drop {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eeeeee;


          .drag-and-drop-content {
            .drag-icon-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: auto;
              border-radius: 100%;
              width: 165px;
              height: 165px;
              background: #dadada;

              img {
                width: 60%;
              }
            }

            .drag-and-drop-text {
              user-select: none;
              pointer-events: none;
              font-weight: 500;
              margin-top: 15px;

              span {
                line-height: 1.5;
                font-size: 2.1em;
                padding-bottom: 10px;
                color: #6b6b6b;
              }

              p {
                font-size: 13px;
                font-family: roboto,sans-serif;
                text-align: center;
                margin: 0 0 9px;
                color: #9c9c9c;
              }
            }
          }
        }
      }
    }
  }

  .ls-delete-btn {
    margin-left: 10px;
  }

  .ls-preview-icon {
    margin-right: 5px;
    cursor: pointer;
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page {
      .home-page-content {
        .home-page-card {
          border-radius: 4px;
        }

        .home-page-upload {
          margin-top: 30px;

          &-data-table {
            .v-data-table__wrapper {
              height: calc(100vh - #{$table-offset-md});

              .v-data-table__empty-wrapper {
                height: calc(100vh - #{$table-empty-offset-md});
              }

              .v-data-table-header {
                display: table-header-group;
              }
            }
          }

          &-data-table.closed {
            .v-data-table__wrapper {
              height: calc(100vh - #{$table-offset-md-closed});

              .v-data-table__empty-wrapper {
                height: calc(100vh - #{$table-empty-offset-md-closed});
              }
            }
          }

          .v-list-item {
            padding: 0;
          }
        }
      }
    }
  }
</style>
