import React, {Component} from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer'

const socketUrl = "http://192.168.1.115:3231";

export default class Layout extends Component{
  constructor(props){
    super(props);

    this.state  = {
      socket: null,
      user: null
    };
    this.setUser = this.setUser.bind(this);
  }

  componentWillMount(){
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log("Connected");
    });

    this.setState({socket});
  }

  /* user property */
  setUser = (user) => {
    const {socket} = this.state;
    this.setState({user});
    socket.emit(USER_CONNECTED, user);
  }

  /* logout */
  logout = () => {
    const{socket} = this.state;
    socket.emit(LOGOUT);
    this.setState({user: null});
  }

  render(){
    //const {title} = this.props;
    const {socket, user} = this.state;
    return(
      <div className="container">
        {
          !user ?
          <LoginForm socket={socket} setUser={this.setUser} />
          :
          <ChatContainer socket={socket} user={user} logout={this.logout} />
        }
      </div>
    );
  }
}
