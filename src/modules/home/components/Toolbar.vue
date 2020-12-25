<template>
  <div :class="selected.length ? 'home-page-upload-toolbar-multiple home-page-upload-toolbar-multiple-visible' : 'home-page-upload-toolbar-multiple'">
    <v-toolbar extended>
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

      <v-spacer />

      <div class="toolbar-actions-container">
        <v-menu
          v-if="canDeleteDocument"
          top
          :close-on-content-click="true"
          content-class="ls-popover"
          min-width="200"
          min-height="80"
          offset-x
          absolute
        >
          <template #activator="{ on, attrs }">
            <div
              v-bind="attrs"
              class="toolbar-delete-container"
              v-on="on"
            >
              <v-icon
                small
              >
                mdi-delete
              </v-icon>
              <span>{{ $t('TOOLBAR.DELETE') }}</span>
            </div>
          </template>

          <div>
            <p class="ls-popover-title">
              {{ $t('MESSAGE.DELETE_ENTRIES_WARNING', {length: selected.length || 0}) }}
            </p>
            <div class="ls-popover-btn-container">
              <v-btn small>
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
        </v-menu>
      </div>
    </v-toolbar>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
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
  methods: {
    deleteSelectedEntries() {
      this.$emit('deleteEntry');
    },
    toggleShowSelectedItems() {
      this.$emit('toggleShowSelectedItems');
    }
  },
};
</script>

<style lang='scss' scoped>
  .toolbar-title-button {
    border-radius: 4px 0px 0px 4px;
  }
  .toolbar-show-selected-icon.v-btn:not(.v-btn--round).v-size--small {
    border-radius: 0px 4px 4px 0px;
    min-width: 28px;
    width: 28px;
  }
  .toolbar-actions-container {
    margin-left: 20px;

    .toolbar-delete-container {
      display: flex;
      align-items: center;

      &:hover {

        .v-icon {
          color: #1976d2;
        }

        span {
          color: #1976d2;
        }
      }

      .v-icon {
        font-size: 18px;
      }

      span {
        color: #656565;
        font-size: 15px;
      }
    }
  }

</style>