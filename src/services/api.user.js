import axios from "axios";
import authHeader from './auth-header';
import {API_URL_USER} from '../Constants'

// const API_URL = "http://192.168.0.10:3001/api/pet/";
// const API_URL = "http://localhost:3001/api/pet/";


class ApiUserervice {

    getPublicContent() {
        return axios.get(API_URL_USER + 'all');
    }

    getServiceTaxContent() {
        return axios.get(API_URL_USER + 'servicetax');
    }

    getUserBoard() {
        return axios.get(API_URL_USER + 'user', { headers: authHeader() });
    }
    getMyPets() {
        return axios.get(API_URL_USER + "mypets", { headers: authHeader() });
    }
    registerPet(NewPet) {
        return axios.post(API_URL_USER + "newpet", {NewPet}, { headers: authHeader() });
    }
    deletePet(id) {
        return axios.post(API_URL_USER + "deletePet", {id}, { headers: authHeader() });
    }
    getMyReserves(){
        return axios.get(API_URL_USER + "reserves", { headers: authHeader() });
    }
   
    registerReserve(NewEvent) {
        return axios.post(API_URL_USER + "newevent", {NewEvent}, { headers: authHeader() });
    }
    deleteReserve(id) {
        return axios.post(API_URL_USER + "deleteEvent", {id}, { headers: authHeader() });
    }
}
export default new ApiUserervice();