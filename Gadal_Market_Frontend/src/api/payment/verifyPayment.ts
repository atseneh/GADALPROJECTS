import axios from 'axios'
import BASE_URL from '../apiConfig'
async function verifyPayment(trxDetail:{
    trxRef:string,
    serviceType:string
}){
const {trxRef,serviceType} = trxDetail
try {
    const {data} = await axios.put(
        `${BASE_URL}Transaction/verify/${trxRef}`,{serviceType}
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default verifyPayment