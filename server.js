require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Debug: Log environment variables
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Set' : 'Not set');
console.log('YOUR_FRONTEND_URL:', process.env.YOUR_FRONTEND_URL || 'http://localhost:3000');

const app = express();
const port = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: [process.env.YOUR_FRONTEND_URL || 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Test endpoint using fetch
app.get('/api/test', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        ...(process.env.YOUR_SITE_URL && { 'HTTP-Referer': process.env.YOUR_SITE_URL }),
        ...(process.env.YOUR_SITE_NAME && { 'X-Title': process.env.YOUR_SITE_NAME }),
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'user',
            content: 'What is the meaning of life?',
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    res.json({ text: data.choices[0]?.message?.content || 'No response content' });
  } catch (error) {
    console.error('Test Error:', error);
    res.status(500).json({ error: 'Failed to process test request', details: error.message });
  }
});

// Text generation endpoint using fetch
app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt, maxTokens = 150, model = 'openai/gpt-3.5-turbo-16k' } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }
    if (typeof maxTokens !== 'number' || maxTokens <= 0) {
      return res.status(400).json({ error: 'maxTokens must be a positive number' });
    }
    const validModels = ['openai/gpt-3.5-turbo-16k', 'openai/gpt-4', 'openai/gpt-4o', 'meta-llama/llama-3.1-8b-instruct'];
    if (!validModels.includes(model)) {
      return res.status(400).json({ error: `Invalid model. Must be one of: ${validModels.join(', ')}` });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        ...(process.env.YOUR_SITE_URL && { 'HTTP-Referer': process.env.YOUR_SITE_URL }),
        ...(process.env.YOUR_SITE_NAME && { 'X-Title': process.env.YOUR_SITE_NAME }),
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    res.json({ text: data.choices[0]?.message?.content || 'No response content' });
  } catch (error) {
    console.error('Text Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate text', details: error.message });
  }
});

// Placeholder for image generation
app.post('/api/generate-image', async (req, res) => {
  res.status(501).json({ error: 'Image generation not supported yet. Check OpenRouter for available models.' });
});

// Server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});