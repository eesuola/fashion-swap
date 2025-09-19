<template>
  <div>
    <h2>Swap Requests</h2>
    <ul>
      <li v-for="swap in swaps" :key="swap.id">
        {{ swap.fromItem.title }} → {{ swap.toItem.title }} ({{ swap.status }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { swaps: [] };
  },
  async created() {
    const res = await fetch("http://localhost:5000/api/swaps/user", {
      headers: { Authorization: `Bearer ${this.$store.state.token}` },
    });
    this.swaps = await res.json();
  },
};
</script>
