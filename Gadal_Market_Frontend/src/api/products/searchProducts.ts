import axios from 'axios'
import BASE_URL from '../apiConfig'
async function search(searchTerm:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}searchProducts?searchTerm=${searchTerm}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default search