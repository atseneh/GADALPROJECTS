import axios from 'axios'
import BASE_URL from '../apiConfig'
type UserAdsArgs = {
userId:string,
soldOut?:boolean,
disabled?:boolean,
deleted?:boolean,
serviceType?:number
}
async function getUsersAds(args:UserAdsArgs){
const {userId,soldOut,disabled,deleted,serviceType}  = args
let url = `${BASE_URL}products?consignee=${userId}`
if(soldOut){
    url = `${url}&recordStatus=1`
}
if(disabled){
    url = `${url}&recordStatus=2`
}
if(deleted){
    url = `${url}&recordStatus=3`
}
if(serviceType){
    url = `${url}&productType=${serviceType}`
}
try {
    const {data} = await axios.get(
        url
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getUsersAds