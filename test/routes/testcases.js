var request = require('supertest');
var should = require('should');

var app = require('../../app.js');
var server = request.agent(app);
var token = "";

var entityId = "";

describe('/testcases', function () {

    it('login', loginUser());

    it('POST /testcases respond with status 201 and JSON', function (done) {
        this.timeout(35000);
        request(server.app)
            .post('/api/v1/testcases')
            .set('x-access-token', token)
            .send({
                'parentId': null,
                'prerequisites': 'Prerequisites 1',
                'name': 'Testcase 1',
                'description': 'Test case description',
                'actual': 'actual 1',
                'expected': 'expected 1'
            })
            .expect(201)
            //.expect('Location')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                entityId = res.body._id;
                if (err) return done(err);
                done()
            });
    });

    it('GET /testcases/:id respond with JSON', function (done) {
        this.timeout(35000);
        request(server.app)
            .get('/api/v1/testcases/' + entityId)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.should.have.property('parentId');
                res.body.should.have.property('prerequisites');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('actual');
                res.body.should.have.property('expected');
                if (err) return done(err);
                done()
            });
    });

    it('GET /testcases respond with JSON', function (done) {
        request(server.app)
            .get('/api/v1/testcases')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.body[0].should.have.property('parentId');
                res.body[0].should.have.property('prerequisites');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('actual');
                res.body[0].should.have.property('expected');
                if (err) return done(err);
                done()
            });
    });

    it('PUT /testcases respond with JSON', function (done) {
        this.timeout(35000);
        request(server.app)
            .put('/api/v1/testcases/' + entityId)
            .set('x-access-token', token)
            .send({
                'parentId': null,
                'prerequisites': 'Prerequisites 1 edited',
                'name': 'Testcase 1 edited',
                'description': 'Test case description edited',
                'actual': 'actual 1 edited',
                'expected': 'expected 1 edited'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.body.should.have.property('parentId', null);
                res.body.should.have.property('prerequisites', 'Prerequisites 1 edited');
                res.body.should.have.property('name', 'Testcase 1 edited');
                res.body.should.have.property('description', 'Test case description edited');
                res.body.should.have.property('actual', 'actual 1 edited');
                res.body.should.have.property('expected', 'expected 1 edited');
                if (err) return done(err);
                done()
            });
    });


    it('DELETE /testcases/:id respond with JSON', function (done) {
        this.timeout(35000);
        request(server.app)
            .delete('/api/v1/testcases/' + entityId)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(204)
            .end(function (err, res) {
                res.body.should.not.have.property('parentId');
                res.body.should.not.have.property('prerequisites');
                res.body.should.not.have.property('name');
                res.body.should.not.have.property('description');
                res.body.should.not.have.property('actual');
                res.body.should.not.have.property('expected');
                if (err) return done(err);
                done()
            });
    });

});

function loginUser() {
    return function (done) {
        request(server.app)
            .post('/login')
            .send({ username: 'arvind@myapp.com', password: 'pass123' })
            .end(onResponse);

        function onResponse(err, res) {
            token = res.body.token;
            if (err) return done(err);
            return done();
        }
    };
};