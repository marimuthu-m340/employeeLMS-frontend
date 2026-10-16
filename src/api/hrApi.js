import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const hrApi = axios.create({

baseURL: `${API_BASE_URL}/api/hr`,
  headers: {
    "Content-Type": "application/json",
  },

});

export default hrApi;