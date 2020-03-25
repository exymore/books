<template>
  <v-app-bar
    :collapse="!collapseOnScroll"
    :collapse-on-scroll="collapseOnScroll"
    absolute
    color="deep-purple accent-2"
    dark
  >
    <v-toolbar-title>Books</v-toolbar-title>
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

<style scoped></style>
