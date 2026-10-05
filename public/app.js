const form = document.getElementById("scanner-form");
const resultOutput = document.getElementById("result-output");
const status = document.getElementById("status");
const button = document.getElementById("scan-button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    mode: formData.get("mode"),
    url: formData.get("url") || "",
    content: formData.get("content") || ""
  };

  if (!payload.content.trim()) {
    status.textContent = "Please add text before scanning.";
    resultOutput.textContent = "No content provided.";
    return;
  }

  button.disabled = true;
  button.textContent = "Scanning...";
  status.textContent = "Running AI scan...";
  resultOutput.textContent = "Please wait while ChatGPT analyzes your content...";

  try {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Scan failed");
    }

    status.textContent = `Scan complete (${data.mode})`;
    resultOutput.textContent = data.result;
  } catch (error) {
    status.textContent = "Scan failed";
    resultOutput.textContent = error.message || "Something went wrong.";
  } finally {
    button.disabled = false;
    button.textContent = "Run scan";
  }
});
