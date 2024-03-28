import axios from 'axios'
import BASE_URL from './apiConfig'
async function postEstimation(estimationData:any){
try {
    const {data} = await axios.post(`${BASE_URL}estimations`,estimationData,{headers:{"Content-Type":'multipart/form-data'}})
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default postEstimation  