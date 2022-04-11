const FS = require('fs');
const axios = require('axios');
BASE_URL = "https://www.sefaria.org/api/texts/";
PARAMS = "?ven=The_Contemporary_Torah,_Jewish_Publication_Society,_2006&vhe=Miqra_according_to_the_Masorah&lang=he&aliyot=0";
const CHUMASHIM = [{ 'Genesis.': 50 }, { 'shmot.': 40 }, { 'vaikra.': 27 }, { 'bamidbar.': 36 }, { 'dvarim.': 34 }];
const VAL = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }

const VAL_OBVERSE = {};

Object.keys(VAL).forEach(function (key) {
    VAL_OBVERSE[VAL[key]] = key;
    VAL_OBVERSE[0] = '';
});

const gemOfTorah = {};
const arrayOfObjects = [];
getChumashimAndPrintFile(0);

// setTimeout(() => {
//     writeAFile()
// }, 200000);

// getTora(BASE_URL + CHUMASH + i + PARAMS).then(data => {
//     data.json().then(perek => {
//         setListOfNumbersInTora(gemOfTorah, perek);
//     })
// });

function writeAFile() {
    const ObjectJson = JSON.stringify(gemOfTorah);
    FS.writeFileSync("gematriot.json", ObjectJson);
}

// for (let i = 0; i < CHUMASHIM.length; i++) {
//     const chumash = CHUMASHIM[i];
//     console.log(chumash);
    
//     console.log(CHUMASH);
//     // const range = chumash[CHUMASH]
//     // for (let i = 0; i <= range; i++) {
//     //     axios.get(BASE_URL + CHUMASH + i + PARAMS).then(resp => {
//     //         setListOfNumbersInTora(gemOfTorah, resp.data);
//     //     });
//     // }
// }

function getChumashimAndPrintFile(index) {
    if (index >= CHUMASHIM.length) {
        setTimeout(() => {
                writeAFile()
            }, 60000);
            return;
    }
    const chumash = CHUMASHIM[index];
    console.log('chumash', chumash);
    const CHUMASH = Object.keys(chumash)[0];
    const range = chumash[CHUMASH];
    for (let i = 0; i <= range; i++) {
            axios.get(BASE_URL + CHUMASH + i + PARAMS).then(resp => {
                setTimeout(() => {
                setListOfNumbersInTora(gemOfTorah, resp.data);
            }, 500);
            });
        }
        setTimeout(() => {
            getChumashimAndPrintFile(index + 1)
            }, 60000);
}

    



function setListOfNumbersInTora(gemOfTorah, perek) {
    if (perek.he) {
        console.log(perek.he.length);
        perek.he.forEach((e, index) => {
            // console.log(e, index);
            const sourcePasuk = addIndexPasuk(index + 1);
            wordsOfPasuk = e.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                        word = clean(word);
                        let dict = {};
                        dict[word] = perek.heRef + sourcePasuk; 
                        if (!gemOfTorah[calculate(word)]) {
                            gemOfTorah[calculate(word)] = [];
                        }
                        // console.log('word:', word, rejects(word) );
                        wordWithoutNikud = rejects(word);
                        gemOfTorah[calculate(word)] = gemOfTorah[calculate(word)].filter(w => rejects(Object.keys(w)[0]) != wordWithoutNikud);
                        gemOfTorah[calculate(word)].push(dict);
                    }
                }
            }
        });
    }
}

function addIndexPasuk(index) {
    const some = index % 10;
    const tens = index % 100 - some;
    const hundreds = index - tens - some;
    return ' ' + VAL_OBVERSE[hundreds] + VAL_OBVERSE[tens] + VAL_OBVERSE[some].replace('טז', 'יו').replace('טו', 'יה');
    
}

function calculate(value) {
    return ('$$' + value).split('').map(c => VAL[c] || 0).reduce((a, b) => a + b);
}

function rejects(word) {
    // console.log('word-1:', word, typeof word == typeof "");
    if (typeof word == typeof "") {
        return word.split('').map(c => c.match(/[א-ת]/) ? c.match(/[א-ת]/)[0] : '').join('');
    }
    // word.match(/[^t]/);//    .replace('/^[a-z]/','1');
}

function clean(word) {
    if (typeof word == typeof "") {

        return word.replace(/[a-z]|[0-9]|<|>|-|"|=|/g, "").replace("{ס}", "").replace("{פ}", "").replace("/", "").replace("|", "");
    }
}

function switchObject(result) {
    for (let i = 1; i < 2000; i = i + 100) {
        if (result < i) {
           return arrayOfObjects[i]; 
        }
        
    }
}



