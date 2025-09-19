<template>
  <div class="auth-page">
    <h2>Sign Up</h2>
    <form @submit.prevent="register">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <router-link to="/signin">Sign In</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return { name: "", email: "", password: "" };
  },
  methods: {
    async register() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
          }),
        });
        const data = await res.json();
        if (data.token) {
          this.$store.commit("setToken", data.token);
          this.$router.push("/dashboard");
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
