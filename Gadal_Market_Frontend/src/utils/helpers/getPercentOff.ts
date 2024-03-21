export default function getPercentOff(previousPrice:number,currentPrice:number){
    const diff = previousPrice - currentPrice
    const diffInPercent = (diff/previousPrice)*100
    return diffInPercent.toFixed(0)
}