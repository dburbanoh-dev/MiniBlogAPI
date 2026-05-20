/**
 * Controller-level tests using supertest.
 * The service layer is mocked – no DB connection required.
 */

jest.mock('../src/services/userService');
jest.mock('../src/services/postService');

const request = require('supertest');
const createApp = require('../src/app');

const userService = require('../src/services/userService');
const postService = require('../src/services/postService');

const app = createApp();

afterEach(() => jest.clearAllMocks());

// ─── USERS ───────────────────────────────────────────────────────────────────

describe('GET /api/users', () => {
    it('returns 200 and list of users', async () => {
        userService.getAllUsers.mockResolvedValueOnce([
            { id: 1, username: 'alice', email: 'alice@example.com' },
        ]);

        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });
});

describe('GET /api/users/:id', () => {
    it('returns 200 when user exists', async () => {
        userService.getUserById.mockResolvedValueOnce({ id: 1, username: 'alice' });
        const res = await request(app).get('/api/users/1');
        expect(res.status).toBe(200);
    });

    it('returns 404 when user not found', async () => {
        userService.getUserById.mockResolvedValueOnce(null);
        const res = await request(app).get('/api/users/999');
        expect(res.status).toBe(404);
    });

    it('returns 422 for non-integer id', async () => {
        const res = await request(app).get('/api/users/abc');
        expect(res.status).toBe(422);
    });
});

describe('POST /api/users', () => {
    it('creates user and returns 201', async () => {
        const newUser = { id: 2, username: 'bob', email: 'bob@example.com' };
        userService.createUser.mockResolvedValueOnce(newUser);

        const res = await request(app)
            .post('/api/users')
            .send({ username: 'bob', email: 'bob@example.com' });

        expect(res.status).toBe(201);
        expect(res.body.data.username).toBe('bob');
    });

    it('returns 422 when email is missing', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ username: 'bob' });

        expect(res.status).toBe(422);
    });

    it('returns 409 on duplicate', async () => {
        const dupErr = new Error('dup');
        dupErr.code = '23505';
        userService.createUser.mockRejectedValueOnce(dupErr);

        const res = await request(app)
            .post('/api/users')
            .send({ username: 'alice', email: 'alice@example.com' });

        expect(res.status).toBe(409);
    });
});

describe('PATCH /api/users/:id', () => {
    it('returns 200 with updated user', async () => {
        userService.updateUser.mockResolvedValueOnce({ id: 1, username: 'alice2', email: 'a@b.com' });
        const res = await request(app).patch('/api/users/1').send({ username: 'alice2' });
        expect(res.status).toBe(200);
    });

    it('returns 404 when not found', async () => {
        userService.updateUser.mockResolvedValueOnce(null);
        const res = await request(app).patch('/api/users/99').send({ username: 'x' });
        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/users/:id', () => {
    it('returns 204 when deleted', async () => {
        userService.deleteUser.mockResolvedValueOnce(true);
        const res = await request(app).delete('/api/users/1');
        expect(res.status).toBe(204);
    });

    it('returns 404 when not found', async () => {
        userService.deleteUser.mockResolvedValueOnce(false);
        const res = await request(app).delete('/api/users/99');
        expect(res.status).toBe(404);
    });
});

// ─── POSTS ───────────────────────────────────────────────────────────────────

describe('GET /api/posts', () => {
    it('returns 200 and list of posts', async () => {
        postService.getAllPosts.mockResolvedValueOnce([{ id: 1, title: 'Hello', author: 'alice' }]);
        const res = await request(app).get('/api/posts');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });
});

describe('POST /api/posts', () => {
    it('creates post and returns 201', async () => {
        postService.createPost.mockResolvedValueOnce({ id: 1, title: 'Hi', body: 'There', user_id: 1 });
        const res = await request(app)
            .post('/api/posts')
            .send({ title: 'Hi', body: 'There', user_id: 1 });
        expect(res.status).toBe(201);
    });

    it('returns 422 when title is missing', async () => {
        const res = await request(app).post('/api/posts').send({ body: 'X', user_id: 1 });
        expect(res.status).toBe(422);
    });
});

describe('GET /health', () => {
    it('returns 200 ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});