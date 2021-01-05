import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue, config } from '@vue/test-utils';
import EntryList from '@/modules/home/components/EntryList.vue';

config.mocks['$t'] = message => message;

describe('Entrylist.vue', () => {
  const localVue = createLocalVue();

  localVue.use(Vuex);

  let vuetify, store, getters;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should show entry uploader mail on the table if upload request is collective', () => {
    getters = {
      uploadRequest: () => ({
        collective: true,
        closed: false
      }),
      entries: () => [{
        name: 'linshare-vo-dich.png',
        recipient: {
          mail: 'bnpham@linagora.com'
        }
      }]
    };

    store = new Vuex.Store({
      getters
    });

    const wrapper = mount(EntryList, {
      localVue,
      vuetify,
      store
    });

    expect(wrapper.find('.v-list-item__subtitle').text()).toMatch('bnpham@linagora.com');
  });

  it('should not show entry uploader mail on the table if upload request is not collective', () => {
    getters = {
      uploadRequest: () => ({
        collective: false,
        closed: false
      }),
      entries: () => [{
        name: 'linshare-vo-dich.png',
        recipient: {
          mail: 'bnpham@linagora.com'
        }
      }]
    };

    store = new Vuex.Store({
      getters
    });

    const wrapper = mount(EntryList, {
      localVue,
      vuetify,
      store
    });

    expect(wrapper.find('.v-list-item__subtitle').exists()).toBe(false);
  });
});