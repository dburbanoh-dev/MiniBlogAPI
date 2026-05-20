jest.mock('../src/db', () => ({
    query: jest.fn(),
}));

const db = require('../src/db');
const postService = require('../src/services/postService');

afterEach(() => jest.clearAllMocks());

const fakePost = {
    id: 1,
    title: 'Hello',
    body: 'World',
    published: false,
    user_id: 1,
    author: 'alice',
    created_at: new Date(),
    updated_at: new Date(),
};

describe('postService.getAllPosts', () => {
    it('returns all posts when no userId filter', async () => {
        db.query.mockResolvedValueOnce({ rows: [fakePost] });
        const result = await postService.getAllPosts();
        expect(result).toEqual([fakePost]);
    });

    it('filters posts by userId', async () => {
        db.query.mockResolvedValueOnce({ rows: [fakePost] });
        await postService.getAllPosts(1);
        const callArg = db.query.mock.calls[0][0];
        expect(callArg).toMatch(/WHERE p\.user_id = \$1/);
    });
});

describe('postService.getPostById', () => {
    it('returns the post when found', async () => {
        db.query.mockResolvedValueOnce({ rows: [fakePost] });
        const result = await postService.getPostById(1);
        expect(result).toEqual(fakePost);
    });

    it('returns null when not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        const result = await postService.getPostById(999);
        expect(result).toBeNull();
    });
});

describe('postService.createPost', () => {
    it('inserts a post and returns it', async () => {
        db.query.mockResolvedValueOnce({ rows: [fakePost] });
        const result = await postService.createPost({
            title: 'Hello',
            body: 'World',
            user_id: 1,
        });
        expect(result).toMatchObject({ title: 'Hello' });
    });
});

describe('postService.updatePost', () => {
    it('updates and returns the post', async () => {
        const updated = { ...fakePost, title: 'Updated' };
        db.query.mockResolvedValueOnce({ rows: [updated] });
        const result = await postService.updatePost(1, { title: 'Updated' });
        expect(result.title).toBe('Updated');
    });

    it('returns null when post not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        const result = await postService.updatePost(999, { title: 'X' });
        expect(result).toBeNull();
    });
});

describe('postService.deletePost', () => {
    it('returns true when deleted', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 });
        expect(await postService.deletePost(1)).toBe(true);
    });

    it('returns false when not found', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 0 });
        expect(await postService.deletePost(999)).toBe(false);
    });
});