export default function capitalizeFirstLetter(word:string){
const [firstLetter,...others] = word
return `${firstLetter.toUpperCase()}${others.join('')}`
}