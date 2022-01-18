<template>
  <div class="home-page-request-details home-page-card">
    <v-expansion-panels
      v-model="panel"
      accordion
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="request-details-header">
          {{ $t('HOME.REQUEST_DETAILS') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="request-details-content">
            <div class="request-details-user-info">
              <div class="hidden-sm-and-down user-info-icon">
                <v-icon
                  size="40"
                  color="#7E7E7E"
                >
                  {{ uploadRequest.collective ? 'ls-icons-upload-request-collective' : 'ls-icons-upload-request-individual' }}
                </v-icon>
              </div>
              <div class="user-info-content">
                <p class="user-info-content-welcome">
                  {{ $t('HOME.HELLO') }} <span>{{ uploadRequest.recipient && uploadRequest.recipient.mail }}</span>,
                </p>
                <p class="user-info-content-text">
                  <i18n :path="uploadRequest.closed ? 'HOME.WELCOME_MESSAGE_WHEN_CLOSED' : 'HOME.WELCOME_MESSAGE'">
                    <template #owner>
                      <a :href="mailToOwner">{{ ownerName }}</a>
                    </template>
                  </i18n>
                </p>
              </div>
            </div>
            <div class="request-details-message">
              <div class="section-title">
                {{ $t('HOME.SUBJECT') }}
              </div>
              <div
                class="message-content message-content-full"
              >
                {{ uploadRequest.subject }}
              </div>
            </div>
            <div class="request-details-message">
              <div class="section-title">
                {{ $t('HOME.MESSAGE') }}
              </div>
              <div
                v-if="uploadRequest.body"
                ref="messageContent"
                :class="requireShowMore && !showMore ? 'message-content message-content-full' : 'message-content'"
              >
                {{ uploadRequest.body }}
              </div>
              <div
                v-else
                class="message-content message-content-no-message"
              >
                {{ $t('HOME.NO_MESSAGE') }}
              </div>
              <div
                v-show="requireShowMore"
                class="message-show-more"
                @click="toggleAllMessageContent"
              >
                {{ showMore ? $t('HOME.SHOW_MORE') : $t('HOME.SHOW_LESS') }}
              </div>
            </div>
            <div
              v-if="uploadRequest.collective"
              class="request-details-recipients"
            >
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header class="mb-0 section-title">
                    {{ $t('HOME.RECIPIENT_LIST') }}
                    <template #actions>
                      <span class="recipient-toggle-icon">{{ $t('HOME.VIEW') }}</span>
                      <v-icon color="#05B1FF">
                        mdi-chevron-down
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list class="pa-0">
                      <v-list-item
                        v-for="recipient in uploadRequest.recipients"
                        :key="recipient.mail"
                        class="ml-0 pl-0"
                      >
                        <v-list-item-avatar class="mr-2">
                          <v-avatar
                            size="36"
                            :color="getColorByEmail(recipient.mail)"
                          >
                            <span class="white--text headline">
                              {{ recipient.mail[0].toUpperCase() }}
                            </span>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ recipient.mail }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div class="request-details-metadata">
              <div class="section-title">
                {{ $t('HOME.METADATA') }}
              </div>
              <div class="metadata-content">
                <div class="metadata-content-item">
                  <div class="metadata-content-item-title">
                    {{ $t('HOME.ACTIVATED') }}:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ $d(uploadRequest.activationDate, 'mediumDate') }}
                  </div>
                </div>
                <div
                  v-if="uploadRequest.expiryDate"
                  class="metadata-content-item"
                >
                  <div class="metadata-content-item-title">
                    {{ $t('HOME.EXPIRATION') }}:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ $d(uploadRequest.expiryDate, 'mediumDate') }}
                  </div>
                </div>
                <div
                  v-if="uploadRequest.maxFileCount > 0"
                  class="metadata-content-item"
                >
                  <div class="metadata-content-item-title">
                    {{ $t('HOME.FILE_COUNT') }}:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ entries.length }} / {{ uploadRequest.maxFileCount }}
                  </div>
                </div>
                <div
                  v-if="uploadRequest.maxFileSize > 0"
                  class="metadata-content-item"
                >
                  <div class="metadata-content-item-title">
                    {{ $t('HOME.MAX_FILE_SIZE') }}:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ maxFileSize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { formatBytes, getColorByString } from '@/common';
