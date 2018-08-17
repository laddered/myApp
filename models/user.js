require('./../config/express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: String,
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    age: Number,
    gender: String,
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next) {
    var user = this;

    var currentDate = new Date();  //add created and updated date
        user.updated_at = currentDate;
        if (!user.created_at)
            user.created_at = currentDate;

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
        
var User = mongoose.model('User', userSchema);

module.exports = User;