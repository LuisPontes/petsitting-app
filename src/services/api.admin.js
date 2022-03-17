import axios from "axios";
import authHeader from './auth-header';
import {API_URL_ADMIN} from '../Constants'
// const API_URL = "http://192.168.0.10:3001/api/pet/";
// const API_URL = "http://localhost:3001/api/admin/";


class ApiAdminService {

    getUsersContent() {
        return axios.get(API_URL_ADMIN + 'users', { headers: authHeader() });
    }

    getServiceTaxContent() {
        return axios.get(API_URL_ADMIN + 'servicetax', { headers: authHeader() });
    }
    updateServiceTax(service) {
        return axios.post(API_URL_ADMIN + "servicetax", {service}, { headers: authHeader() });
    }
}
export default new ApiAdminService();