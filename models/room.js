require('./../config/express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    roomName: { type: String, required: true},
    homeId: { type: String, required: true}
});

// RoomSchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;