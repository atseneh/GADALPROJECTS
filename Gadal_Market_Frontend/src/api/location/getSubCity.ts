import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getSubcities(location:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}subCities?location=${location}&recordStatus=1`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getSubcities