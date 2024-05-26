import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getCurrencies(){
try {
    const {data} = await axios.get(
        `${BASE_URL}currencies?recordStatus=1`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getCurrencies