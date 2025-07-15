import { Server } from './.svelte-kit/output/server/index.js';
import { manifest } from './.svelte-kit/output/server/manifest.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

// Initialize SvelteKit server
const server = new Server(manifest);

// Use SvelteKit server
app.use(async (req, res) => {
  const request = new Request(`http://localhost:${port}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body
  });

  const response = await server.respond(request, {
    platform: {},
    getClientAddress: () => {
      return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || null;
    }
  });

  res.status(response.status);
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    const pump = () => reader.read().then(({ done, value }) => {
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      pump();
    });
    pump();
  } else {
    res.end();
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});