import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:3001/api/petsitting/";

class ApiUserervice {

    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
    getMyPets() {
        return axios.get(API_URL + "mypets", { headers: authHeader() });
    }
    registerPet(NewPet) {
        return axios.post(API_URL + "newpet", {NewPet}, { headers: authHeader() });
    }
}
export default new ApiUserervice();