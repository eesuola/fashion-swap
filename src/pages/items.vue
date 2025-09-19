<template>
  <div>
    <h2>Your Items</h2>
    <form @submit.prevent="addItem">
      <input v-model="title" placeholder="Item title" required />
      <input v-model="category" placeholder="Category" />
      <button type="submit">Add Item</button>
    </form>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.title }} - {{ item.status }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { title: "", category: "", items: [] };
  },
  async created() {
    await this.fetchItems();
  },
  methods: {
    async fetchItems() {
      const res = await fetch("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      });
      this.items = await res.json();
    },
    async addItem() {
      await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.$store.state.token}`,
        },
        body: JSON.stringify({ title: this.title, category: this.category }),
      });
      this.title = "";
      this.category = "";
      this.fetchItems();
    },
  },
};
</script>
