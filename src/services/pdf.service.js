// Load the renderer only when a preview is opened. PDF.js is independent of Vue.
export async function createPdfViewer(container, onPageChange, onPassword) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // The official viewer reads globalThis.pdfjsLib, initialized by the core module.
  const { EventBus, PDFViewer, PDFLinkService, PDFFindController, LinkTarget } = await import('pdfjs-dist/legacy/web/pdf_viewer.mjs');
  const assetsUrl = new URL(`${process.env.BASE_URL}pdfjs/`, document.baseURI).href;

  pdfjs.GlobalWorkerOptions.workerSrc = `${assetsUrl}pdf.worker.min.js`;

  const eventBus = new EventBus();
  const abortController = new AbortController();
  const linkService = new PDFLinkService({
    eventBus,
    externalLinkTarget: LinkTarget.BLANK,
    externalLinkRel: 'noopener noreferrer nofollow'
  });
  const findController = new PDFFindController({ eventBus, linkService });
  const viewer = new PDFViewer({
    container,
    eventBus,
    linkService,
    findController,
    // Never create a PDFScriptingManager: deposited documents must not run scripts.
    scriptingManager: null,
    annotationMode: pdfjs.AnnotationMode.ENABLE,
    imageResourcesPath: `${assetsUrl}images/`,
    abortSignal: abortController.signal
  });

  linkService.setViewer(viewer);

  const onPagesInit = () => { viewer.currentScaleValue = 'page-width'; };
  const onPageChanging = ({ pageNumber }) => onPageChange(pageNumber);

  eventBus.on('pagesinit', onPagesInit);
  eventBus.on('pagechanging', onPageChanging);

  let loadingTask;
  let documentId = 0;
  let destroyed = false;

  function clearDocument() {
    documentId++;
    viewer.setDocument(null);
    linkService.setDocument(null);

    const task = loadingTask;

    loadingTask = undefined;

    return task ? task.destroy() : Promise.resolve();
  }

  return {
    async load(data) {
      const previousTask = clearDocument();
      const currentId = documentId;

      await previousTask;
      if (destroyed || currentId !== documentId) {
        return;
      }

      const task = pdfjs.getDocument({
        // The worker transfers this buffer. Keep the original reusable for a new preview.
        data: new Uint8Array(data.slice(0)),
        cMapUrl: `${assetsUrl}cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `${assetsUrl}standard_fonts/`,
        wasmUrl: `${assetsUrl}wasm/`,
        enableXfa: false
      });

      loadingTask = task;
      task.onPassword = (submit, reason) => {
        if (!destroyed && currentId === documentId) {
          onPassword(submit, reason === pdfjs.PasswordResponses.INCORRECT_PASSWORD);
        }
      };

      let pdfDocument;

      try {
        pdfDocument = await task.promise;
      } catch (error) {
        if (currentId === documentId) { await clearDocument(); }
        throw error;
      }

      if (destroyed || currentId !== documentId) {
        return;
      }

      linkService.setDocument(pdfDocument);
      viewer.setDocument(pdfDocument);

      return pdfDocument.numPages;
    },
    setPage(pageNumber) {
      if (Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= viewer.pagesCount) {
        viewer.currentPageNumber = pageNumber;
      }
    },
    zoomIn() { viewer.increaseScale(); },
    zoomOut() { viewer.decreaseScale(); },
    fitWidth() { viewer.currentScaleValue = 'page-width'; },
    rotate() { viewer.pagesRotation = (viewer.pagesRotation + 90) % 360; },
    find(query, previous = false, again = false) {
      eventBus.dispatch('find', {
        source: viewer,
        type: again ? 'again' : '',
        query,
        caseSensitive: false,
        entireWord: false,
        highlightAll: true,
        findPrevious: previous,
        matchDiacritics: false
      });
    },
    cancel: clearDocument,
    destroy() {
      if (destroyed) { return Promise.resolve(); }
      destroyed = true;

      const pending = clearDocument();

      eventBus.off('pagesinit', onPagesInit);
      eventBus.off('pagechanging', onPageChanging);
      abortController.abort();

      return pending;
    }
  };
}
