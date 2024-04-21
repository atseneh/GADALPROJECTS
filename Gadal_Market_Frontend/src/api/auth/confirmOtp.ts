import axios from 'axios'
import BASE_URL from '../apiConfig'
async function confirmOtp(verificationInfo:{verificationId:string,phoneNumber:string,code:string}){
try {
    const {data} = await axios.post(`${BASE_URL}auth/confirmOtp`,verificationInfo)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default confirmOtp  