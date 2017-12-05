const uuidv4 = require('uuid/v4');

/* createUser */
const createUser = ({name = ""} = {}) => (
  {
    id: uuidv4(),
    name
  }
);

/* createMessage */
const createMessage = ({message = "", sender = ""} = { }) => (
  {
    id: uuidv4(),
    time: getTime(Date.now()),
    message,
    sender
  }
)


/* createChat */
const createChat = ({messages = [], name = "Community", users = []} = {}) => (
  {
    id: uuidv4(),
    name,
    messages,
    users,
    typingUsers: []
  }
)


/* time */
const getTime = (date) => {
  return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
  createMessage,
  createChat,
  createUser
}
