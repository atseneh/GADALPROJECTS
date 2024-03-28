import axios from 'axios'
import BASE_URL from './apiConfig'
async function getUsers(isAdmin:boolean){
try {
    const {data} = await axios.get(
        `${BASE_URL}users?recordStatus=1&isAdmin=${isAdmin}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getUsers