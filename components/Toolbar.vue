<template>
  <v-app-bar
    :collapse="!collapseOnScroll"
    :collapse-on-scroll="collapseOnScroll"
    absolute
    color="cyan darken-2"
    dark
  >
    <nuxt-link
      to="/"
      class="nav"
    >
      <v-toolbar-title>Books Learn</v-toolbar-title>
    </nuxt-link>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Toolbar',
  data: () => ({
    collapseOnScroll: true,
  }),
};
</script>

<style scoped>
  .nav {
    color: #FFFFFF;
    font-weight: bold;
    text-decoration: none;
  }
</style>
