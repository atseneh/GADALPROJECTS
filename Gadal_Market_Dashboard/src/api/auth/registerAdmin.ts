import axios from 'axios'
import BASE_URL from '../apiConfig'
async function registerAdmin(adminData:any){
try {
    const {data} = await axios.post(`${BASE_URL}auth/registerAdmin`,adminData)
    return data
} catch (error:any) {
    throw error?.response.data
}
}
export default registerAdmin  