<template>
  <div>
    <h2>Profile</h2>
    <p><b>Name:</b> {{ user?.name }}</p>
    <p><b>Email:</b> {{ user?.email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/signin");
    },
  },
};
</script>
