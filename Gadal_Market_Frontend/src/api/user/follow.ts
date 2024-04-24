import axios from 'axios'
import BASE_URL from '../apiConfig'

async function followUser(data:{
    user:string,
    userToFollow:string
}){
const {user,userToFollow} = data
try {
    const {data} = await axios.put(
        `${BASE_URL}users/follow/${user}/${userToFollow}`,
        )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default followUser  