import axios from 'axios'
import BASE_URL from './apiConfig'
async function createSubCity(subCityData:any){
try {
    const {data} = await axios.post(`${BASE_URL}subCities`,subCityData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default createSubCity  