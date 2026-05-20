jest.mock('../src/db', () => ({
    query: jest.fn(),
}));

const db = require('../src/db');
const userService = require('../src/services/userService');

afterEach(() => jest.clearAllMocks());

describe('userService.getAllUsers', () => {
    it('returns an array of users', async () => {
        const fakeUsers = [
            { id: 1, username: 'alice', email: 'alice@example.com', created_at: new Date() },
        ];
        db.query.mockResolvedValueOnce({ rows: fakeUsers });

        const result = await userService.getAllUsers();

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakeUsers);
    });
});

describe('userService.getUserById', () => {
    it('returns the user when found', async () => {
        const fakeUser = { id: 1, username: 'alice', email: 'alice@example.com' };
        db.query.mockResolvedValueOnce({ rows: [fakeUser] });

        const result = await userService.getUserById(1);

        expect(result).toEqual(fakeUser);
    });

    it('returns null when user is not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await userService.getUserById(999);

        expect(result).toBeNull();
    });
});

describe('userService.createUser', () => {
    it('inserts a user and returns it', async () => {
        const newUser = { id: 2, username: 'bob', email: 'bob@example.com', created_at: new Date() };
        db.query.mockResolvedValueOnce({ rows: [newUser] });

        const result = await userService.createUser({ username: 'bob', email: 'bob@example.com' });

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({ username: 'bob', email: 'bob@example.com' });
    });
});

describe('userService.updateUser', () => {
    it('updates and returns the user', async () => {
        const updated = { id: 1, username: 'alice2', email: 'alice@example.com' };
        db.query.mockResolvedValueOnce({ rows: [updated] });

        const result = await userService.updateUser(1, { username: 'alice2' });

        expect(result).toEqual(updated);
    });

    it('returns null when user does not exist', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const result = await userService.updateUser(999, { username: 'ghost' });

        expect(result).toBeNull();
    });
});

describe('userService.deleteUser', () => {
    it('returns true when a row is deleted', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await userService.deleteUser(1);

        expect(result).toBe(true);
    });

    it('returns false when no row is found', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 0 });

        const result = await userService.deleteUser(999);

        expect(result).toBe(false);
    });
});