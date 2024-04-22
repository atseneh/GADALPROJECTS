import axios from 'axios'
import BASE_URL from '../apiConfig'
async function verifyPhone(verificationInfo:{verificationId:string,phoneNumber:string,code:string}){
try {
    const {data} = await axios.put(`${BASE_URL}auth/verifyPhone`,verificationInfo)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default verifyPhone  