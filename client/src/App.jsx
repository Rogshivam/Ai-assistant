import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardMedia,
} from '@mui/material';
import axios from 'axios';

function App() {
  const [tab, setTab] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";



  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setGeneratedText('');
    setGeneratedImage('');
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        const response = await axios.post(`${BACKEND_URL}/api/generate-text`, {
          prompt,
          maxTokens: 300,
          model: 'openai/gpt-3.5-turbo-16k',
        });
        setGeneratedText(response.data.text);
      } else {
        const response = await axios.post(`${BACKEND_URL}/api/generate-image`, {
          prompt,
          size: '1024x1024',
        });
        setGeneratedImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Content Generator
        </Typography>
        
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Text Generation" />
            {/* <Tab label="Image Generation" /> */}
          </Tabs>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateContent}
            disabled={loading || !prompt}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {generatedText && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Text:
            </Typography>
            <Typography>{generatedText}</Typography>
          </Paper>
        )}

        {generatedImage && (
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              image={generatedImage}
              alt="Generated image"
              sx={{ maxHeight: 512, objectFit: 'contain' }}
            />
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default App;