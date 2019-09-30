import URL from './constants';
import Cookie from './cookie';


const axios = require('axios');

const postAttendance = (_id, payload) => {
  const url = URL.BASE_URL + URL.USERS + _id;
  console.log('URL :', url);
  return axios.put(url, payload)
  .then(function (response) {
    console.log("Markig attendance :",response);
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
  });
}

const getAttendance = () => {
  let _id = Cookie.getCookie('user')._id;
  console.log('getAttendance  _id :', _id);
  const url = URL.BASE_URL + URL.USERS  + URL.ME_TODAY + _id;
  console.log('URL :', url);
  return axios.get(url)
    .then(function (response) {
      console.log("Get Attendance :",response);
      return response.data.attendanceMarked;
    })
    .catch(function (error) {
      console.log(error);
    })
}

const postUser = async (payload) => {
  const url = URL.BASE_URL + URL.USERS;
  console.log('URL :', url);
  return await axios.post(url, payload)
  .then(function (response) {
    console.log("POST USER RESPONSE :", response);
    let user = Cookie.getCookie('user');
    user._id = response.data.data._id;
    console.log('Uer _id :', user);
    Cookie.setCookie({title: 'user', data: user});
    return response.data.data;
  })
  .catch(function (error) {
    console.log(error);
  });
}

const API = {postAttendance, getAttendance, postUser};

export default API;