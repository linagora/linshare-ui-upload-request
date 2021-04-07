import APP_CONFIGS from '@/config';

const configs = {
  ...window.APP_CONFIGS,
  ...APP_CONFIGS
};

export const ConfigService = {
  get: () => configs
};
