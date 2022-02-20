import apiSetting from './setting';
import axios from "axios";
const { API_URL, API_KEY } = apiSetting;

const per_page = 40;
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true';
const BASE_URL = `${API_URL}/?key=${API_KEY}&per_page=${per_page}&${parameters}`;


export const getImages = async (search, page) => {
    try {
        const response = await axios.get(`${BASE_URL}&q=${search}&page=${page}`);
        return await response.data;
    }
    catch (error) {
        console.log(error);
    }
}