import axios from 'axios'
import BASE_URL from './apiConfig'
async function getSimilarItems(id:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}products/similarProducts/${id}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getSimilarItems