import cookie from 'react-cookies'

const setCookie = (payload) => {
  cookie.save(payload.title, payload.data, { path: '/' })
}

const getCookie = (payload) => {
  return cookie.load(payload);
}

const deleteCookie = (payload) => {
    cookie.remove('userId', { path: '/' });
}

const getLoginStatus = () => {
  console.log('user :', cookie.load('user'));
  return cookie.load('user');
}

const Cookie = {setCookie, getCookie, deleteCookie, getLoginStatus};

export default Cookie;