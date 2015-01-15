var assert = require('assert');
var modella = require('modella');
var memory = require('modella-memory');
var encrypter = require(__dirname + '/../index.js');
var bcrypt = require('bcrypt-nodejs');

describe('modella-bcrypt', function () {
    var User, user;

    before(function (done) {
        User = modella('User');
        User.use(memory());

        User.attr('id');
        User.attr('password');
        User.use(encrypter({ fieldName: 'password' }));

        user = new User({ password: 'mysecret' });
        user.save(function (err) {
            done();
        });
    });

    it('should not save the field as it is', function (done) {
        assert.notEqual(user.get('password'), 'mysecret');
        done();
    });

    it('should encrypt field with default rounds', function (done) {
        defaultRounds = bcrypt.getRounds(bcrypt.hashSync('astring'));
        assert.equal(bcrypt.getRounds(user.get('password')), defaultRounds);
        done();
    });

    it('should not re-hash field if field was not changed', function (done) {
        var pass = user.get('password');
        user.save(function (err) {
            assert.equal(pass, user.get('password'));
            done();
        });
    });

    it('should re-encrypt if field is changed', function (done) {
        user2 = new User({ password: 'mysecret' });
        user2.save(function (err) {
            var pass = user2.get('password');
            user2.set({'password': 'yoursecret'});
            user2.save(function (err) {
                assert.notEqual(pass, user2.get('password'));
                done();
            });
        });
    });

    describe('compareField', function () {
        it('should return true if new input matches the original input', function (done) {
            user.compareField('password', 'mysecret', function (err, match) {
                assert.equal(match, true);
                done();
            });
        });

        it('should return false if new input does not match the original input', function (done) {
            user.compareField('password', 'othersecret', function (err, match) {
                assert.equal(match, false);
                done();
            });
        });
    });

    describe('compareFieldSync', function () {
        it('should return true if new input matches the original input', function (done) {
            assert.equal(user.compareFieldSync('password', 'mysecret'), true);
            done();
        });

        it('should return false if new input does not match the original input', function (done) {
            assert.equal(user.compareFieldSync('password', 'othersecret'), false);
            done();
        });
    });

    describe('options', function () {
        var rounds = 7, dna = '12341234', animal;

        before(function (done) {
            var Animal = modella('Animal');
            Animal.use(memory());
            Animal.attr('dna');
            Animal.use(encrypter({ fieldName: 'dna', rounds: rounds }));

            animal = new Animal({ dna: dna });
            animal.save(function () {
                done();
            });
        });
        describe('fieldName', function () {
            it('should not save the field as it is', function (done) {
                assert.notEqual(animal.get('dna'), dna);
                done();
            });
            it('should return true if input matches', function (done) {
                assert.equal(animal.compareFieldSync('dna', dna), true);
                done();
            });
            it('should return false if input does not match', function (done) {
                assert.equal(animal.compareFieldSync('dna', 'asdfasdf'), false);
                done();
            });
        });
        describe('rounds', function (done) {
            it('should hash with the specified ammount of rounds', function (done) {
                assert.equal(bcrypt.getRounds(animal.get('dna')), rounds);
                done();
            })
        });
    });

});
