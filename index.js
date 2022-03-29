let gemOfTorah = {};

CHUMASHIM.forEach(chumash => {
    const CHUMASH = Object.keys(chumash)[0];
    const range = chumash[CHUMASH]
    for (let i = 0; i <= range; i++) {
        getTora(BASE_URL + CHUMASH + i + PARAMS).then(data => {
            data.json().then(perek => {
                setListOfNumbersInTora(gemOfTorah, perek);
            })
        });
    }
})


function setGematrya(value) {
    let history = [];
    const sum = calculate(value);
    document.getElementById('sum').innerText = sum;
    localStorage.getItem('history') ? history = localStorage.getItem('history').split('%%') : [];
    history = history.filter((v, i) => history.indexOf(v) === i).sort();
    document.getElementById('history').innerText = history.filter(e => calculate(e) == sum && e != value);
    let cleanValue = clean(value);
    if (sum > 0 && value.length > 1) history.push(cleanValue);
    // console.log('history:', history);
    localStorage.setItem('history', history.join('%%'));

    addToTheTable(sum);


}

function setListOfNumbersInTora(gemOfTorah, perek) {
    if (perek.he) {
        perek.he.forEach(e => {
            wordsOfPasuk = e.split(' ');
            for (let i = 0; i < wordsOfPasuk.length; i++) {
                for (let j = i + 1; j <= wordsOfPasuk.length; j++) {
                    let words = wordsOfPasuk.slice(i, j);
                    if (words.length) {
                        let word = words.join(' ');
                        word = clean(word);
                        let dict = {};
                        dict[word] = perek.heRef;
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

function addToTheTable(sum) {
    torahValues = gemOfTorah[sum];
    let tableRef = document.getElementById("table");
    while (tableRef.rows.length > 1) {
        tableRef.deleteRow(1);
    }
    if (torahValues && torahValues.length) {
        torahValues.forEach((dict) => {
            const word = Object.keys(dict)[0];
            const value = dict[word];

            let newRow = tableRef.insertRow(-1);

            let sourceCell = newRow.insertCell(0);
            let wordCell = newRow.insertCell(1);


            let sourceText = document.createTextNode(value);
            let wordText = document.createTextNode(word);

            sourceCell.appendChild(sourceText);
            wordCell.appendChild(wordText);

        });
    }

}

function calculate(value) {
    const val = { 'א': 1, 'ת': 400, 'ש': 300, 'ר': 200, 'ק': 100, 'ץ': 90, 'צ': 90, 'ף': 80, 'פ': 80, 'ע': 70, 'ס': 60, 'ן': 50, 'נ': 50, 'ם': 40, 'מ': 40, 'ל': 30, 'ך': 20, 'כ': 20, 'י': 10, 'ט': 9, 'ח': 8, 'ז': 7, 'ו': 6, 'ה': 5, 'ד': 4, 'ג': 3, 'ב': 2, }
    return ('$$' + value).split('').map(c => val[c] || 0).reduce((a, b) => a + b);
}

async function getTora(url) {
    const response = await fetch(url);
    return response;

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