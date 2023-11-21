const request = require('supertest');
const { createApp } = require('../app');
const { appDataSource } = require('../models/datasource');

//관리자 가입 테스트
describe('admin sign up', () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
    });
    afterAll(async () => {
        await appDataSource.query(`SET foreign_key_checks = 0;`);
        await appDataSource.query(`TRUNCATE admins`);
        await appDataSource.destroy();
    });
    //관리자 가입
    test('FAILED: key_error', async () => {
        await request(app)
        .post('/admins/signup')
        .send({
            admin_id: 'admin11202',
            password: '123123'
            })
        .expect(400);
        expect({message: 'KEY_ERROR'});
    });
    test('SUCCESS: create admin', async () => {
        await request(app)
        .post('/admins/signup')
        .send({
            admin_id: 'admin11202',
            password: 'dnlzhemWkd!59'
        })
        .expect(200);
        expect({message: 'CREATE_SUCCESS'})
    })
});

//관리자 로그인 테스트
describe('admin login', () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
    });
    afterAll(async () => {
        await appDataSource.query(`SET foreign_key_checks = 0;`);
        await appDataSource.query(`TRUNCATE admins`);
        await appDataSource.destroy();
    });
    //관리자 로그인
    test('FAILED: key_error', async () => {
        await request(app)
        .post('/admins/login')
        .send({
            admin_id: 'admin1111',
            password: '123123123123'
            })
        .expect(400);
        expect({message: 'KEY_ERROR'});
    });
    test('SUCCESS: create admin', async () => {
        await request(app)
        .post('/admins/signup')
        .send({
            admin_id: 'admin1120',
            password: 'dnlzhemWkd!59'
        })
        .expect(200);
        expect({message: 'LOGIN_SUCCESS'})
    })
});

//관리자 하루 리스트 확인하기
describe('admin users list check', () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSource.initialize();
        await appDataSource.query(`
        
        `)
    });
    afterAll(async () => {
        await appDataSource.query(`SET foreign_key_checks = 0;`);
        await appDataSource.query(`TRUNCATE admins`);
        await appDataSource.query(`TRUNCATE users`);
        await appDataSource.destroy();
    });
    //관리자 유저 리스트 확인
    test('FAILED: key_error', async () => {
        await request(app)
        .get('/admins/userlist')
        .send({
            admin_id: 'admin1111',
            password: '123123123123'
            })
        .expect(400);
        expect({message: 'KEY_ERROR'});
    });
    test('SUCCESS: create admin', async () => {
        await request(app)
        .post('/admins/signup')
        .send({
            admin_id: 'admin1120',
            password: 'dnlzhemWkd!59'
        })
        .expect(200);
        expect({message: 'LOGIN_SUCCESS'})
    })
});