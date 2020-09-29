<template>
  <div class="home-page">
    <div class="home-page-first-background" />
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
      />
    </div>
  </div>
</template>

<script>
import { UploadRequestService, StorageService } from '@/services';
import { FlowService } from '@/services';
import { formatBytes, validateUpload } from '@/common';
import RequestDetails from './components/RequestDetails';
import EntryList from './components/EntryList';

export default {
  name: 'Home',
  components: {
    RequestDetails,
    EntryList,
  },
  data() {
    return {
      data: {},
      entries: [],
      selected: []
    };
  },
  async created() {
    const flow = FlowService.getFlowObject();

    await this.fetchData();

    flow.on('filesSubmitted', () => flow.upload());

    flow.on('fileSuccess', () => {
      this.$alert.open('The file has been uploaded successfully!', {type: 'success'});
      this.fetchData();
    });

    flow.on('fileAdded', file => {
      const error = validateUpload(file, { ...this.data, currentFiles: this.entries });

      if (!error) { return true; }

      this.$alert.open(error, { type: 'error' });
    });
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
        this.$alert.open(`${entries.length} entries have been deleted successfully!`, {
          type: 'success'
        });
      } catch (err) {
        this.$alert.open('Something went wrong! Please try again', {
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
        this.$alert.open('The entry has been deleted successfully!', {
          type: 'success'
        });
      } catch (err) {
        this.$alert.open('Something went wrong! Please try again', {
          type: 'error'
        });
      }
    },

    async fetchData() {
      const requestId = this.$route.params.id;
      const detailResponse = await UploadRequestService.getRequest(requestId);
      this.data = detailResponse.data;
      const entriesResponse = await UploadRequestService.getRequestEntries(requestId);
      this.entries = entriesResponse.data.length ? this.transformEntries(entriesResponse.data) : [];
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
    }
  },
  beforeRouteEnter(to, from, next) {
    const requestId = to.params.id;
    FlowService.initFlowObject({
      query: {
        requestUrlUuid: requestId,
        password: StorageService.getPassword(requestId) || ''
      }
    });

    next();
  }
};
</script>

<style lang="scss" scoped>
  .home-page {
    position: relative;
    min-height: 100vh;
    background-color: #E5E5E5;
    .home-page-first-background {
      background-image: url("../../assets/images/bandeau_accueil_linshare.svg");
      background-size: cover;
      height: 350px;
    }
    .home-page-content {
      margin-top: -300px;
      margin-left: auto;
      margin-right: auto;
      width: 60%;
    }
  }
</style>

