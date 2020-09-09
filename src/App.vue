<template>
  <v-app>
    <Header />
    <router-view />
    <Footer />
    <AppAlert />
  </v-app>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  }
};
</script>
