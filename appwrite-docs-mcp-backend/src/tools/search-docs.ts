import { Context } from 'hono';
import { queryVectorStore } from '../lib/utils/query-vector-store';

export async function handleSearchDocsTool(c: Context) {
    const { query } = await c.req.json();
    const pages = await queryVectorStore(query);

    return c.json({
      pages
    });
}