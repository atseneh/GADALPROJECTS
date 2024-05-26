import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getFavourites(sortCriteria?:string){
const token = localStorage.getItem('token')
let url = `${BASE_URL}users/favorites`
if(sortCriteria){
    url = `${url}?sortCriteria=${sortCriteria}`
}
try {
    const {data} = await axios.get(
        url,
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