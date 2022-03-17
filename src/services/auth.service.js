import axios from "axios";
import {API_URL_AUTH} from '../Constants'
// const API_URL = "http://192.168.0.10:3001/api/auth/pet/";
// const API_URL = "http://localhost:3001/api/auth/pet/";


class AuthService {
  login(username, password) {
    return axios
      .post(API_URL_AUTH + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          console.log("response.data",response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    window.location.href = '/home';
  }

  register(username, email, password) {
    console.log(API_URL_AUTH + "signup");
    return axios.post(API_URL_AUTH + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
