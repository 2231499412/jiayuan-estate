import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { propertiesRoutes } from './routes/properties';
import { adminRoutes } from './routes/admin';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

app.route('/api', propertiesRoutes);
app.route('/api/admin', adminRoutes);

export default app;
