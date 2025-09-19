<template>
  <div class="auth-page">
    <h2>Sign In</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
    <p>Don’t have an account? <router-link to="/signup">Sign Up</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async login() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        const data = await res.json();
        if (data.token) {
          this.$store.commit("setToken", data.token);
          this.$router.push("/dashboard");
        } else {
          alert(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
