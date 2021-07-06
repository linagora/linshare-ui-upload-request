import { UploadRequestService } from './api.service';

export const PREVIEW_MODES = {
  IMAGE: 'image',
  PDF: 'pdf',
  OTHER: 'other'
};

export const ThumbnailService = {
  getPreviewMode: (item) => {
    const documentMimeType = item.mimeType || item.type;


    if (documentMimeType.indexOf('image/') !== -1) {
      return PREVIEW_MODES.IMAGE;
    }

    if (documentMimeType.indexOf('application/pdf') !== -1) {
      return PREVIEW_MODES.PDF;
    }

    return PREVIEW_MODES.OTHER;
  },

  getPreview(item) {
    const mode = ThumbnailService.getPreviewMode(item);

    if (mode === PREVIEW_MODES.PDF) {
      return UploadRequestService.download(item.uuid, {responseType: 'arraybuffer'})
        .then(response => response.data);
    }

    if (mode === PREVIEW_MODES.IMAGE) {
      return UploadRequestService.getThumbnail(item.uuid, { type: 'LARGE', base64: true })
        .then(response => response.data);
    }

    if (mode === PREVIEW_MODES.OTHER) {
      return UploadRequestService.getThumbnail(item.uuid, { type: 'PDF', base64: false, options: { responseType: 'arraybuffer' }})
        .then(response => response.data);
    }
  }
};