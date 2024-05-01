import axios from 'axios'
import BASE_URL from './apiConfig'
async function getDashboardMetrics(){
try {
    const {data} = await axios.get(
        `${BASE_URL}dashboard-metrics`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getDashboardMetrics