const fs = require('fs');
const md5 = require("blueimp-md5");

class BloomFilter {
    constructor(words) {
        let bitmap = Array(16*16*16*16*16*16).fill(0);

        for (let i = 0; i < words.length; i++) {
            const hashArray = this.getHashArrayOfIntegers(words[i]);
            hashArray.forEach((hashInt) => bitmap[hashInt] = 1);
        }

        this.bitmap = bitmap;
    }

    isInWords = (word) => {
        const hashArray = this.getHashArrayOfIntegers(word);
        for (let i = 0; i < hashArray.length; i++) {
            if (this.bitmap[hashArray[i]] === 0) {
                return false;
            }
        }
        return true;
    }

    spellCheck = (sentence) => {
        const words = sentence.split(" ").map((word) => word.toLowerCase());
        for (let i = 0; i < words.length; i++) {
            if (!this.isInWords(words[i])) {
                console.log(`"${words[i]}" is not a valid word`);
            }
        }
    }

    getHashArrayOfIntegers = (word) => {
        const hash = md5(word);
        let hashArray = hash.match(/.{1,6}/g);
        return hashArray.map((hex) => parseInt(hex, 16));
    }
}



const words =  fs.readFileSync('./words.txt', {encoding: 'utf8'}).toString().split("\n");
const bloomFilter = new BloomFilter(words);
bloomFilter.spellCheck("There are many circumstences were we need to find out if something is a menber of a set");
