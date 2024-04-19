import axios from 'axios'
import BASE_URL from '../apiConfig'
type UserAdsArgs = {
userId:string,
soldOut?:boolean,
disabled?:boolean,
deleted?:boolean,
}
async function getUsersAds(args:UserAdsArgs){
const {userId,soldOut,disabled,deleted}  = args
let url = `${BASE_URL}products?consignee=${userId}`
if(soldOut){
    url = `${url}&derivedState=5`
}
if(disabled){
    url = `${url}&state=4`
}
if(deleted){
    url = `${url}&recordStatus=3`
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