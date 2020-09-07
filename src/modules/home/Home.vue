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
      />
    </div>
  </div>
</template>

<script>
import { UploadRequestService } from '@/services';
import { FlowService } from '@/services';
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
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    editItem() {},
    deleteItem() {},
    async fetchData() {
      const requestId = this.$route.params.id;
      const detailResponse = await UploadRequestService.getRequest(requestId);
      this.data = detailResponse.data;
      const entriesResponse = await UploadRequestService.getRequestEntries(requestId);
      this.entries = entriesResponse.data;
    }
  },
  beforeRouteEnter(to, from, next) {
    FlowService.initFlowObject({
      query: {
        requestUrlUuid: to.params.id,
        password: ''
      }
    });

    const flow = FlowService.getFlowObject();

    flow.on('filesSubmitted', () => flow.upload());

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

