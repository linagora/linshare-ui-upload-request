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
          color="#05B1FF"
          large
        >
          <v-icon>add</v-icon>
        </v-btn>
        <div class="home-page-upload-toolbar-link-container vertical-center">
          <span class="home-page-upload-toolbar-subject text-ellipsis">{{ data.subject }}</span>
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
        <CloseButton
          :is-closed="data.closed"
          @closeUploadRequest="closeUploadRequest()"
        />
      </div>
    </div>
    <div class="home-page-upload-mobile-header hidden-md-and-up">
      <v-icon @click="toggleSelectAll()">
        {{ mobileCheckboxIcon }}
      </v-icon>
      <v-icon @click="showSearchInput = !showSearchInput">
        mdi-magnify
      </v-icon>
      <SortButton
        :sort-desc="sortDesc"
        :sort-by="sortBy"
        :sort-fields="sortItems"
        @selectSort="selectSort"
      />
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
      v-flow-drop
      class="home-page-upload-data-table"
    >
      <v-data-table
        v-model="selectedEntries"
        item-key="uuid"
        show-select
        hide-default-footer
        :no-results-text="$t('HOME.NO_RESULT_TEXT')"
        :items-per-page="pageSize"
        :headers="headers"
        :items="entries"
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
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle v-if="data.collective">
                {{ item.recipient.mail }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-menu
            top
            :close-on-content-click="true"
            content-class="ls-popover"
            min-width="200"
            min-height="80"
            offset-x
            absolute
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>

            <div>
              <p class="ls-popover-title">
                {{ generateConfirmMessage(item) }}
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
        v-if="data.canClose"
        class="close-btn-container hidden-sm-and-down "
      >
        <CloseButton
          :is-closed="data.closed"
          @closeUploadRequest="closeUploadRequest()"
        />
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
  </div>
</template>

<script>
import CloseButton from './CloseButton';
import SortButton from './SortButton';

export default {
  name: 'EntryList',
  components: {
    CloseButton,
    SortButton
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    },
    entries: {
      type: Array,
      default: function() {
        return [];
      }
    },
    selected: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      pageSize: 10,
      search: '',
      showSearchInput: false,
      sortBy: ['name'],
      sortDesc: false
    };
  },
  computed: {
    selectedEntries: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit('changeSelected', value);
      }
    },
    mobileCheckboxIcon() {
      return this.selectedEntriesInPage.length ? (this.selectedEntriesInPage.length === this.entriesInPage.length ? 'mdi-checkbox-marked' : 'mdi-minus-box') : 'mdi-checkbox-blank-outline';
    },
    entriesInPage() {
      const tableEntries = this.customSort(this.entries.filter((item) => this.customFilter(null, this.search, item)), [this.sortBy], [this.sortDesc]);

      return tableEntries.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    },
    selectedEntriesInPage() {
      return this.selectedEntries.filter(value => this.entriesInPage.find(entry => entry.uuid === value.uuid));
    },
    headers() {
      const defaultHeaders = [
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
        }
      ];

      return this.data.canDeleteDocument ? [
        ...defaultHeaders,
        {
          text: this.$t('HOME.ACTIONS'),
          align: 'end',
          value: 'actions',
          sortable: false
        }
      ] : defaultHeaders;
    },
    sortItems(){
      return [
        {
          text: this.name,
          value: 'name'
        },
        {
          text: this.size,
          value: 'size'
        }
      ];
    }
  },
  methods: {
    deleteEntry(item) {
      if (this.selected && this.selected.length && this.selected.map(entry => entry.uuid).indexOf(item.uuid) >= 0) {
        this.$emit('deleteMultipleEntries', this.selected);
      } else {
        this.$emit('deleteSingleEntry', item.uuid);
      }
    },
    generateConfirmMessage (item) {
      if (this.selected && this.selected.length && this.selected.map(entry => entry.uuid).indexOf(item.uuid) >= 0) {
        return this.$t('MESSAGE.DELETE_ENTRIES_WARNING', {length: this.selected.length});
      } else {
        return this.$t('MESSAGE.DELETE_ENTRY_WARNING');
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
    closeUploadRequest() {
      this.$emit('closeUploadRequest');
    },
    toggleSelectAll() {
      if (this.selectedEntriesInPage.length === this.entriesInPage.length) {
        this.selectedEntries = this.selectedEntries.filter(entry => !this.selectedEntriesInPage.some(selected => selected.uuid === entry.uuid));
      } else {
        this.entriesInPage.forEach(entry => {
          if (!this.selectedEntries.some(selected => selected.uuid === entry.uuid)) {
            this.selectedEntries.push(entry);
          }
        });
      }
    }
  },
};
</script>

<style lang="scss">
  @import '~vuetify/src/styles/styles.sass';

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
            padding: 10px 0;

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
            color: #05B1FF;
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
            height: calc(100vh - 267px);
            overflow-y: visible;
            .v-data-table__empty-wrapper {
              background: #eeeeee;
              height: calc(100vh - 315px);
            }
          }
        }

        .drag-and-drop {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eeeeee;
          margin: 0px -16px;


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

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page {
      .home-page-content {
        .home-page-card {
          border-radius: 4px;
        }

        .home-page-upload {
          margin-top: 30px;

          .v-data-table-header {
            display: table-header-group;
          }

          .v-data-table__wrapper {
            height: calc(100vh - 407px);
            .v-data-table__empty-wrapper {
              height: calc(100vh - 455px);
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
