import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getPackageDefinitions(){
try {
    const {data} = await axios.get(
        `${BASE_URL}packageDefinition`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getPackageDefinitions