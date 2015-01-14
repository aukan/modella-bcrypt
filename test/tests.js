var assert = require('assert');
var modella = require('modella');
var encrypter = require(__dirname + '/../index.js');
var bcrypt = require('bcrypt-nodejs');

describe('modella-bcrypt', function () {
    var User, user;

    before(function (done) {
        User = modella('User');
        User.attr('name');
        User.attr('password');
        User.use(encrypter({ fieldName: 'password' }));

        user = new User({'password', 'mysecret'});
        user.save(function (err) {
        done();
    });

    it('should not save the field as it is', function (done) {
        assert.notEqual(user.password, 'mysecret');
    });

    it('should encrypt field with default rounds', function (done) {
        defaultRounds = bcrypt.getRounds(bcrypt.hashSync('astring'));
        assert.equal(bcrypt.getRounds(user.password), defaultRounds);
    });

    describe('compareField', function () {
        it('should return true if new input matches the original input', function () {
            user.compareField('password', 'mysecret', function (err, match) {
                assert.equal(match, true);
                done();
            });
        });

        it('should return false if new input does not match the original input', function () {
            user.compareField('password', 'othersecret', function (err, match) {
                assert.equal(match, false);
                done();
            });
        });
    });

    describe('compareFieldSync', function () {
        it('should return true if new input matches the original input', function () {
            assert.equal(user.compareFieldSync('password', 'mysecret'), true);
        });

        it('should return false if new input does not match the original input', function () {
            assert.equal(user.compareFieldSync('password', 'othersecret'), false);
        });
    });

    describe('options', function () {
        var rounds = 3, dna = '12341234';

        before(function () {
            var Animal = modella('Animal');
            Animal.attr('dna');
            Animal.use(encrypter({ fieldName: 'dna', rounds: rounds }));

            var animal = new Animal({ dna: dna });
        });
        describe('fieldName', function () {
            it('should not save the field as it is', function (done) {
                assert.notEqual(user.password, dna);
            });
            it('should return true if input matches', function (done) {
                assert.equal(user.compareFieldSync('password', dna), true);
            });
            it('should return false if input does not match', function (done) {
                assert.equal(user.compareFieldSync('password', 'asdfasdf'), true);
            });
        });
        describe('rounds', function (done) {
            it('should hash with the specified ammount of rounds', function (done) {
                assert.equal(bcrypt.getRounds(user.password), rounds);
            })
        });
    });

});
