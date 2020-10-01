<template>
  <div class="home-page-request-details home-page-card">
    <v-expansion-panels
      v-model="panel"
      accordion
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="request-details-header">
          Request details
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="request-details-content">
            <div class="request-details-user-info">
              <div>
                <div class="user-info-icon">
                  <img src="../../../assets/images/upload-request-2.svg">
                </div>
              </div>
              <div class="user-info-content">
                <p class="user-info-content-welcome">
                  Hello <span>{{ data.recipient && data.recipient.mail }}</span>,
                </p>
                <p class="user-info-content-text">
                  You received an upload request from <a :href="mailToOwner">{{ ownerName }}</a>. The upload request will be active until {{ expiryDate }} or the request closure. Beyond that, you could not be able to upload nor delete files.
                </p>
              </div>
            </div>
            <div class="request-details-message">
              <div class="message-title">
                Message
              </div>
              <div class="message-content">
                {{ data.body }}
              </div>
            </div>
            <div class="request-details-recipients">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header class="mb-0 recipient-list-title">
                    Recipient list
                    <template v-slot:actions>
                      <span class="recipient-toggle-icon">View</span>
                      <v-icon color="#05B1FF">
                        mdi-chevron-down
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list class="pa-0">
                      <v-list-item
                        v-for="recipient in data.recipients"
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
              <div class="metadata-title">
                Metadata
              </div>
              <div class="metadata-content">
                <div class="metadata-content-item">
                  <div class="metadata-content-item-title">
                    Activated:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ activationDate }}
                  </div>
                </div>
                <div class="metadata-content-item">
                  <div class="metadata-content-item-title">
                    Expiration:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ expiryDate }}
                  </div>
                </div>
                <div class="metadata-content-item">
                  <div class="metadata-content-item-title">
                    File count:
                  </div>
                  <div class="metadata-content-item-content">
                    {{ entries.length }} / {{ data.maxFileCount }}
                  </div>
                </div>
                <div class="metadata-content-item">
                  <div class="metadata-content-item-title">
                    Max file size:
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
import moment from 'moment';
import { formatBytes } from '@/common';
export default {
  name: 'RequestDetails',
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
      panel: 0,
    };
  },
  computed: {
    expiryDate() {
      return this.data && this.data.expiryDate ? moment(this.data.expiryDate).format('MMM DD, YYYY') : '';
    },
    activationDate() {
      return this.data && this.data.activationDate ? moment(this.data.activationDate).format('MMM DD, YYYY') : '';
    },
    maxFileSize() {
      return formatBytes(this.data.maxFileSize || 0);
    },
    mailToOwner() {
      const data = this.data;
      
      return data.owner && data.owner.mail ? `mailto:${data.owner.mail}` : '';
    },
    ownerName() {
      const data = this.data;

      if (data.owner) {
        data.owner.firstName = data.owner.firstName || '';
        data.owner.lastName = data.owner.lastName || '';
        
        return `${data.owner.firstName} ${data.owner.lastName}`;
      }
      
      return '';
    }
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
      .home-page-request-details {
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
          padding: 20px 10px;
        }
        .request-details-user-info {
          display: flex;
          align-items: flex-start;
          .user-info-icon {
            width: 65px;
            height: 65px;
            padding: 15px;
            background-color: #F1F1F1;
            img {
              width: 35px;
              height: 35px;
            }
          }
          .user-info-content {
            margin-left: 25px;
            &-welcome {
              color: #5E5E5E;
              margin-bottom: 0;
              span {
                font-weight: 450;
              }
            }
            %-text {
              color: #5E5E5E;
              margin-bottom: 0;
            }
          }
        }
        .request-details-message {
          margin-top: 20px;
          padding-bottom: 30px;
          border-bottom: 1px solid #E2E2E2;
          .message-title {
            line-height: 16px;
            font-weight: 500;
            font-size: 17px;
            color: #5E5E5E;
            margin-bottom: 10px;
          }
          .message-content {
            font-size: 15px;
            color: #5E5E5E;
          }
        }
        .request-details-recipients {
          padding-bottom: 10px;
          border-bottom: 1px solid #E2E2E2;
          .recipient-list-title {
            line-height: 16px;
            font-weight: 500;
            font-size: 17px;
            color: #5E5E5E;
            margin-bottom: 10px;
          }
          .recipient-toggle-icon {
            color: #05B1FF;
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
          .metadata-title {
            line-height: 16px;
            font-weight: 500;
            font-size: 17px;
            color: #5E5E5E;
            margin-bottom: 10px;
          }
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
    } 
  }
</style>