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

// Binary search algorithm from previous exercise
const binarySearch = (word) => {
    let startIndex = 0;
    let endIndex = words.length;
    while(startIndex !== endIndex) {
        let middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);

        if (startIndex === middleIndex) {
            if (words[endIndex] === word) {
                return true;
            } else {
                break;
            }
        }

        if (words[middleIndex] === word) {
            return word;
        } else if (words[middleIndex] < word) {
            startIndex = middleIndex;
        } else if (words[middleIndex] > word) {
            endIndex = middleIndex;
        } else {
            return 'ERROR';
        }
    }
    return false;
}

const lookForFalsePositives = (bloomFilter) => {
    function makeWord(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    for (let i = 0; i < 100000; i ++) {
        const word = makeWord(5);
        if (bloomFilter.isInWords(word) && !binarySearch(word)) {
            console.log(word);
        }
    }
}

lookForFalsePositives(bloomFilter);

// Known false positives: tnfqm, actlm, rojbx, kaiyx, ptjrp, vwjct, amlwq, yviel, lkyov, kdkkb, fdjxx, xgjsc