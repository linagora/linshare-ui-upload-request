import Vue from 'vue';
import AppAlert from '@/components/AppAlert';

const module = {
  install (Vue) {
    Vue.component('AppAlert', AppAlert);
    
    Vue.prototype.$alert = {
      isOpen: false,
      content: '',
      options: {
        type: 'info',
        duration: 2
      },
      open (content, options) {
        this.content = content;
        this.options = Object.assign(this.options, options);
        this.isOpen = true;
      },
      close () {
        this.isOpen = false;
      }
    };
  }
}

Vue.use(module);