import api from 'axios';

export const joinRoom = async ({ commit }, param) => {
    const endpoint = param.code + '/join-room';
    let result = {}
    try {
        await api.post(endpoint, { username: param.username }).then(response => 
        {
          result = response;
        });
    } catch (error) {
      return { error: error.message };
    }

    return result;
  };

export const startGame = async ({ commit }, param) => {
  const endpoint = param.code + '/start-game';
  let result = {}
  try {
      await api.post(endpoint).then(response => 
      {
        console.log(response);
        result = response;
      });
  } catch (error) {
    return { error: error.message };
  }

  return result;
};

export const checkRoomStatus = async ({ commit }, param) => {
  const endpoint = param.code + '/room-status';
  let result = {}
  try {
      await api.get(endpoint).then(response =>
      {
        result = response;
      });
  } catch (error) {
    return { error: error.message };
  }

  return result;
};

export const getRoomFormat = async ({ commit }, param) => {
  const endpoint = param.code + '/round/' + param.round;
  let result = {}
  try {
      await api.get(endpoint).then(response =>
      {
        result = response;
      });
  } catch (error) {
    return { error: error.message };
  }

  return result;
};

export const sendPlayerAnswer = async ({ commit }, param) => {
  const endpoint = param.code + '/round/' + param.round + "/" + param.playerID;
  let result = {}
  try {
      await api.post(endpoint).then(response => 
      {
        console.log(response);
        result = response;
      });
  } catch (error) {
    return { error: error.message };
  }

  return result;
};

// // export default {
// //   joinRoom(context, credentials) {
// //     return axios.post(LOGIN_URL, credentials).then(response => {
// //       localStorage.setItem('token', response.data.token);
// //       this.user.authenticated = true;
// //     });
// //   },
// }