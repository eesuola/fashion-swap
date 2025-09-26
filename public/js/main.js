const API_BASE = "https://fashion-swap-production.up.railway.app";

// Save and get JWT
function saveToken(token) {
  localStorage.setItem("token", token);
}
function getToken() {
  return localStorage.getItem("token");
}

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      document.getElementById("signupMsg").innerText = " Registered!";
      console.log(res.data);
    } catch (err) {
      document.getElementById("signupMsg").innerText =
        " " + (err.response?.data?.error || err.message);
    }
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      email: loginForm.email.value,
      password: loginForm.password.value,
    };
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, data);
      saveToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } catch (err) {
      document.getElementById("loginMsg").innerText =
        " " + (err.response?.data?.error || err.message);
    }
  });
}

// ================= CREATE POST =================
const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(postForm);
    try {
      const res = await axios.post(`${API_BASE}/api/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(" Post created!");
      console.log(res.data);
    } catch (err) {
      alert(" Failed: " + (err.response?.data?.error || err.message));
    }
  });
}

// ================= LOAD POSTS =================
const loadPostsBtn = document.getElementById("loadPosts");
if (loadPostsBtn) {
  loadPostsBtn.addEventListener("click", async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/post`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const postsDiv = document.getElementById("posts");
      postsDiv.innerHTML = res.data
        .map(
          (p) => `
        <div>
          <h4>${p.title}</h4>
          <p>${p.outfitType}</p>
          <p>${p.likesCount}</p>
          <p>${p.region}</p>
          <p>${p.story}</p>
          <small>By: ${p.author?.name || "Unknown"}</small>
          
        </div>
      `
        )
        .join("");
    } catch (err) {
      alert(" Failed to load posts");
    }
  });
}

// ================= CREATE ITEM =================
const itemForm = document.getElementById("itemForm");
if (itemForm) {
  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(itemForm);
    try {
      const res = await axios.post(`${API_BASE}/api/items/create`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(" Item created!");
    } catch (err) {
      alert(" Failed: " + (err.response?.data?.error || err.message));
    }
  });
}

// ================= LOAD ITEMS =================
const loadItemsBtn = document.getElementById("loadItems");
if (loadItemsBtn) {
  loadItemsBtn.addEventListener("click", async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/items/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      document.getElementById("items").innerHTML = res.data
        .map(
          (i) => `
        <div>
          <h4>${i.title}</h4>
          <p>${i.description}</p>
          <small>Status: ${i.status}</small>
          <small>Category: ${i.category}</small>
          <small>Type: ${i.type}</small>
           ${
             i.photos && i.photos.length > 0
               ? `<img src="http://localhost:8000/${i.photos[0]}" width="150"/>`
               : ""
           }
        </div>
      `
        )
        .join("");
    } catch {
      alert(" Failed to load items");
    }
  });
}

// ================= SEND SWAP =================
const swapForm = document.getElementById("swapForm");
if (swapForm) {
  swapForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      fromItemId: swapForm.fromItemId.value,
      toItemId: swapForm.toItemId.value,
      toUserId: swapForm.toUserId.value,
    };
    try {
      await axios.post(`${API_BASE}/api/swaps/create`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert(" Swap request sent!");
    } catch (err) {
      alert(" " + (err.response?.data?.error || err.message));
    }
  });
}

// ================= LOAD SWAPS =================
const loadSwapsBtn = document.getElementById("loadSwaps");
if (loadSwapsBtn) {
  loadSwapsBtn.addEventListener("click", async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/swaps`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      document.getElementById("swaps").innerHTML = res.data
        .map(
          (s) => `
        <div>
          <p>Swap from ${s.fromUser?.name} to ${s.toUser?.name}</p>
          <p>Status: ${s.status}</p>
        </div>
      `
        )
        .join("");
    } catch {
      alert(" Failed to load swaps");
    }
  });
}

// ================= SEND MESSAGE =================
const messageForm = document.getElementById("messageForm");
if (messageForm) {
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      toUserId: messageForm.toUserId.value,
      content: messageForm.content.value,
    };
    try {
      await axios.post(`${API_BASE}/api/messages/send`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert(" Message sent!");
    } catch (err) {
      alert(" " + (err.response?.data?.error || err.message));
    }
  });
}

// ================= LOAD MESSAGES =================
const loadMessagesBtn = document.getElementById("loadMessages");
if (loadMessagesBtn) {
  loadMessagesBtn.addEventListener("click", async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages/inbox`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      document.getElementById("messages").innerHTML = res.data
        .map(
          (m) => `
        <div>
          <strong>From: ${m.fromUser?.name}</strong>
          <p>${m.content}</p>
        </div>
      `
        )
        .join("");
    } catch {
      alert(" Failed to load messages");
    }
  });
}

// ================= DASHBOARD USER INFO =================
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById(
      "userInfo"
    ).innerText = ` Logged in as ${user.name} `;
  } else {
    document.getElementById("userInfo").innerText = "Please login again.";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
