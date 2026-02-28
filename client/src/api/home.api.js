import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = API_BASE_URL;

export const getHomeData = async () => {
  const response = await axios
    .get("/home")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error fetching home data:", err);
      throw err;
    });
  return response;
};
