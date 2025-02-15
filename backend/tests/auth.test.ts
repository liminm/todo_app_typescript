import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Alice',
                email: 'test@example.com',
                password: 'password123!'
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('token')
    })


    it('should log in an existing user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123!'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
})

