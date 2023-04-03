var events = require('events');
var eventEmitter = new events.EventEmitter();		

export default class UserService {

  async signup(user) {
    // emit 'signup' event
    eventEmitter.emit('signup', user.data)
  }

}