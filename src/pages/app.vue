<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <main>
      <router-view />
    </main>
    <Footer v-if="showNavbar" />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  components: { Navbar, Footer },
  computed: {
    // Hide navbar/footer on login/signup pages
    showNavbar() {
      return !["/signin", "/signup"].includes(this.$route.path);
    },
  },
};
</script>

<style>
main {
  padding: 2rem;
  margin-bottom: 4rem; /* space for footer */
}
</style>
