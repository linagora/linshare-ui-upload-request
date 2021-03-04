import { mount, config } from '@vue/test-utils';
import UploadItem from '@/components/UploadItem.vue';

config.mocks['$t'] = message => message;

describe('UploadItem.vue', () => {
  function mountFunction(propsData) {
    return mount(UploadItem, { propsData });
  }

  it('should render file name', () => {
    const wrapper = mountFunction({
      data: {
        name: 'unit-tests-are-awesome.pdf',
        progress: () => 1
      }
    });

    expect(wrapper.text()).toMatch('unit-tests-are-awesome.pdf');
  });

  it('should render formatted size', () => {
    const wrapper = mountFunction({
      data: {
        size: 1000,
        progress: () => 1
      }
    });

    expect(wrapper.text()).toMatch('1 KB');
  });

  describe('on pausing uploading file', () => {
    it('should show the pause icon', () => {
      const wrapper = mountFunction({
        data: { size: 1024, progress: () => 0.5 },
        completed: false,
        pause: false
      });
      const pauseButton = wrapper.find('.upload-item-actions-container .mdi-pause');

      expect(pauseButton.element).toBeVisible();
    });

    it('should emit pause event', async () => {
      const wrapper = mountFunction({
        data: { size: 1024, progress: () => 0.5 },
        completed: false,
        pause: false
      });
      const pauseButton = wrapper.find('.upload-item-actions-container .mdi-pause');

      await pauseButton.trigger('click');
      expect(wrapper.emitted('pause')).toHaveLength(1);
    });
  });
});