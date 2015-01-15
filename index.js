var bcrypt = require('bcrypt-nodejs');

var encrypter = function (options) {

    if (!options || !options.fieldName) {
        throw new Error('modella-bcrypt: fieldName option missing.');
    }

    return function (Model) {

        // Add attribute
        Model.attr(options.fieldName);

        Model.prototype.compareField = function (fieldName, value, done) {
            bcrypt.compare(value, this[fieldName](), done);
        };

        Model.prototype.compareFieldSync = function (fieldName, value) {
            return bcrypt.compareSync(value, this[fieldName]());
        };

        Model.on('saving', function(model, done) {
            if (model.isNew() || model.changed(options.fieldName)) {
                 bcrypt.genSalt(options.rounds || 0, function(err, salt) {
                     if (err) { return done(err); }

                     bcrypt.hash(model[options.fieldName](), salt, null, function(err, hash) {
                         if (err) { return done(err); }

                         model[options.fieldName](hash);
                         done();
                     });
                 });
            } else {
                done();
            }
        });
    };
};

module.exports = encrypter;
