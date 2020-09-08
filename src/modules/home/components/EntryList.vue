<template>
  <div class="home-page-upload home-page-card">
    <div class="home-page-upload-toolbar">
      <div>
        <v-btn
          v-flow-browse
          icon
          depressed
          class="home-page-upload-toolbar-button home-page-upload-toolbar-add-button"
          color="#05B1FF"
          large
        >
          <v-icon>add</v-icon>
        </v-btn>
        <div class="home-page-upload-toolbar-link-container">
          <span class="home-page-upload-toolbar-subject">{{ data.subject }}</span>
        </div>
      </div>
      <div class="home-page-upload-toolbar-util">
        <div class="home-page-upload-toolbar-search-container">
          <v-text-field
            class="home-page-upload-toolbar-search"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </div>
        <div>
          <v-btn
            icon
            depressed
            class="home-page-upload-toolbar-button"
            color="#5E5E5E"
            large
          >
            <v-icon>sort_by_alpha</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div class="home-page-upload-data-table">
      <v-data-table
        v-model="selectedEntries"
        :headers="headers"
        :items="entries"
        item-key="id"
        show-select
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-menu
            top
            :close-on-content-click="true"
            content-class="ls-delete-popover"
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
              <p class="ls-delete-popover-title">
                {{ generatePopconfirmMessage(item) }}
              </p>
              <div class="ls-delete-popover-btn-container">
                <v-btn small>
                  Cancel
                </v-btn>
                <v-btn
                  class="ls-delete-btn"
                  small
                  color="error"
                  @click="deleteEntry(item)"
                >
                  Delete
                </v-btn>
              </div>
            </div>
          </v-menu>
        </template>
        <template #no-data>
          <div
            v-flow-drop
            class="drag-and-drop"
          >
            <div
              ref="dropZone"
              class="drag-and-drop-content"
            >
              <div class="drag-icon-container">
                <img src="../../../assets/images/upload-file.svg">
              </div>
              <div class="drag-and-drop-text">
                <span>Drop your files here</span>
                <p>Drag and drop your files here to upload them</p>
              </div>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EntryList',
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
      headers: [
        {
          text: 'NAME',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'SIZE',
          align: 'end',
          sortable: false,
          value: 'size',
        },
        {
          text: 'Actions',
          align: 'end',
          value: 'actions',
          sortable: false
        },
      ]
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
    }
  },
  methods: {
    deleteEntry(item) {
      if (this.selected && this.selected.length && this.selected.map(entry => entry.id).indexOf(item.id) >= 0) {
        this.$emit('deleteMultipleEntries', this.selected);
      } else {
        this.$emit('deleteSingleEntry', item);
      }
    },
    generatePopconfirmMessage (item) {
      if (this.selected && this.selected.length && this.selected.map(entry => entry.id).indexOf(item.id) >= 0) {
        return `Are you sure you want to delete ${this.selected.length} entries?`;
      } else {
        return 'Are you sure you want to delete this entry?';
      }
    }
  },
};
</script>

<style lang="scss">
  .home-page {
    .home-page-content {
      .home-page-card {
        background-color: #ffffff;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
      }
      .home-page-upload {
        margin-top: 30px;
        margin-bottom: 30px;
        &-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E2E2;
          &-button {
            border-radius: 0;
          }
          &-add-button {
            border-right: 1px solid #E2E2E2;
          }
          &-link-container {
            display: inline-block;
            padding-left: 15px;
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
        }

        .drag-and-drop {
          height: 60vh;
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
  .ls-delete-popover {
    max-width: 240px;
    padding: 10px;
    background-color: #ffffff;
    .ls-delete-popover-title {
      text-align: center;
    }
    .ls-delete-popover-btn-container {
      float: right;
      .ls-delete-btn {
        margin-left: 10px;
      }
    }
  }
</style>
