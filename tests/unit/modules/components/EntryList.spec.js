import Vuetify from 'vuetify';
import { mount, createLocalVue, config } from '@vue/test-utils';
import EntryList from '@/modules/home/components/EntryList.vue';

config.mocks['$t'] = message => message;

describe('Entrylist.vue', () => {
  const localVue = createLocalVue();

  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should show entry uploader mail on the table if upload request is collective', () => {
    const wrapper = mount(EntryList, {
      localVue,
      vuetify,
      propsData: {
        data: {
          collective: true,
          closed: false
        },
        entries: [{
          name: 'linshare-vo-dich.png',
          recipient: {
            mail: 'bnpham@linagora.com'
          }
        }]
      }
    });

    expect(wrapper.find('.v-list-item__subtitle').text()).toMatch('bnpham@linagora.com');
  });

  it('should not show entry uploader mail on the table if upload request is not collective', () => {
    const wrapper = mount(EntryList, {
      localVue,
      vuetify,
      propsData: {
        data: {
          collective: false,
          closed: false
        },
        entries: [{
          name: 'linshare-vo-dich.png',
          recipient: {
            mail: 'bnpham@linagora.com'
          }
        }]
      }
    });

    expect(wrapper.find('.v-list-item__subtitle').exists()).toBe(false);
  });
});