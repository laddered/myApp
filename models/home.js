require('./../config/express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeSchema = new Schema({
  homeName: { type: String, required: true},
  userId: { type: String, required: true}
});

// homeSchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

var Home = mongoose.model('Home', homeSchema);

module.exports = Home;