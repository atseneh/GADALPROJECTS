import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getOtp(phoneNumber:string){
try {
    const {data} = await axios.post(`${BASE_URL}auth/manuallyVerifyPhone`,{phoneNumber})
    return data
} catch (error:any) {
    console.log(error)
    throw error
}
}
export default getOtp  