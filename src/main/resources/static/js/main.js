'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var chatList = document.querySelector('#chatList');

var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var messageFormPrivate = document.querySelector('#messageFormPrivate');
var messageInputPrivate = document.querySelector('#messagePrivate');
var messageAreaPrivate = document.querySelector('#messageAreaPrivate');
var connectingElementPrivate = document.querySelector('.connectingPrivate');

var groupChatArea = document.querySelector('.chat-container');
var privateChatArea = document.querySelector('.chat-container-private');
var chatRoom = document.querySelector('#chatRoom');

var messageAreaUserPrivate = document.querySelector('#messageAreaUserPrivate');

var stompClient = null;
var username = null;

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


window.onload = function () {
    groupChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));
    privateChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));

};

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        groupChatArea.classList.remove('hidden', usernamePage.classList.contains('hidden'));

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.subscribe('/user/' + username + '/private', onPrivateMessage);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    )

    stompClient.send("/app/private-message",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    )
    connectingElement.classList.add('hidden');
    connectingElementPrivate.classList.add('hidden');

}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
    connectingElementPrivate.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElementPrivate.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
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

function sendPrivateMessage(event) {
    var messageContent = messageInputPrivate.value.trim();

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInputPrivate.value,
            receiver: userData.receiver,
            type: 'CHAT'
        };
        displayMessage(chatMessage);
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        displayUpdatedMessages(`${username}-${userData.receiver}`);
        messageInputPrivate.value = '';
    }
    event.preventDefault();
}

function displayMessage(message) {
    var messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');
    messageElement.id = `${username}-${message.receiver}`

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);

    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);

    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);
    messageAreaPrivate.appendChild(messageElement);
    messageAreaPrivate.scrollTop = messageAreaPrivate.scrollHeight;
}

function displayUpdatedMessages(userMessage) {

    var elements = document.querySelectorAll(`#messageAreaPrivate li[id=${userMessage}]`);

    var newUl = document.createElement('ul');
    newUl.id = 'messageAreaUserPrivate';

    elements.forEach(function (element) {
        var newLi = element.cloneNode(true);
        newUl.appendChild(newLi);
    });

    const userType = userMessage.split('-')[1];
    userData.receiver = userType;

    privateChatArea.classList.remove('hidden', usernamePage.classList.contains('hidden'));
    messageAreaPrivate.classList.add('hidden', usernamePage.classList.contains('hidden'));
    groupChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));

    var privateChatHeader = document.querySelector('#privateChatHeader');
    if (privateChatHeader) {
        privateChatHeader.textContent = 'Private Chat with ' + userType;

        document.querySelectorAll('#chatList li').forEach(function (li) {
            li.style.backgroundColor = '';
            if (li.id === 'user-' + userType) {
                li.style.backgroundColor = '#D3D3D3';
            }
        });
    }


    messageAreaUserPrivate.innerHTML = newUl.innerHTML;
    messageAreaUserPrivate.scrollTop = messageAreaUserPrivate.scrollHeight;

}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var userTab = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';


        userTab.id = 'user-' + message.sender;
        userTab.textContent = message.sender;


        userTab.addEventListener('click', function () {
            userData.receiver = message.sender;
            document.querySelectorAll('#chatList li').forEach(function (li) {
                li.style.backgroundColor = '';
            });

            userTab.style.backgroundColor = '#D3D3D3';

            privateChatArea.classList.remove('hidden', usernamePage.classList.contains('hidden'));
            groupChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));
            messageAreaPrivate.classList.add('hidden', usernamePage.classList.contains('hidden'));

            var privateChatHeader = document.querySelector('#privateChatHeader');
            if (privateChatHeader) {
                privateChatHeader.textContent = 'Private Chat with ' + message.sender;
            }
            displayUpdatedMessages(`${username}-${message.sender}`);

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


function onPrivateMessage(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var existingUserTab = document.getElementById('user-' + message.sender);

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');
        messageElement.id = `${username}-${message.sender}`

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

    if (!existingUserTab) {
        var userTab = document.createElement('li');
        userTab.id = 'user-' + message.sender;
        userTab.textContent = message.sender;

        userTab.addEventListener('click', function () {

            userData.receiver = message.sender;
            document.querySelectorAll('#chatList li').forEach(function (li) {
                li.style.backgroundColor = '';
            });
            userTab.style.backgroundColor = '#D3D3D3';
            privateChatArea.classList.remove('hidden', usernamePage.classList.contains('hidden'));
            groupChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));
            messageAreaPrivate.classList.add('hidden', usernamePage.classList.contains('hidden'));

            var privateChatHeader = document.querySelector('#privateChatHeader');
            if (privateChatHeader) {
                privateChatHeader.textContent = 'Private Chat with ' + message.sender;
            }

            displayUpdatedMessages(`${username}-${message.sender}`);

        });

        chatList.appendChild(userTab);

    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageAreaPrivate.appendChild(messageElement);
    messageAreaPrivate.scrollTop = messageAreaPrivate.scrollHeight;

    displayUpdatedMessages(`${username}-${message.sender}`);

}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function chatRoomEvent(event) {
    if (event.target.id === 'chatRoom') {
        userData.receiver = '';

        document.querySelectorAll('#chatList li').forEach(function (li) {
            li.style.backgroundColor = '';
        });
        privateChatArea.classList.add('hidden', usernamePage.classList.contains('hidden'));
        groupChatArea.classList.remove('hidden', usernamePage.classList.contains('hidden'));
    }
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
messageFormPrivate.addEventListener('submit', sendPrivateMessage, true)
chatRoom.addEventListener('click', chatRoomEvent);
