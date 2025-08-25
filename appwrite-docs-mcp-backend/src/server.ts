import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { handleSearchDocsTool } from './tools/search-docs';
import { handleTableOfContentsTool } from './tools/get-table-of-contents';
import { handleGetDocsPageTool } from './tools/get-docs-page';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', requestId());
app.onError((err) => {
    console.error(err);
    return new Response('Something went wrong', { status: 500 });
});

// Routes
app.post("/tools/search-docs", handleSearchDocsTool);
app.post("/tools/get-table-of-contents", handleTableOfContentsTool);
app.post("/tools/get-docs-page", handleGetDocsPageTool);

export default {
    port: 1234,
    fetch: app.fetch,
    hostname: '0.0.0.0',
    idleTimeout: 60, // 1 minute. We have a heartbeat that extends this.
    maxRequestBodySize: 1024 * 1024 * 50, // 50MB
}