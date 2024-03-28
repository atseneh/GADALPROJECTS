import axios from 'axios'
import BASE_URL from './apiConfig'
async function getAttributesForFilter(category:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}ExistedcategoryAttributes?category=${category}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getAttributesForFilter