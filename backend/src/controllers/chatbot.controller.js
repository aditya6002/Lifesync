const {AppError} = require("../middleware/errors.middleware");
const callAiModel = require("../services/mail.service");

const chatbot = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    throw new AppError("Message is required and must be a string", 400);
  }

  const response = await callAiModel(message);

  if (!response.ok) {
    throw new AppError(
      `Ollama API error: ${response.status} ${response.statusText}`,
      500,
    );
  }

  const data = await response.json();

  res.json({
    response: data.response || "No response from Ollama API",
    success: data.done || false,
  });
};

module.exports = { chatbot };
