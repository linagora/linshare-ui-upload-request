<template>
  <div>
    <Header>
      <UploadBar v-if="!uploadRequest.closed" />
    </Header>
    <div class="home-page">
      <div class="hidden-sm-and-down home-page-first-background" />
      <div class="home-page-content">
        <RequestDetails />
        <EntryList />
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
import { FlowService } from '@/services';
import { validateUpload } from '@/common';
import RequestDetails from './components/RequestDetails';
import EntryList from './components/EntryList';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    RequestDetails,
    EntryList,
    Header,
    Footer,
    UploadBar
  },
  computed: {
    ...mapGetters([
      'uploadRequest',
      'entries'
    ])
  },
  async created() {
    await this.fetchData();

    if (!this.uploadRequest.closed) {
      const flow = FlowService.getFlowObject();

      flow.on('filesSubmitted', () => flow.upload());

      flow.on('fileSuccess', (file, response) => {
        try {
          response = JSON.parse(response);
        } catch (e) {
          response = {};
        }

        if (!response.chunkUploadSuccess) {
          const errorMessage = this.$t(`UPLOAD_BAR.SERVER_RESPONSE.${response.errCode || 'NONE'}`);

          this.$alert.open(errorMessage, {type: 'error'});
        } else {
          this.$alert.open(this.$t('MESSAGE.UPLOAD_SUCCESS'), {type: 'success'});
          this.fetchData(true);
        }
      });

      flow.on('filesAdded', files => {
        const error = this.validateFileBeforeUpload(files);

        if (error) {
          this.$alert.open(error, { type: 'error' });
        }

        return !error;
      });
    }
  },
  methods: {
    async fetchData() {
      try {
        const requestId = this.$route.params.id;

        await this.$store.dispatch('fetchEntries', requestId);
      } catch (error) {
        this.$alert.open(this.$t(error.getMessage(), { errCode: error.getErrorCode() }), {
          type: 'error'
        });
      }
    },
    validateFileBeforeUpload(files) {
      return validateUpload(files, { ...this.uploadRequest, currentFiles: this.entries });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';

  .home-page {
    position: relative;
    background: url("../../assets/images/bandeau_accueil_linshare.svg");
    padding-bottom: 0;
    padding-top: 10px;


    .home-page-first-background {
      background-image: url("../../assets/images/bandeau_accueil_linshare.svg");
      background-size: cover;
      height: 350px;
    }

    .home-page-content {
      margin-left: auto;
      margin-right: auto;
      margin-top: 60px;
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page {
      padding-bottom: 20px;
      padding-top: 0;

      .home-page-content {
        width: 60%;
        margin-top: -275px;
      }
    }
  }
</style>

