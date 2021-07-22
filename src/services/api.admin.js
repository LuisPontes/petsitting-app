import axios from "axios";
import authHeader from './auth-header';

// const API_URL = "http://192.168.0.10:3001/api/pet/";
const API_URL = "http://localhost:3001/api/admin/";


class ApiAdminService {

    getUsersContent() {
        return axios.get(API_URL + 'users', { headers: authHeader() });
    }

}
export default new ApiAdminService();