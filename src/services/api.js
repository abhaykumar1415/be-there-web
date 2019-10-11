import URL from './constants';
import Data from './data';

const axios = require('axios');

const postAttendance = (_id, payload) => {
  const url = URL.BASE_URL + URL.USERS + _id;
  return axios.put(url, payload)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
  });
}

const getAttendance = () => {
  let _id = Data.getData('user')._id;
  const url = URL.BASE_URL + URL.USERS  + URL.ME_TODAY + _id;
  return axios.get(url)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    })
}

const postUser = async (payload) => {
  const url = URL.BASE_URL + URL.USERS;
  return await axios.post(url, payload)
  .then(function (response) {
    let user = Data.getData('user');
    user._id = response.data.data._id;
    Data.setData({title: 'user', data: user});
    return response.data.data;
  })
  .catch(function (error) {
    console.log(error);
  });
}

const API = {postAttendance, getAttendance, postUser};

export default API;