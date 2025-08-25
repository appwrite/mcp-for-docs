import { Context } from 'hono';
import { getTableOfContentsFromJson } from '../lib/utils/content';

export async function handleTableOfContentsTool(c: Context) {
    const toc = await getTableOfContentsFromJson();
    return c.json(toc);
}