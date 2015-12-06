import Session, { Credentials } from './index.js';
import * as config from '../config.js';
import fs from 'fs';
import path from 'path';
import values from 'lodash.values';
import Promise from 'promise';

import Prompt from 'prompt';
import debug from 'debug';
import HashMap from 'hashmap';

export const MESSAGE = 'message';
export const ERROR = 'error';
const log = debug('ncc-lib:Chat');
const PromptConfig = {
    properties: {
      username: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'you are babu',
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
};

export default class chat {
	constructor(){
		console.log("hello, constructor!");
		this.mapArray = [];
		this.maps = new HashMap();
	}
	addEvent(type,func){
		if(!this.maps.has(type)) {this.maps.set(type,[])}
		this.maps.get(type).push(func);
	}
	_applyEvents(_session){
		let i = 0;
		let maps = this.maps;
		return new Promise((resolve) => {
			if(maps.count() == 0) return resolve();
			maps.forEach((value,key) => {
		    i += 1;
			let arr = maps.get(key);
			arr.forEach((element,index,array) => {
				_session.on(key,(param) => {element(param,_session)});
			});
			if(i == maps.count()){
				return resolve();
			}
        	});
		});
	}
	_sessionLogin(){
		
	}
	login(){
		let _this = this;
		new Promise((resolve,reject) => {
					console.log("Hi!");
	        fs.exists('../auth.json', (exists) => {
				if(!exists) return resolve();
				else return reject();
			});
		})
		.then(() => {
			Prompt.start();
			return new Promise(resolve => {
				Prompt.get(PromptConfig,(err,result) => {
				resolve(result);
				   });	
			})
			.then(result => new Credentials(result.username,result.password));
		}, () => {
			log('reading json');
			return new Promise((resolve, reject) => {
				fs.readFile('../auth.json', 'utf8', (err, data) => {
				if (err) return reject();
				return resolve(data);
				});
			})
			.then(JSON.parse, () => null)
			.then(cookieJar => new Credentials(null,null,cookieJar));
		})
		.then((credit) => {
			log('received credit');
			_this.credentials = credit;
			return _this.credentials.validateLogin();
		},() => log("no received credit. falled."))
		.then(username => {
		    console.log('Logged in with username', username);
			_this.credentials.username = username;
		}, () => {
	 	    console.log('Logging in');
		    return _this.credentials.login()
	            .then(() => fs.writeFile('../auth.json',
	            JSON.stringify(_this.credentials.getCookieJar())));
		})
		.then(() => {_this.session = new Session(_this.credentials);})
		.then(()=>{return _this._applyEvents(_this.session);})
		.then(()=>{_this.session.connect()})
		.catch(err => {
			console.log(err.stack);
		});
	}
}