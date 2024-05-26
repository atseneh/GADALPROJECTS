import axios from 'axios'
import BASE_URL from './apiConfig'
async function createCampaign(campaignData:any){
try {
    const {data} = await axios.post(`${BASE_URL}notification/createCampaign`,campaignData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default createCampaign  