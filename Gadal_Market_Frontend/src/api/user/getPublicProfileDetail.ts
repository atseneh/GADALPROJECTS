import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getPublicProfileDetail(userId:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}publicProfileDetail/${userId}`,
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getPublicProfileDetail