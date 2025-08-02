# AI Content Generator

A full-stack application that uses OpenAI's GPT-4 to generate text based on user prompts.

## Features

- Text generation using GPT-4
- Modern Material-UI interface
- Real-time content generation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run client
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select "Text Generation" tab
2. Enter your prompt in the text field
3. Click "Generate" to create content
4. View the generated text or image below

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios

- Backend:
  - Node.js
  - Express
  - OpenAI API

## License

MIT 