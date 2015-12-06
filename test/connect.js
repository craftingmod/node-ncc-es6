import Promise from 'promise';
import debug from 'debug';
import Chat from '../lib/chat.js';

const log = debug('ncc:session');

let chat = new Chat();
chat.addEvent('message',(message,session) => {
	  console.log(message);
	  if (message.room.load === 2 && !message.room.loading) {
	    session.syncRoom(message.room);
	  }
	  if (message.type !== 'text') return;
	  if (message.message === '!es6txt') {
	    session.sendText(message.room, 'Hello, world!');
	  }
	  if (message.message === '!es6sticker') {
	    session.sendSticker(message.room, 'moon_and_james-2');
	  }
	  if (message.message.slice(0, 5) === '!node' &&
	    message.user.id === session.username
	  ) {
	    // Meh. I'm too lazy.
	    session.sendText(message.room, eval(message.message.slice(6)));
	  }
});
chat.login();