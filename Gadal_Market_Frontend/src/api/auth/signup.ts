import axios from 'axios'
import BASE_URL from '../apiConfig'
async function signUp(userData:any){
try {
    const {data} = await axios.post(`${BASE_URL}auth/signup`,userData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data)
}
}
export default signUp  