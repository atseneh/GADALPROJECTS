import axios from 'axios'
import BASE_URL from './apiConfig'
async function getUserById(id:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}users/${id}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getUserById