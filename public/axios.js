import axios from "axios";
const api= axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers:{
        Accept: 'application/json',
        'Content-Type':'aplication/json'
    },
    withCredentials:false,

})
export default api
