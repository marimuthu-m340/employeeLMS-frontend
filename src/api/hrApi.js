import axios from "axios";

const hrApi = axios.create({

  baseURL: "http://localhost:5000/api/hr",

  headers: {
    "Content-Type": "application/json",
  },

});

export default hrApi;