import { mapGetters } from 'vuex';

export default {
  name: 'RequestDetails',
  data() {
    return {
      panel: 0,
      requireShowMore: false,
      showMore: false,
      updated: false
    };
  },
  computed: {
    ...mapGetters({
      entries: 'entries',
      uploadRequest: 'uploadRequest'
    }),
    maxFileSize() {
      return formatBytes(this.uploadRequest.maxFileSize || 0);
    },
    mailToOwner() {
      const uploadRequest = this.uploadRequest;

      return uploadRequest.owner && uploadRequest.owner.mail ? `mailto:${uploadRequest.owner.mail}` : '';
    },
    ownerName() {
      const uploadRequest = this.uploadRequest;

      if (uploadRequest && uploadRequest.owner) {
        uploadRequest.owner.firstName = uploadRequest.owner.firstName || '';
        uploadRequest.owner.lastName = uploadRequest.owner.lastName || '';

        return `${uploadRequest.owner.firstName} ${uploadRequest.owner.lastName}`;
      }

      return '';
    },
  },
  updated() {
    if (this.updated) {
      return;
    }
    if (!this.$refs.messageContent) {
      this.requireShowMore = false;
      this.showMore = false;
    }
    else if (this.$refs.messageContent.offsetHeight > 60 && this.$refs.messageContent.offsetHeight < 80) {
      this.requireShowMore = true;
      this.showMore = true;
    }
    else if (this.$refs.messageContent.offsetHeight >= 80) {
      this.requireShowMore = true;
      this.showMore = false;
    }

    this.updated = true;
  },
  methods: {
    getColorByEmail(email) {
      return getColorByString(email);
    },
    toggleAllMessageContent() {
      this.showMore = !this.showMore;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';
  @import '@/assets/variables.scss';


  .home-page-request-details {
    margin: 20px;
    background-color: #ffffff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
    border-radius: 4px;

    .section-title {
      line-height: 16px;
      font-weight: 500;
      font-size: 17px;
      color: #5E5E5E;
      margin-bottom: 10px;
    }
    .request-details-header {
      text-transform: uppercase;
      line-height: 15px;
      color: #5E5E5E;
      font-weight: 500;
    }
    .v-expansion-panel-header {
      border-bottom: 1px solid #E2E2E2;
    }
    .request-details-content {
      padding-top: 18px;
    }
    .request-details-user-info {
      display: flex;
      align-items: flex-start;
      .user-info-icon {
        padding: 15px;
        margin-right: 25px;
        background-color: #F1F1F1;

        img {
          width: 35px;
          height: 35px;
        }
      }
      .user-info-content {
        &-welcome {
          color: #5E5E5E;
          margin-bottom: 0;
          span {
            font-weight: 450;
          }
        }
        &-text {
          color: #5E5E5E;
          margin-bottom: 0;
        }
      }
    }
    .request-details-message {
      margin-top: 20px;
      padding-bottom: 30px;
      border-bottom: 1px solid #E2E2E2;
      .message-content {
        white-space: break-spaces;
        font-size: 15px;
        color: #5E5E5E;
        text-overflow: ellipsis;
        overflow: hidden;
        max-height: 66px;

        &.message-content-full {
          max-height: 100%;
        }

        &-no-message {
          color: #ccc;
        }
      }
      .message-show-more {
        color: $primary-color;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 400;
        float: right;
        cursor: pointer;
      }
    }
    .request-details-recipients {
      padding-bottom: 10px;
      border-bottom: 1px solid #E2E2E2;
      .recipient-toggle-icon {
        color: $primary-color;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 400;
      }
      .v-expansion-panel::before {
        box-shadow: none;
      }
      .v-expansion-panel-header {
        padding: 0;
        border: none;
      }
      .v-expansion-panel-content ::v-deep .v-expansion-panel-content__wrap {
        padding: 0;
      }
    }
    .request-details-metadata {
      margin-top: 20px;
      .metadata-content {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        &-item {
          padding-right: 15px;
          margin-bottom: 15px;
          &-title {
            font-size: 14px;
            line-height: 14px;
            color: #939393;
            margin-bottom: 10px;
          }
          &-content {
            font-size: 15px;
            line-height: 15px;
            color: #333333;
          }
        }
      }
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page-request-details {
      margin: 0;
    }
  }
</style>
