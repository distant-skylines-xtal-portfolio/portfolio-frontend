const engCharacterPool = "qwertyuiopasdfghjklzxcvbnm`1234567890-=~!@$#$%^&*()_+[]{};':<>/?";
const engCharacterPoolAlphabet = "qwertyuiopasdfghjklzxcvbnm"
export function getRandomCharEng(alphabetOnly:boolean):string {
    const randomIndex = alphabetOnly ? 
    Math.floor(Math.random() * engCharacterPoolAlphabet.length) : 
    Math.floor(Math.random() * engCharacterPool.length);
    const randomChar = alphabetOnly ?  engCharacterPoolAlphabet[randomIndex] : engCharacterPool[randomIndex];

    return randomChar
    
}

export function getRandomCharsEng(length:number, alphabetOnly:boolean):string {
    let finalString = '';
    for (let i = 0; i < length; i++) {
            finalString += getRandomCharEng(alphabetOnly);
    }
    return finalString;
}