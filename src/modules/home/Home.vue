<template>
  <div>
    <Header>
      <UploadBar :validate-file-before-upload="validateFileBeforeUpload" />
    </Header>
    <div class="home-page">
      <div class="hidden-sm-and-down home-page-first-background" />
      <div class="home-page-content">
        <RequestDetails
          :data="data"
          :entries="entries"
        />
        <EntryList
          :data="data"
          :entries="entries"
          :selected="selected"
          @deleteMultipleEntries="deleteMultipleEntries"
          @deleteSingleEntry="deleteSingleEntry"
          @changeSelected="changeSelected"
          @closeUploadRequest="closeUploadRequest"
        />
      </div>
    </div>
    <Footer />
    <AppAlert />
  </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadBar from '@/components/UploadBar';
import { UploadRequestService } from '@/services';
import { FlowService } from '@/services';
import { formatBytes, validateUpload } from '@/common';
import RequestDetails from './components/RequestDetails';
import EntryList from './components/EntryList';
import { UploadRequestStore } from '@/store';

export default {
  name: 'Home',
  components: {
    RequestDetails,
    EntryList,
    Header,
    Footer,
    UploadBar
  },
  data() {
    return {
      data: {},
      entries: [],
      selected: []
    };
  },
  async created() {
    await this.fetchData();

    if (!this.data.closed) {
      const flow = FlowService.getFlowObject();

      flow.on('filesSubmitted', () => flow.upload());

      flow.on('fileSuccess', (file, response) => {
        try {
          response = JSON.parse(response);
        } catch (e) {
          response = {};
        }

        if (!response.chunkUploadSuccess) {
          this.$alert.open(this.$t('MESSAGE.SOMETHING_WENT_WRONG'), {type: 'error'});
        } else {
          this.$alert.open(this.$t('MESSAGE.UPLOAD_SUCCESS'), {type: 'success'});
          this.fetchData(true);
        }
      });

      flow.on('fileAdded', file => {
        const error = this.validateFileBeforeUpload(file);

        if (error) {
          this.$alert.open(error, { type: 'error' });
        }

        return !error;
      });
    }
  },
  methods: {
    async deleteMultipleEntries(entries) {
      const requestId = this.$route.params.id;

      try {
        await Promise.all(entries.map(entry =>
          UploadRequestService.deleteEntry(requestId, entry.uuid)
        ));
        this.entries = this.entries.filter(entry => entries.map(deletedEntry => deletedEntry.uuid).indexOf(entry.uuid) < 0);
        this.selected = [];
        this.$alert.open(this.$t('MESSAGE.DELETE_ENTRIES_SUCCESS', {length: entries.length}), {
          type: 'success'
        });
      } catch (err) {
        this.$alert.open(this.$t('MESSAGE.SOMETHING_WENT_WRONG'), {
          type: 'error'
        });
      }
    },

    async deleteSingleEntry(id) {
      const requestId = this.$route.params.id;

      try {
        await UploadRequestService.deleteEntry(requestId, id);
        this.entries = this.entries.filter(entry => entry.uuid !== id);
        this.selected = this.selected.filter(entry => entry.uuid !== id);
        this.$alert.open(this.$t('MESSAGE.DELETE_ENTRY_SUCCESS'), {
          type: 'success'
        });
      } catch (err) {
        this.$alert.open(this.$t('MESSAGE.SOMETHING_WENT_WRONG'), {
          type: 'error'
        });
      }
    },

    async fetchData(forceNewFetch) {
      try {
        const requestId = this.$route.params.id;
        const uploadRequest = await UploadRequestStore.fetch(requestId, forceNewFetch);
        const entriesResponse = await UploadRequestService.getRequestEntries(requestId);

        this.data = uploadRequest;
        this.entries = entriesResponse.data.length ? this.transformEntries(entriesResponse.data) : [];
      } catch (err) {
        this.$alert.open(this.$t('MESSAGE.SOMETHING_WENT_WRONG'), {
          type: 'error'
        });
      }
    },

    async closeUploadRequest() {
      const requestId = this.$route.params.id;

      try {
        await UploadRequestService.updateRequest(requestId, {
          ...this.data,
          closed: true
        });
        window.location.reload();
      } catch (error) {
        this.$alert.open(this.$t('MESSAGE.SOMETHING_WENT_WRONG'), {
          type: 'error'
        });
      }
    },

    changeSelected(newSelected) {
      this.selected = newSelected;
    },

    transformEntries(data) {
      return data.map(entry => {
        entry.originalSize = entry.size;
        entry.size = formatBytes(entry.size);

        return entry;
      });
    },

    validateFileBeforeUpload(file) {
      return validateUpload(file, { ...this.data, currentFiles: this.entries });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';

  .home-page {
    position: relative;
    background: url("../../assets/images/bandeau_accueil_linshare.svg");
    padding-bottom: 20px;

    .home-page-first-background {
      background-image: url("../../assets/images/bandeau_accueil_linshare.svg");
      background-size: cover;
      height: 350px;
    }

    .home-page-content {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page {
      background: none;
      background-color: #E5E5E5;

      .home-page-content {
        width: 60%;
        margin-top: -300px;
      }
    }
  }
</style>

