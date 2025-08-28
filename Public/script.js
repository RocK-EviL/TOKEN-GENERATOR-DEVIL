document.getElementById("checkTokenBtn").addEventListener("click", async () => {
  const input = document.getElementById("tokensInput").value.trim();

  if (!input) {
    alert("Please enter at least one token!");
    return;
  }

  // Split tokens by new line
  const tokens = input.split("\n").map(t => t.trim()).filter(Boolean);

  try {
    // Call backend
    const res = await fetch("/check-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens })
    });

    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    alert("Error checking tokens");
  }
});

document.getElementById("uploadFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  document.getElementById("tokensInput").value = text.trim();
});

function renderResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // clear old results

  results.forEach(result => {
    const card = document.createElement("div");
    card.className = `p-4 mb-3 rounded-xl shadow-lg transition transform hover:scale-105 ${
      result.valid ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
    }`;

    if (result.valid) {
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-green-700">✅ Valid Token</h3>
        <p><b>Name:</b> ${result.name}</p>
        <p><b>ID:</b> ${result.id}</p>
        <p class="text-gray-500"><small>${result.token.slice(0, 15)}...</small></p>
      `;
    } else {
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-red-700">❌ Invalid Token</h3>
        <p><b>Error:</b> ${result.error || "Unknown error"}</p>
        <p class="text-gray-500"><small>${result.token.slice(0, 15)}...</small></p>
      `;
    }

    resultsDiv.appendChild(card);
  });
    }
