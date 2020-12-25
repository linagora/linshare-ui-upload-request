import Vuetify from 'vuetify';
import { mount, createLocalVue, config } from '@vue/test-utils';
import Toolbar from '@/modules/home/components/Toolbar.vue';

config.mocks['$t'] = message => message;
config.mocks['$tc'] = (message, length) => `${length} ${message}`;

describe('Toolbar.vue', () => {
  const localVue = createLocalVue();

  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should show toolbar if select a file', () => {
    const wrapper = mount(Toolbar, {
      localVue,
      vuetify,
      propsData: {
        selected: [{
          name: 'linshare-vo-dich.png',
          recipient: {
            mail: 'bnpham@linagora.com'
          }
        }],
        showSelectedItems: false
      }
    });

    expect(wrapper.find('.home-page-upload-toolbar-multiple-visible').exists()).toBe(true);
  });

  it('should show toolbar if select multiple files', () => {
    const wrapper = mount(Toolbar, {
      localVue,
      vuetify,
      propsData: {
        selected: [
          {
            name: 'linshare-vo-dich.png',
            recipient: {
              mail: 'bnpham@linagora.com'
            }
          },
          {
            name: 'linshare-vo-dich-2.png',
            recipient: {
              mail: 'bnpham@linagora.com'
            }
          }
        ],
        showSelectedItems: false
      }
    });

    expect(wrapper.find('.home-page-upload-toolbar-multiple-visible').exists()).toBe(true);
  });

  it('should hide toolbar if no file was selected', () => {
    const wrapper = mount(Toolbar, {
      localVue,
      vuetify,
      propsData: {
        selected: [],
        showSelectedItems: false
      }
    });

    expect(wrapper.find('.home-page-upload-toolbar-multiple-visible').exists()).toBe(false);
  });

  it('should show number of files selected', () => {
    const wrapper = mount(Toolbar, {
      localVue,
      vuetify,
      propsData: {
        selected: [
          {
            name: 'linshare-vo-dich.png',
            recipient: {
              mail: 'bnpham@linagora.com'
            }
          },
          {
            name: 'linshare-vo-dich-2.png',
            recipient: {
              mail: 'bnpham@linagora.com'
            }
          }
        ],
        showSelectedItems: false
      }
    });

    expect(wrapper.find('.toolbar-title-button span').text()).toMatch('2');
  });
});