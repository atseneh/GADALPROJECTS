import axios from 'axios'
import BASE_URL from '../apiConfig'

async function unfollowUser(data:{
    user:string,
    userToUnfollow:string
}){
const {user,userToUnfollow} = data
try {
    const {data} = await axios.put(
        `${BASE_URL}users/unFollow/${user}/${userToUnfollow}`,
        )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default unfollowUser  