import axios from 'axios'
import BASE_URL from './apiConfig'
async function getWeredas(subCity:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}wereda?subCity=${subCity}&recordStatus=1`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getWeredas