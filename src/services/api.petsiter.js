import axios from "axios";
import authHeader from './auth-header';
import {API_URL_PETSITER,API_URL_ADMIN} from '../Constants'
// const API_URL = "http://192.168.0.10:3001/api/pet/";
// const API_URL = "http://localhost:3001/api/admin/";


class ApiPetSiterService {

    getAdminOpenReserves(){
        return axios.get(API_URL_ADMIN + "openReserves", { headers: authHeader() });
    }
   
    getOpenReserves(){
        return axios.get(API_URL_PETSITER + "openReserves", { headers: authHeader() });
    }
}
export default new ApiPetSiterService();