<template>
  <div
    class="reader-wrapper"
    v-html="readerHtml"
  />
</template>

<script>
  export default {
    name: 'Reader',
    props: {
      readerHtml: {
        type: String,
        default: '',
      },
    },
    mounted() {
    },
  }
</script>

<style scoped>
  .reader-wrapper {
    margin-left: auto;
    margin-right: auto;
    width: 70vw;
    word-break: break-word;
    column-width: 100%;
    height: calc(90vh - 64px);
    overflow-x: auto;
    column-count: 2;
    display: block;
  }
</style>
