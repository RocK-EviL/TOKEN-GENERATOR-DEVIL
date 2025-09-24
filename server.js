const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, "public")));

// API route to check token validity
app.post("/check-token", async (req, res) => {
  const { tokens } = req.body;
  if (!tokens || !Array.isArray(tokens)) {
    return res.status(400).json({ error: "No tokens provided" });
  }

  const results = [];
  for (let token of tokens) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${token}`
      );
      const data = await response.json();
      if (data.error) {
        results.push({ token, valid: false, error: data.error.message });
      } else {
        results.push({
          token,
          valid: true,
          name: data.name,
          id: data.id,
        });
      }
    } catch (err) {
      results.push({ token, valid: false, error: err.message });
    }
  }

  res.json(results);
});

// ✅ FIXED fallback route (no error now)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
