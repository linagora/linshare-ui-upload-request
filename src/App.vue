<template>
  <v-app>
    <router-view :key="$route.fullPath" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.title = this.$t('LINSHARE_UPLOAD_REQUEST');
  }
};
</script>
