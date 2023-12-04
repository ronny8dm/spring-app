'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var chatList = document.querySelector('#chatList');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var chatContainer = document.querySelector('.chat-container');

var stompClient = null;
var username = null;
var privateChat = new Map();
var tab = "CHATROOM";
var userData = {
    username: '',
    receiver: '',
    connected: false,
    message: ''
}

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.subscribe('/user/'+username+'/private', onPrivateMessage);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    stompClient.send("/app/private-message",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}



function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            receiver: userData.receiver,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function sendPrivateMessage(event){
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            receiver: userData.receiver,
            type: 'CHAT'
        };

        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var userTab = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';


        userTab.id ='user-' + message.sender;
        userTab.textContent = message.sender;
        userTab.addEventListener('click', function() {
            userData.receiver = message.sender;
        });
        chatList.appendChild(userTab);

    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';

        var userToRemove = document.getElementById('user-' + message.sender);
        if (userToRemove) {
            chatList.removeChild(userToRemove);
        }

    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function onPrivateMessage(payload){
    var message = JSON.parse(payload.body);

    console.log(message)

    var messageElement = document.createElement('li');
    var existingUserTab = document.getElementById('user-' + message.sender);
    var sender = message.sender;

    if(message.sender === sender) {

    }
    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        chatContainer = document.getElementById(`chat-container-${message.sender}`);
        if (!chatContainer) {
            onPrivateChat(message.sender);
            chatContainer = document.getElementById(`chat-container-${message.sender}`);
        }
    }

    console.log(message.sender)
    if(!existingUserTab){
        var userTab = document.createElement('li');
        userTab.id = 'user-' + message.sender;
        userTab.textContent = message.sender;
        userTab.addEventListener('click', function() {
            userData.receiver = message.sender;
        });
        chatList.appendChild(userTab);
    }


    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    var messageArea = chatContainer.querySelector('.message-area');
    if (messageArea) {
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

function onPrivateChat(username){
    var newChatContainer = document.createElement('div');
    newChatContainer.id = `chat-container-${username}`;
    newChatContainer.classList.add('chat-container');

    messageArea.id = `messageArea-${username}`;
    newChatContainer.appendChild(messageArea);
    newChatContainer.appendChild(messageForm);

    chatPage.appendChild(newChatContainer);

    newChatContainer.style.display = 'none';

}


function onUserTabClick(event) {
    var clickedUser = event.target.textContent;
    userData.receiver = clickedUser;

    var chatContainer = document.getElementById(`chat-container-${clickedUser}`);
    if (!chatContainer) {
        onPrivateChat(clickedUser);
    }

    var allChatContainers = document.querySelectorAll('.chat-container');
    allChatContainers.forEach(container => container.style.display = 'none');

    chatContainer = document.getElementById(`chat-container-${clickedUser}`);
    if (chatContainer) {
        chatContainer.style.display = 'block';
    }
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendPrivateMessage, true)
chatList.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        onUserTabClick(event);
    }
});
