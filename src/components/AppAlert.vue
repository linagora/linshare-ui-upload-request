<template>
  <v-alert
    v-model="isOpen"
    class="ls-alert"
    :type="alert.options.type"
    min-width="100"
    transition="slide-x-reverse-transition"
    dismissible
  >
    {{ alert.content }}
  </v-alert>
</template>

<script>
export default {
  data () {
    return {
      alert: this.$alert
    };
  },
  computed: {
    isOpen: {
      get(){
        return this.alert.isOpen;
      },
      set(value) {
        this.alert.isOpen = value;
      }
    }
  },
  watch: {
    isOpen: function(newIsOpen) {
      if (newIsOpen) {
        setTimeout(() => {
          this.alert.close();
        }, this.alert.options.duration * 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .ls-alert {
    position: fixed;
    z-index: 99;
    bottom: 20px;
    right: 20px;
  }
</style>