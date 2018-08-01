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
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
    
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
    
            // override the cleartext password with the hashed one
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
        
// userSchema.pre('save', function (next) {
//     var currentDate = new Date();
//     this.updated_at = currentDate;
//     if (!this.created_at)
//         this.created_at = currentDate;

//     next();
// });

var User = mongoose.model('User', userSchema);

module.exports = User;