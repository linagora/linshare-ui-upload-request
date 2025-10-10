<template>
  <div>
    <theHeader>
      <UploadBar v-if="!uploadRequest.closed" />
    </theHeader>
    <div class="home-page">
      <div class="home-page-content">
        <RequestDetails />
        <EntryList />
      </div>
    </div>
    <theFooter />
    <AppAlert />
  </div>
</template>

<script>
import theHeader from '@/components/the-header';
import theFooter from '@/components/the-footer';
import UploadBar from '@/components/UploadBar';
import { FlowService } from '@/services';
import { validateUpload } from '@/common';
import RequestDetails from './components/RequestDetails';
import EntryList from './components/EntryList';
import { mapGetters } from 'vuex';

export default {
  name: 'TheHome',
  components: {
    RequestDetails,
    EntryList,
    theHeader,
    theFooter,
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
  @import '@/assets/variables.scss';


  .home-page {
    position: relative;
    background: url("../../assets/images/banner_homepage_linshare.png");
    background-color: $primary-color;
    padding-bottom: 0;
    padding-top: 10px;

    .home-page-content {
      margin-left: auto;
      margin-right: auto;
      margin-top: 60px;
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-up')} {
    .home-page {
      padding-bottom: 20px;

      .home-page-content {
        width: 60%;
      }
    }
  }
</style>

