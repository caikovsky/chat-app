const io = require('./index.js').io;
const { VERIFY_USER, USER_CONNECTED,
        USER_DISCONNECTED, LOGOUT,
        COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECEIVED,
        TYPING, PRIVATE_MESSAGE } = require('../Events');
const {createUser, createMessage, createChat} = require('../Factories')

let connectedUsers = {};
let communityChat = createChat();

module.exports = function(socket){
  //console.log('\x1bc');
  console.log("Socket ID: " + socket.id);

  let sendMessageToChatFromUser;
  let sendTypingFromUser;

  //verify username
  socket.on(VERIFY_USER, (newUser, callback) => {
    if(!isUser(connectedUsers, newUser)){
      callback({isUser: false, user: createUser({name: newUser, socketId: socket.id})});
    }else{
      callback({isUser: true});
    }
  })

  //user connects with username
  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user.name;

    sendMessageToChatFromUser = sendMessageToChat(user.name);
    sendTypingFromUser = sendTypingToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers)
  });

  //user disconnects
  socket.on('disconnect', () => {
    if("user" in socket){
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
    }
  });

  //user logout
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
  });

  //get community chat
  socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	});

  //send message
	socket.on(MESSAGE_SENT, ({chatId, message}) => {
		sendMessageToChatFromUser(chatId, message)
	});

  //send typing
	socket.on(TYPING, ({chatId, isTyping}) => {
		sendTypingFromUser(chatId, isTyping)
	});

  socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat}) => {
    if(receiver in connectedUsers){
      const receiverSocket = connectedUsers[receiver].socketId;
      if(activeChat === null || activeChat.id === communityChat.id){
        const newChat = createChat({name: `${receiver} & ${sender}`, users:[receiver, sender]})
        socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
        socket.emit(PRIVATE_MESSAGE, newChat);
      }else{
        socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
      }
    }
  })
}

// -------------------------

sendTypingToChat = (user) => {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, {user, isTyping});
  }
}

sendMessageToChat = (sender) => {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}));
  }
}

//add user to the list
function addUser(userList, user){
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

//remove user from the list
function removeUser(userList, username){
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

//checks if the user is in the list
function isUser(userList, username){
  return username in userList
}
