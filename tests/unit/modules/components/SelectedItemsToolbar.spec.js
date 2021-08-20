import Vuetify from 'vuetify';
import { mount, createLocalVue, config } from '@vue/test-utils';
import SelectedItemsToolbar from '@/modules/home/components/SelectedItemsToolbar.vue';

config.mocks['$t'] = message => message;
config.mocks['$tc'] = (message, length) => `${length} ${message}`;

describe('SelectedItemsToolbar.vue', () => {
  const localVue = createLocalVue();

  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should show toolbar if select a file', () => {
    const wrapper = mount(SelectedItemsToolbar, {
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

    expect(wrapper.find('.selected-items-toolbar').exists()).toBe(true);
  });

  it('should show toolbar if select multiple files', () => {
    const wrapper = mount(SelectedItemsToolbar, {
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

    expect(wrapper.find('.selected-items-toolbar').exists()).toBe(true);
  });

  it.only('should hide toolbar if no file was selected', () => {
    const wrapper = mount(SelectedItemsToolbar, {
      localVue,
      vuetify,
      propsData: {
        selected: [],
        showSelectedItems: false
      }
    });

    expect(wrapper.find('.selected-items-toolbar').element).not.toBeVisible();
  });

  it('should show number of files selected', () => {
    const wrapper = mount(SelectedItemsToolbar, {
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