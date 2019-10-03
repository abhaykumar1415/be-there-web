import cookie from 'react-cookies'

const setCookie = (payload) => {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  cookie.save(payload.title, payload.data, { path: '/', expires })
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