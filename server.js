import { handler } from './.svelte-kit/output/server/index.js';
import polka from 'polka';

const port = process.env.PORT || 8080;

polka()
  .use(handler)
  .listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });