import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getBrandByCategory(category:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}productBrands?category=${category}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getBrandByCategory