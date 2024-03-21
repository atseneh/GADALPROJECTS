import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getFavourites(){
try {
    const {data} = await axios.get(
        `${BASE_URL}users/favorites/653f2561c250b545217d192b`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getFavourites