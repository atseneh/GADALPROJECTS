import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getFavourites(){
const token = localStorage.getItem('token')
try {
    const {data} = await axios.get(
        `${BASE_URL}users/favorites`,
         {
            headers:{
                Authorization:`Bearer ${token}`
            }
         }
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getFavourites