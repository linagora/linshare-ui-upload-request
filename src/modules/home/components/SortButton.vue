<template>
  <v-menu
    bottom
    content-class="ls-sort-menu"
    :close-on-content-click="false"
    :offset-y="true"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        class="home-page-upload-toolbar-button"
        v-bind="attrs"
        color="#5E5E5E"
        v-on="on"
      >
        sort_by_alpha
      </v-icon>
    </template>

    <div class="ls-sort-list-container">
      <div class="ls-sort-list-title">
        {{ $t('HOME.ORDER_BY') }}
      </div>
      <v-list>
        <v-list-item
          v-for="(field, index) in sortFields"
          :key="index"
          class="ls-sort-list-item"
          @click="selectSort(field.value)"
        >
          <v-list-item-icon>
            <v-icon v-show="sortBy[0] === field.value">
              {{ !sortDesc ? 'mdi-menu-down' : 'mdi-menu-up' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="field.text" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'SortButton',
  props: {
    sortBy: {
      type: Array,
      default: () => ['name']
    },
    sortDesc: {
      type: Boolean,
      default: false
    },
    sortFields: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectSort(value) {
      this.$emit('selectSort', [value]);
    }
  }
};
</script>

<style lang="scss" scoped>
  .ls-sort-menu {
    padding: 0;
    .ls-sort-list-container {
      background: #ffffff;
      .ls-sort-list-title {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        text-align: center;
        font-size: 18px;
      }
    }
    .v-list {
      padding: 0;
    }
    .ls-sort-list-item {
      border-bottom: 1px solid #eee;
      cursor: pointer;
      .v-list-item__icon {
        margin: 10px 10px 10px -6px;
      }
      .v-list-item__title {
        font-size: 0.9rem;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.075);
        color: #444;
      }
    }
  }
</style>