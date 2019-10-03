import cookie from 'react-cookies';
import Constants from './constants';
const Cryptr = require('cryptr');
const cryptr = new Cryptr(Constants.SECRET_KEY);

const setData = (payload) => {
  // console.log(' in set cookie')
  // const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  // const encryptedString = cryptr.encrypt(payload.data);
  // cookie.save(payload.title, payload.data, { path: '/', expires })
  let data = JSON.stringify(payload.data);
  window.localStorage.setItem(payload.title, data);
}

const getData = (payload) => {
  let data = JSON.parse(window.localStorage.getItem(payload));
  // return cookie.load(payload);
  return data;
}

const deleteData = (payload) => {
    // cookie.remove('userId', { path: '/' });
}

const getLoginStatus = () => {
  let data = getData('user');
  console.log('getLoginStatus data: ', data);
  return data;
  // console.log('user :', cookie.load('user'));
  // return cookie.load('user');
}

const Cookie = {setData, getData, deleteData, getLoginStatus};

export default Cookie;