<template>
  <reader :readerHtml="bookHTML.value" />
</template>

<script>
  import Reader from '../../components/Reader'
  import axios from 'axios';
  import DBApi from '@/api/idb';

  export default {
    components: {
      Reader,
    },
    data() {
      return {
        book: null,
        bookHTML: {
          id: null,
          value: null,
          },
      };
    },
    async mounted() {
      this.book = this.$store.state.books.find(book => book.sys.id === this.$route.params.slug);
      const bookFromDB = await DBApi.getByKey(this.book.sys.id);
      if (!bookFromDB) {
        const procceededHTML = await this.getHTMLUrl()
            .then(URL => this.downloadBook(URL))
            .then(HTML => this.processDocument(HTML));
        await DBApi.save({ id: this.book.sys.id, value: procceededHTML });
      }
      this.bookHTML = await DBApi.getByKey(this.book.sys.id);
    },
    methods: {
      async downloadBook(bookURL) {
        const options = {
          method: 'GET',
          url: bookURL,
        };
        const { data } = await axios(options);
        return data;
      },
      async getHTMLUrl() {
        const storageHTMLRef = this.$fireStorage.ref().child(`${this.book.fields.bookUrl}/index.html`);
        const bookURL = await storageHTMLRef.getDownloadURL();
        return bookURL;
      },
      async getCSSUrl() {
        const storageStylingRef = this.$fireStorage.ref().child(`${this.book.fields.bookUrl}/style.css`);
        const cssUrl = await storageStylingRef.getDownloadURL();
        return cssUrl;
      },
      async getImageUrl(imgName) {
        const storageImageRef = this.$fireStorage.ref().child(`${this.book.fields.bookUrl}/images/${imgName}`);
        const imgUrl = await storageImageRef.getDownloadURL();
        return imgUrl;
      },
      async processDocument(HTML) {
        const srcRegex = new RegExp('src\s*=\s*"(.+?)"', "g");
        const replaceSrc = async match => {
          const imgName = match.slice(0, -1).replace('src="images/', '');
          const imageUrl = await this.getImageUrl(imgName);
          return match.replace(`images/${imgName}`, imageUrl);
        };

        // const HTMLWithInjectedStyles = HTML.replace('href="style.css"', `href="${await this.getCSSUrl()}"`);
        return await this.replaceAsync(HTML, srcRegex, replaceSrc)
      },
      async replaceAsync(str, regex, fn) {
          const promises = [];
          str.replace(regex, (match, ...args) => {
          const promise = fn(match, ...args);
          promises.push(promise);
        });
        const data = await Promise.all(promises);
        return str.replace(regex, () => data.shift());
    },
  },
}
</script>

<style scoped>
</style>
