export const state = () => ({
  books: [],
});

export const mutations = {
  setBooks(state, payload) {
    state.books = { ...payload };
  },
};

export const actions = {
  async nuxtServerInit({ commit }) {
    const { items } = await this.$contentful().getEntries({
      content_type: 'book',
      include: 2,
    });
    commit('setBooks', items);
  },
};
