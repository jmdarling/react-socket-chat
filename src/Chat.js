import React, {Component} from 'react'
import './Chat.css'
import io from 'socket.io-client'

const socket = io('https://ezchatrooms.herokuapp.com/')

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatInput: ''
        }

        this.submitHandler = this
            .submitHandler
            .bind(this)
        this.textChangeHandler = this
            .textChangeHandler
            .bind(this)

    }
    //TODO: rebuild processCommand
    processCommand(currentRoom, command) {
        console.log('processCommand')
        var words = command.split(' ') //split the message by spaces and put into an array
        var message = false // message  = false because it started with a / and so must be a command
        command = words[0]
            .substring(1, words[0].length)
            .toLowerCase() // makes command = first word to lower case - slash at beginning

        switch (command) {
                // removes the first element from the array and then adds all words back to a
                // string and makes that the new room name
            case 'join':
                words.shift()
                var newRoom = words.join(' ');
                this.changeRoom(currentRoom, newRoom);
                break

                // removes first element from array, puts the rest back to a string and then
                // sends nameAttempt to the server
            case 'nick':
                words.shift()
                let name = words.join(' ');
                this
                    .socket
                    .emit('nameAttempt', name);
                break

                // otherwise send message unknown command
            default:
                message = 'Unrecognized command.'
                break
        }

        return message
    }

    submitHandler(event) {
        // Stop the form from refreshing the page on submit
        event.preventDefault()

        console.log(this.state.chatInput)

        let messageText = this.state.chatInput

        let messageObject = {
            room: 'Lobby',
            text: messageText,
            nick: 'bobert'
        }

        socket.emit('message', messageObject)

        // Clear the input box
        this.setState({chatInput: ''})

        this.printMessages(messageObject)

        // Call the onSend callback with the chatInput message this     .props
        // .onSend(this.state.chatInput)
    }

    textChangeHandler(event) {
        this.setState({chatInput: event.target.value})
    }
    printMessages(message) {
        console.log(message)
        let messagesList = document.querySelector('.messagesList')
        let messagesItem = document.createElement('li')
        messagesItem.innerText = message.text

        messagesList.appendChild(messagesItem)
    }

    componentDidMount() {
        console.log('mounted')
        // this.processCommand("room", "command")
        socket.on('message', (message) => {
            this.printMessages(message)
        })
    }
    componentWillMount() {
        console.log("will Mount")

    }
    render() {
        return (
            <div className="body">
                <div>
                    <ul className="messagesList"></ul>
                </div>
                <form className="chat-input" onSubmit={this.submitHandler}>
                    <input
                        type="text"
                        onChange={this.textChangeHandler}
                        value={this.state.chatInput}
                        placeholder="Write a message..."
                        required/>
                </form>
            </div>
        )
    }
}

export default Chat
