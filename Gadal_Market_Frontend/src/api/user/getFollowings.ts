import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getFollowings(user:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}users/followings/${user}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getFollowings