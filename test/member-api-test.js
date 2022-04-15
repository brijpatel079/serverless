require('dotenv').config();
process.env.IS_OFFLINE = 'true';
const axios = require('axios');
let chai = require('chai');
let chaiHttp = require('chai-http');
let { app: server } = require('./../handler');
let should = chai.should();

chai.use(chaiHttp);

describe('MEMBERS CRUD API TEST', () => {

    let randomMember;
    let faultyEmail = 'someemailid@test.com.ng.eq.ss';

    before(async () => { 
        randomMember = await axios.get('https://randomuser.me/api/');
        randomMember = randomMember.data.results[0];
        randomMember = {
            "email": randomMember.email,
            "firstName": randomMember.name.first,
            "middleInitial": "N",
            "lastName": randomMember.name.last,
            "phoneNumber": randomMember.phone,
            "gender": randomMember.gender
        }
    });

    describe('POST MEMBER', () => {

        it('it should create member', (done) => {
            chai.request(server)
                .post('/member')
                .send(randomMember)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('email').eq(randomMember.email);
                    res.body.data.should.have.property('firstName').eq(randomMember.firstName);
                    res.body.data.should.have.property('middleInitial');
                    res.body.data.should.have.property('lastName').eq(randomMember.lastName);
                    res.body.data.should.have.property('phoneNumber').eq(randomMember.phoneNumber);
                    res.body.data.should.have.property('gender').eq(randomMember.gender);
                    done();
                });
        });

        it('it should not create member if data is missing', (done) => {

            let postData = { ...randomMember };
            delete postData.firstName;

            chai.request(server)
                .post('/member')
                .send(postData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

        it('it should not create member if user is already created', (done) => {
            chai.request(server)
                .post('/member')
                .send(randomMember)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

    });

    describe('GET /member/{emailId}', () => {
        it('it should FIND a member', (done) => {
            chai.request(server)
                .get('/member/' + randomMember.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('email').eq(randomMember.email);
                    res.body.data.should.have.property('firstName').eq(randomMember.firstName);
                    res.body.data.should.have.property('middleInitial');
                    res.body.data.should.have.property('lastName').eq(randomMember.lastName);
                    res.body.data.should.have.property('phoneNumber').eq(randomMember.phoneNumber);
                    res.body.data.should.have.property('gender').eq(randomMember.gender);
                    done();
                });
        });

        it('it should not find the member with faulty email', (done) => {
            chai.request(server)
                .get('/member/' + faultyEmail)
                .send(randomMember)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

    });

    describe('GET /member', () => {
        it('it should get list of member', (done) => {
            chai.request(server)
                .get('/member')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.greaterThan(0);
                    done();
                });
        });
    });


    describe('PUT MEMBER', () => {
        it('it should update member', (done) => {
            chai.request(server)
                .put('/member/' + randomMember.email)
                .send(randomMember)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('email').eq(randomMember.email);
                    res.body.data.should.have.property('firstName').eq(randomMember.firstName);
                    res.body.data.should.have.property('middleInitial');
                    res.body.data.should.have.property('lastName').eq(randomMember.lastName);
                    res.body.data.should.have.property('phoneNumber').eq(randomMember.phoneNumber);
                    res.body.data.should.have.property('gender').eq(randomMember.gender);
                    done();
                });
        });


        it('it should not update if the member with provided email is not found', (done) => {
            chai.request(server)
                .put('/member/' + faultyEmail)
                .send(randomMember)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

    });

    describe('DELETE /member', () => {
        it('it should delete the member', (done) => {
            chai.request(server)
                .delete('/member/' + randomMember.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('success');
                    done();
                });
        });

        it('it should not delete the member with faulty email', (done) => {
            chai.request(server)
                .delete('/member/' + faultyEmail)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

        it('it should NOT FIND deleted member', (done) => {
            chai.request(server)
                .get('/member/' + randomMember.email)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eq('error');
                    done();
                });
        });

    });


});