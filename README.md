# Coding Agent Release Summarizer

This project is a Mastra.ai-based agent system that automatically fetches and summarizes release notes from specific coding tools, focusing on updates from the past week.

## Features

- Automatically fetches release notes from multiple services
- Extracts only release information from the past week
- Summarizes the gathered information in Japanese and outputs it in a formatted markdown format

## Technology Stack

- [Mastra.ai](https://mastra.ai/) - Implementation of agents and workflows
- [Google Gemini](https://ai.google.dev/) - AI model (Gemini Flash)
- Node.js / TypeScript

## Prerequisites

- Node.js 18 or higher

## Installation

```bash
npm install
```

## Environment Setup

Before running the application, you need to set up the required environment variables:

1. Create a `.env.development` file in the root directory
2. Add your Google Gemini API key (required for AI model usage):
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

You can obtain a Google Gemini API key from the [Google AI Studio](https://ai.google.dev/). Without this key, the application will not be able to use the AI model for summarizing release information.

## Usage

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
  config/          - Constants and configuration files
  mastra/
    agents/        - Agents for fetching and summarizing release information
    mcp-client/    - MCP client
    mcp-server/    - MCP server and custom tools
    models/        - AI model settings
    tools/         - Custom tools
    workflows/     - Workflow definitions
```

## Workflow

This project consists mainly of the following workflows:

1. **Release Information Fetching**: Fetches release information from GitHub release pages of each service
2. **Information Summarization**: Formats the fetched release information and summarizes the information from the past week

## License

MIT
