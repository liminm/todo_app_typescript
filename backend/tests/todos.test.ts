import request from 'supertest'
import app from '../src/app'

let token: string

describe('Todos Endpoints', () => {
    beforeAll(async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123!'
            })
        token = res.body.token
    })

    it('should get all todos', async () => {
        const res = await request(app)
            .get('/api/v1/todos')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
    })
})