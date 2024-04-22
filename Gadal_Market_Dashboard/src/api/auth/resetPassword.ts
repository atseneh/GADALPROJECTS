import axios from 'axios'
import BASE_URL from '../apiConfig'
async function resetPass(passInfo:{password:string,phoneNumber:string,}){
try {
    const {data} = await axios.put(`${BASE_URL}auth/resetPassword`,passInfo)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default resetPass