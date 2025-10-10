import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue, config } from '@vue/test-utils';
import CloseButton from '@/modules/home/components/CloseButton.vue';

config.mocks['$t'] = message => message;

describe('CloseButton.vue', () => {
  const localVue = createLocalVue();

  localVue.use(Vuex);

  let vuetify, store, getters;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('should display if upload request is not closed', () => {
    getters = {
      uploadRequest: () => ({
        closed: false,
        canClose: true
      })
    };

    store = new Vuex.Store({
      getters
    });

    const wrapper = mount(CloseButton, {
      localVue,
      vuetify,
      store
    });

    expect(wrapper.find('.close-button').exists()).toBe(true);
  });

  it('should hide if upload request is closed before', () => {
    getters = {
      uploadRequest: () => ({
        closed: true,
        canClose: false
      })
    };

    store = new Vuex.Store({
      getters
    });

    const wrapper = mount(CloseButton, {
      localVue,
      vuetify,
      store
    });

    expect(wrapper.find('.close-button').exists()).toBe(false);
  });

  it('should display and show CLOSED right after click to close', () => {
    getters = {
      uploadRequest: () => ({
        closed: false,
        canClose: true
      })
    };

    store = new Vuex.Store({
      getters
    });

    const wrapper = mount(CloseButton, {
      localVue,
      vuetify,
      store,
      computed: {
        isClosed() {
          return true;
        }
      }
    });

    expect(wrapper.find('.close-button').exists()).toBe(true);
    expect(wrapper.find('.close-button span').text()).toMatch('HOME.CLOSED');
  });
});