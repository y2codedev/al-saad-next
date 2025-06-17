import axios from "axios";

const serverAxios = axios.create({
  baseURL: "https://stagingapp.alsaadhome.com/api/v25/",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "country-id": 2,
    currency: "aed",
    "retailer-id": "1",
    Authorization: "gUmwgu9OVfXE9LVCaAU8xw74CownYWQ0HIfFGvWw",
    "device-type": "web",
    lng: "en",
  },
});

export default serverAxios;
