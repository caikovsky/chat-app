const io = require('./index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../Events');
const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = {};

module.exports = function(socket){
  console.log("Socket ID: " + socket.id);

  //Verify username
  socket.on(VERIFY_USER, (newUser, callback) => {
    if(!isUser(connectedUsers, newUser)){
      callback({isUser: false, user: createUser({name: newUser})});
    }else{
      callback({isUser: true});
    }
  })

  //user connects with username
  socket.on(USER_CONNECTED, function(user){
    connectedUsers = addUser(connectedUsers, user)
    socket.user = user.name;

    console.log(connectedUsers);
    io.emit(USER_CONNECTED, connectedUsers)
  })

  //user disconnects


  //user logouts
}

//add user to the list
function addUser(userList, user){
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

//remove user from the list
function removeUser(userList, username){
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

//checks if the user is in the list
function isUser(userList, username){
  return username in userList
}
