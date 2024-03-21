import axios from 'axios'
import BASE_URL from '../apiConfig'
async function createPackage(packageData:any){
try {
    const {data} = await axios.post(`${BASE_URL}package`,packageData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default createPackage  