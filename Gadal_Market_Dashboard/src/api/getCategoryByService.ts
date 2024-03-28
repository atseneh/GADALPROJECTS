import axios from 'axios'
import BASE_URL from './apiConfig'
async function getCategoriesByService(serviceID:number){
try {
    const {data} = await axios.get(
        `${BASE_URL}categories?serviceId=${serviceID}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getCategoriesByService