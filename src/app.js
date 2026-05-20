const express = require('express');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const errorHandler = require('./middlewares/errorHandler');

const createApp = () => {
    const app = express();

    app.use(express.json());

    // Health check
    app.get('/health', (req, res) => {
        console.log("llego una peticion");
        res.json({ status: 'ok' })
    });

    // Resources
    app.use('/api/users', usersRouter);
    app.use('/api/posts', postsRouter);

    // 404 catch-all
    app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
};

module.exports = createApp;