# SvelteKit Chatbot

A full-stack chatbot application built with SvelteKit, TypeScript, and Azure Cosmos DB.

## Features

- Real-time chat interface
- User authentication
- Chat history and management
- Responsive design with dark theme
- Full-stack TypeScript
- Azure Cosmos DB integration

## Docker Deployment

### Prerequisites

- Docker installed on your system
- Azure Cosmos DB account and credentials

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatbot
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure Cosmos DB credentials
   ```

3. **Build and run with Docker**
   ```bash
   docker build -t chatbot .
   docker run -p 3000:3000 --env-file .env chatbot
   ```

4. **Or use Docker Compose**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   Open http://localhost:3000 in your browser

### Environment Variables

Create a `.env` file with the following variables:

```env
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key
COSMOS_DATABASE_ID=chatbotDB
```

### Development

For local development without Docker:

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
node build
```

## Deployment Options

### Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry <your-registry> --image chatbot .

# Deploy to Azure Container Instances
az container create \
  --resource-group <your-rg> \
  --name chatbot \
  --image <your-registry>.azurecr.io/chatbot \
  --cpu 1 \
  --memory 2 \
  --ports 3000 \
  --environment-variables \
    COSMOS_ENDPOINT=<your-endpoint> \
    COSMOS_KEY=<your-key> \
    COSMOS_DATABASE_ID=chatbotDB
```

### Azure App Service

```bash
# Deploy container to Azure App Service
az webapp create \
  --resource-group <your-rg> \
  --plan <your-plan> \
  --name <your-app> \
  --deployment-container-image-name <your-registry>.azurecr.io/chatbot
```

## Technology Stack

- **Frontend**: SvelteKit, TypeScript, TailwindCSS
- **Backend**: SvelteKit API routes, Node.js
- **Database**: Azure Cosmos DB
- **Deployment**: Docker, Azure Container Services
