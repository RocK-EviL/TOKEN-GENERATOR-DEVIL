document.getElementById("tokenForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tokenText = document.getElementById("tokens").value.trim();
  const fileInput = document.getElementById("tokenFile").files[0];
  let tokens = [];

  if (tokenText) {
    tokens = tokenText.split("\n").map(t => t.trim()).filter(t => t);
  }

  if (fileInput) {
    const text = await fileInput.text();
    const fileTokens = text.split("\n").map(t => t.trim()).filter(t => t);
    tokens = tokens.concat(fileTokens);
  }

  if (tokens.length === 0) {
    alert("Please enter tokens or upload a token file!");
    return;
  }

  const res = await fetch("/check-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens })
  });

  const data = await res.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "result-card " + (item.valid ? "result-valid" : "result-invalid");
    div.innerHTML = item.valid
      ? `<strong>✅ Valid</strong><br>Name: ${item.name}<br>ID: ${item.id}`
      : `<strong>❌ Invalid</strong><br>Error: ${item.error}`;
    resultsDiv.appendChild(div);
  });
});
