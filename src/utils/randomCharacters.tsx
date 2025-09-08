const engCharacterPool = "qwertyuiopasdfghjklzxcvbnm`1234567890-=~!@$#$%^&*()_+[]{};':<>/?";

export function getRandomCharEng():string {
    const randomIndex = Math.floor(Math.random() * engCharacterPool.length);

    return engCharacterPool[randomIndex];
}