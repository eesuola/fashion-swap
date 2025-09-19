<template>
  <nav class="navbar">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/items">Items</router-link>
    <router-link to="/swaps">Swaps</router-link>
    <router-link to="/posts">Cultural Posts</router-link>
    <router-link to="/messages">Messages</router-link>
    <router-link to="/profile">Profile</router-link>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #2c3e50;
}
.navbar a {
  color: #fff;
  text-decoration: none;
}
.navbar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
