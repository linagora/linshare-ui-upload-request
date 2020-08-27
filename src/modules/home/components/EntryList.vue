<template>
  <div class="home-page-upload home-page-card">
    <div class="home-page-upload-toolbar">
      <div>
        <v-btn
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
        v-model="selected"
        :headers="headers"
        :items="files"
        item-key="name"
        show-select
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">
            Upload
          </v-btn>
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
    }
  },
  data() {
    return {
      selected: [],
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
      ],
      files: [
        {
          name: 'Frozen Yogurt',
          size: '0.5 GB'
        },
        {
          name: 'Ice cream sandwich',
          size: '1.0 GB'
        },
        {
          name: 'Eclair',
          size: '0.3 GB'
        },
        {
          name: 'Cupcake',
          size: '200 MB'
        },
        {
          name: 'Gingerbread',
          size: '1.1 GB'
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
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
      }
    } 
  }
</style>