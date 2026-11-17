<template>
  <div class="pdf-container">
    <div
      class="pdf-toolbar"
      role="toolbar"
      :aria-label="$t('PDF.CONTROLS')"
    >
      <v-btn
        icon
        small
        :disabled="loading || pageNumber <= 1"
        :aria-label="$t('PDF.PREVIOUS_PAGE')"
        @click="setPage(pageNumber - 1)"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <input
        class="pdf-page-number"
        type="number"
        min="1"
        :max="pageCount"
        :value="pageNumber"
        :disabled="loading || !pageCount"
        :aria-label="$t('PDF.PAGE')"
        @change="setPage(Number($event.target.value))"
        @keydown.enter.prevent="setPage(Number($event.target.value))"
      >
      <span class="pdf-page-count">/ {{ pageCount }}</span>
      <v-btn
        icon
        small
        :disabled="loading || pageNumber >= pageCount"
        :aria-label="$t('PDF.NEXT_PAGE')"
        @click="setPage(pageNumber + 1)"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        :disabled="loading || !pageCount"
        :aria-label="$t('PDF.ZOOM_OUT')"
        @click="viewerAction('zoomOut')"
      >
        <v-icon>mdi-magnify-minus-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        :disabled="loading || !pageCount"
        :aria-label="$t('PDF.ZOOM_IN')"
        @click="viewerAction('zoomIn')"
      >
        <v-icon>mdi-magnify-plus-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        :disabled="loading || !pageCount"
        :aria-label="$t('PDF.FIT_WIDTH')"
        @click="viewerAction('fitWidth')"
      >
        <v-icon>mdi-fit-to-page-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        :disabled="loading || !pageCount"
        :aria-label="$t('PDF.ROTATE')"
        @click="viewerAction('rotate')"
      >
        <v-icon>mdi-rotate-right</v-icon>
      </v-btn>
      <input
        v-model="search"
        class="pdf-search"
        type="search"
        :placeholder="$t('HOME.SEARCH')"
        :aria-label="$t('PDF.SEARCH')"
        :disabled="loading || !pageCount"
        @input="find()"
        @keydown.enter.prevent="find($event.shiftKey, true)"
      >
      <v-btn
        icon
        small
        :disabled="loading || !search"
        :aria-label="$t('PDF.PREVIOUS_MATCH')"
        @click="find(true, true)"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        :disabled="loading || !search"
        :aria-label="$t('PDF.NEXT_MATCH')"
        @click="find(false, true)"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <div
      class="pdf-viewport"
      :aria-busy="loading"
    >
      <div
        ref="viewerContainer"
        class="pdf-viewer-container"
        tabindex="0"
        :aria-label="$t('PDF.DOCUMENT')"
      >
        <div class="pdfViewer" />
      </div>
      <div
        v-if="loading && !failed"
        class="pdf-status"
        role="status"
      >
        <v-progress-circular
          indeterminate
          color="white"
          :aria-label="$t('HOME.LOADING_PREVIEW')"
        />
      </div>
      <PreviewUnavailable
        v-if="failed"
        class="pdf-status"
      />
    </div>
    <v-dialog
      v-model="passwordDialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title>{{ $t('PDF.PASSWORD') }}</v-card-title>
        <v-card-text>
          <form
            id="pdf-password-form"
            @submit.prevent="submitPassword"
          >
            <v-text-field
              v-model="password"
              type="password"
              autofocus
              :label="$t('PASSWORD.ENTER_PASSWORD')"
              :error-messages="incorrectPassword ? [$t('MESSAGE.INCORRECT_PASSWORD')] : []"
            />
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="cancelPassword"
          >
            {{ $t('HOME.CANCEL') }}
          </v-btn>
          <v-btn
            text
            type="submit"
            form="pdf-password-form"
          >
            {{ $t('PASSWORD.CONFIRM') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createPdfViewer } from '@/services/pdf.service';
import PreviewUnavailable from './PreviewUnavailable.vue';
import 'pdfjs-dist/web/pdf_viewer.css';

export default {
  name: 'PreviewPDF',
  components: { PreviewUnavailable },
  props: { pdf: ArrayBuffer },
  data() {
    return {
      loading: true,
      failed: false,
      pageNumber: 1,
      pageCount: 0,
      search: '',
      passwordDialog: false,
      password: '',
      incorrectPassword: false
    };
  },
  watch: {
    pdf() { this.loadPdf(); }
  },
  created() {
    // Keep PDF.js instances out of Vue 2's observation of their internal state.
    this._viewerReady = null;
    this._pdfViewer = null;
    this._loadId = 0;
    this._closed = false;
    this._submitPassword = null;
  },
  mounted() {
    this._viewerReady = createPdfViewer(
      this.$refs.viewerContainer,
      pageNumber => { this.pageNumber = pageNumber; },
      (submit, incorrect) => {
        this._submitPassword = submit;
        this.incorrectPassword = incorrect;
        this.passwordDialog = true;
      }
    );
    this.loadPdf();
  },
  beforeDestroy() {
    this._closed = true;
    this._loadId++;
    this.passwordDialog = false;
    this.password = '';
    this._submitPassword = null;
    this.releaseViewer();
  },
  methods: {
    async loadPdf() {
      const loadId = ++this._loadId;

      this.loading = true;
      this.failed = false;
      this.pageNumber = 1;
      this.pageCount = 0;
      this.search = '';
      this.passwordDialog = false;
      this.password = '';
      this._submitPassword = null;

      try {
        const viewer = await this._viewerReady;

        if (this._closed || loadId !== this._loadId) { return; }
        this._pdfViewer = viewer;

        const pageCount = await viewer.load(this.pdf);

        if (this._closed || loadId !== this._loadId) { return; }
        this.pageCount = pageCount;
        this.loading = false;
      } catch (error) {
        if (this._closed || loadId !== this._loadId) { return; }
        this.failed = true;
        this.loading = false;
        this.passwordDialog = false;
      }
    },
    releaseViewer() {
      this._pdfViewer = null;
      if (this._viewerReady) {
        this._viewerReady.then(viewer => viewer.destroy()).catch(() => {
          // Loading errors are displayed in the preview; closing must always succeed.
        });
      }
    },
    setPage(pageNumber) {
      if (this._pdfViewer && pageNumber >= 1 && pageNumber <= this.pageCount) {
        this._pdfViewer.setPage(pageNumber);
      }
    },
    viewerAction(action) {
      if (this._pdfViewer) { this._pdfViewer[action](); }
    },
    find(previous = false, again = false) {
      if (this._pdfViewer) { this._pdfViewer.find(this.search, previous, again); }
    },
    submitPassword() {
      if (this._submitPassword) { this._submitPassword(this.password); }
      this.password = '';
      this.passwordDialog = false;
    },
    cancelPassword() {
      this._loadId++;
      this.passwordDialog = false;
      this.password = '';
      this._submitPassword = null;
      this.failed = true;
      this.loading = false;
      if (this._pdfViewer) {
        this._pdfViewer.cancel().catch(() => {
          // The canceled loading task is also handled by loadPdf.
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .pdf-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .pdf-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    color: #fff;
    background: #323639;

    .v-btn { color: inherit; }
  }

  .pdf-page-number,
  .pdf-search {
    padding: 4px 8px;
    color: #111;
    background: #fff;
    border-radius: 3px;
  }

  .pdf-page-number { width: 64px; }
  .pdf-page-count { margin-right: 4px; }
  .pdf-search { flex: 1; min-width: 100px; width: 140px; }

  .pdf-viewport { position: relative; flex: 1; min-height: 0; }
  .pdf-viewer-container { position: absolute; inset: 0; overflow: auto; background: #525659; }
  .pdf-status { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #525659; }
</style>
