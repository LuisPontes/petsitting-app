import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://192.168.0.10:3001/api/pet/";


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
    deletePet(id) {
        return axios.post(API_URL + "deletePet", {id}, { headers: authHeader() });
    }
    getMyReserves(){
        return axios.get(API_URL + "reserves", { headers: authHeader() });
    }
    registerReserve(NewEvent) {
        return axios.post(API_URL + "newevent", {NewEvent}, { headers: authHeader() });
    }
    deleteReserve(id) {
        return axios.post(API_URL + "deleteEvent", {id}, { headers: authHeader() });
    }
}
export default new ApiUserervice();