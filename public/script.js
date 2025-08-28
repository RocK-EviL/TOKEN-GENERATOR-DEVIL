async function checkTokens() {
  const tokens = document.getElementById("tokens").value.split("\n").map(t => t.trim()).filter(t => t);
  
  const res = await fetch("/check-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens })
  });
  
  const data = await res.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  
  data.forEach(r => {
    resultsDiv.innerHTML += r.valid
      ? `<p>✅ ${r.name} (${r.id})</p>`
      : `<p>❌ Invalid token - ${r.error}</p>`;
  });
}