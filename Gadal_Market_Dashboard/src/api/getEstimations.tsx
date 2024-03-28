import axios from 'axios'
import BASE_URL from './apiConfig'
interface queryData  {
    service?:number;
    transactionType?:number;
}
async function getEstimations(query:queryData){
const {service,transactionType} = query
let url = `${BASE_URL}estimations?estimationState=1`
if(service){
    url = `${url}&service=${service}`
}
if(transactionType) {
    url = `${url}&transactionType=${transactionType}`
}
try {
    const {data} = await axios.get(url)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getEstimations