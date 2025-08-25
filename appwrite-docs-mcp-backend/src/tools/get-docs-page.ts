import { Context } from 'hono';
import { queryVectorStore } from '../lib/utils/query-vector-store';
import { getDocsFileContent } from '../lib/utils/content';

export async function handleGetDocsPageTool(c: Context) {
    const { path } = await c.req.json();
    const page = getDocsFileContent(path);

    return c.json({
      title: page.attributes.title,
      description: page.attributes.description,
      body: page.body,
    });
}