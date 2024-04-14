import axios from 'axios'
import BASE_URL from '../apiConfig'
async function signIn(credentials:{emailOrPhone:string,password:string}){
try {
    const {data} = await axios.post(`${BASE_URL}auth/signin`,credentials)
    return data
} catch (error:any) {
    console.log(error)
    throw error
}
}
export default signIn  