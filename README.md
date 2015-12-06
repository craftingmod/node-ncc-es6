# node-ncc-es6
네*버 cafe chat library for Node.js

이슈나 기타등등은 밑의 url에서 질문하길 바람

자세한 도움말: https://github.com/yoo2001818/node-ncc-es6

- 사용법

test 디렉토리에 적당하게 만든다.

import Chat from '../lib/chat.js';
chat.addEvent('message',(message,session) => {
	  console.log(message);
});

끝