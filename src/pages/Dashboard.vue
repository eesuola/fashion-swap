<template>
  <div>
    <h2>Welcome, {{ user?.name }}</h2>
    <nav>
      <router-link to="/items">Items</router-link> |
      <router-link to="/swaps">Swap Requests</router-link> |
      <router-link to="/posts">Cultural Posts</router-link> |
      <router-link to="/messages">Messages</router-link> |
      <router-link to="/profile">Profile</router-link>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.$store.dispatch("fetchUser");
  },
};
</script>
