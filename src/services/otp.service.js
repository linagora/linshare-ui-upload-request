import { UploadRequestService } from './api.service';

export const OtpService = {
  getOtp(requestId, item) {
    return UploadRequestService.getOtp({ requestUrlUuid: requestId, entryUuid: item.uuid })
      .then(response => response.data);
  },
  downloadWithOtp(requestId, item, otp) {
    return UploadRequestService.download(requestId, item.uuid, otp.otpPassword, {})
      .then(response => response.data);
  }
};
