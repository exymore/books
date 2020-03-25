<template>
  <v-app>
    <toolbar />
    <v-content class="content">
      <nuxt class="fluid pa-0" />
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from '../components/Toolbar';
import { VApp, VContent } from 'vuetify/lib';
export default {
  components: {
    VApp,
    VContent,
    Toolbar,
  },
};
</script>

<style scoped>
  .content {
    padding: 80px 20px 20px !important;
  }
</style>
