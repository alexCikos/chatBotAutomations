# Azure Cosmos DB Setup Guide

## Step 1: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Azure Cosmos DB credentials:
```env
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key-here
COSMOS_DATABASE_ID=chatbot
COSMOS_CONTAINER_ID=messages
```

## Step 2: Get Your Azure Cosmos DB Credentials

### From Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB account
3. Go to **Settings** → **Keys**
4. Copy the **URI** (this is your `COSMOS_ENDPOINT`)
5. Copy the **Primary Key** (this is your `COSMOS_KEY`)

### From Azure CLI:
```bash
# Get the endpoint
az cosmosdb show --name YOUR_COSMOS_ACCOUNT --resource-group YOUR_RESOURCE_GROUP --query documentEndpoint

# Get the primary key
az cosmosdb keys list --name YOUR_COSMOS_ACCOUNT --resource-group YOUR_RESOURCE_GROUP --query primaryMasterKey
```

## Step 3: Database Structure

The application will automatically create:
- **Database**: `chatbot` (or your custom name)
- **Containers**:
  - `messages` (partition key: `/chatId`) - Chat messages
  - `chats` (partition key: `/userId`) - Chat sessions
  - `users` (partition key: `/id`) - User profiles
  - `tools` (partition key: `/userId`) - User tools/integrations

## Step 4: Test the Connection

Start your development server:
```bash
npm run dev
```

The console will show:
- ✅ `Connected to Cosmos DB - Database: chatbot` (success)
- ✅ `Container ready: messages (partition: /chatId)` (containers)
- ✅ `Container ready: chats (partition: /userId)` (containers)
- ✅ `Container ready: users (partition: /id)` (containers)
- ✅ `Container ready: tools (partition: /userId)` (containers)
- ❌ `Failed to initialize Cosmos DB: [error]` (connection issue)

## Step 5: Migration from LowDB (Optional)

If you have existing data in `messages.json`, you can migrate it:

1. The old LowDB files (`messages.json`) will remain but won't be used
2. Your app now uses Cosmos DB exclusively
3. To migrate existing data, use the Azure Data Migration tool or import manually

## Troubleshooting

### Common Issues:

1. **Connection Errors**: Verify your `COSMOS_ENDPOINT` and `COSMOS_KEY`
2. **Firewall Issues**: Ensure your IP is allowed in Cosmos DB firewall settings
3. **Permission Errors**: Make sure your key has read/write permissions

### Test Connection:
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.COSMOS_ENDPOINT)"
```

## Benefits of Cosmos DB Migration

- **Scalability**: Handles millions of messages effortlessly
- **Global Distribution**: Multi-region replication
- **Performance**: Single-digit millisecond response times
- **Reliability**: 99.999% availability SLA
- **Security**: Enterprise-grade encryption and access controls