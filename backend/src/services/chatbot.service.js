const fetch = require("node-fetch");

const callAiModel = async (message) => {
  return await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3:mini",
      prompt: message,
      stream: false,
    }),
  });
};

module.exports = callAiModel;
