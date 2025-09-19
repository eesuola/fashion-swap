<template>
  <div>
    <h2>Cultural Posts</h2>
    <form @submit.prevent="addPost">
      <textarea v-model="content" placeholder="Share something..." required></textarea>
      <button type="submit">Post</button>
    </form>
    <div v-for="post in posts" :key="post.id">
      <p>{{ post.content }}</p>
      <small>By {{ post.user.name }}</small>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { content: "", posts: [] };
  },
  async created() {
    const res = await fetch("http://localhost:5000/api/posts");
    this.posts = await res.json();
  },
  methods: {
    async addPost() {
      await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.$store.state.token}`,
        },
        body: JSON.stringify({ content: this.content }),
      });
      this.content = "";
      this.created(); // refresh posts
    },
  },
};
</script>
