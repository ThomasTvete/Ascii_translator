function singleValueConvert(fromFormat, value, toFormat) {
    //overflødig if-sjekk når ascii listen er komplett, men bedre føre var
    if(asciiDic[fromFormat] && asciiDic[fromFormat][value] && asciiDic[fromFormat][value][toFormat]){
        return asciiDic[fromFormat][value][toFormat]}
    return null
}

function convertFriendly(string){
    // nødvendig slik at sliceValues og singleValueConvert skal funke
    return newStr = string.toLowerCase().replace(/\s+/g, '');
}

function stringConvert(fromFormat, string, toFormat){
    let singleValues = []; // hvor jeg stapper inn alle enkelt-symboler/verdier

    switch (fromFormat){
        case 'ascii_char_dic':
            let charSlices = sliceValues(string, 1)
            for (let char of charSlices){
                singleValues.push(singleValueConvert(fromFormat, char, toFormat));
            }
            break;
        case 'ascii_bin_dic':
            string = convertFriendly(string);
            console.log(string)
            let binSlices = sliceValues(string, 8);
            for(let slice of binSlices){
                singleValues.push(singleValueConvert(fromFormat, slice, toFormat))
            }
            break;
        case 'ascii_hex_dic':
            string = convertFriendly(string);
            console.log(string)
            let hexSlices = sliceValues(string, 2);
            for(let slice of hexSlices){
                singleValues.push(singleValueConvert(fromFormat, slice, toFormat))
            }
            break;
        case 'ascii_dec_dic':
            let decSlices = sliceValues(string, 3);
            for(let slice of decSlices){
                singleValues.push(singleValueConvert(fromFormat, slice, toFormat))
            }
            break;
        default:
            console.error('Nå har du tullet det til');
            return null;
    }
    
    if(toFormat == 'char') return singleValues.join('');
    else return singleValues.join(' ');
}

// function sliceValues(string, size){
//     const slices = [];

//     for (let i = 0; i < string.length; i += size) {
//         slices.push(string.slice(i, i + size)); }
//     return slices;
// }

// copilot kom med det elegante forslaget å heller bruke Array.from:

function sliceValues(string, size){
    // første argument tar egentlig i mot en eksisterende liste-aktig variabel (slik at du looper over hver value i den), 
    // uten det må jeg presisere en lengde på det nye arrayet i stedet, som lett gjøres dynamisk avhengig av argumentene
    // NB!!!! callbacken som looper over stringen og populater den nye arrayen MÅ ha en value argument som første parameter,
    // SELV OM DEN ALDRI BRUKES
    return Array.from({length: Math.ceil(string.length / size )}, (ignoreThis, i) => 
                        string.slice(i * size, i * size + size));
}

function inputValidation(input){
    switch (input.id){
        case 'ascii_bin_dic':
            input.value = input.value.replace(/[^01\s]/g, '');
            break;
        case 'ascii_hex_dic':
            input.value = input.value.replace(/[^0-9a-fA-F\s]/g, '');
            break;
        default:
            // brukes ikke egentlig lenger
            input.value = input.value.replace(/[|]/g, '');
            break;
    }
    
}

function updateInputs(fromFormat, string){


    formats.forEach(format => {
        let id = format.subDictionary;
        let key = format.key;
        if(id !== fromFormat){
            document.getElementById(id).value = stringConvert(fromFormat, string, key);
        }
    })
}

function showDemo(input) {
    console.log('yoo??')
    if(input == ''){
        console.log('inbutt')
        loadDemo();
        document.getElementById('demoInput').focus();
        return;
    }
    let dec = parseInt(singleValueConvert('ascii_char_dic', input, 'dec').replace(/^0+/, ''));
    formats.forEach(format => {
        if(format.system){
            id = `${format.key}Demo`;
            console.log(`${format.key}Demo`)
            console.log('balla')
            document.getElementById(id).innerHTML = demoCalc(format.key, dec, input)
        }
    })
    document.getElementById('decDemo').innerHTML =`<h3>${dec}</h3>`
    }

function encodeText(text, seed){
    // finnes noe ala random.seed i javascript??
    // let seed = 'yoo'
    let rng = new Math.seedrandom(seed); // yep okay kanskje dette funker
    let encodedText = [];
    // let shiftInfo = []; unødvendig med markør
    let shiftMarker = randomMarker(rng)
    console.log('kryptering')
    console.log('marker ' + shiftMarker);
    console.log('markerChar ' + decConvert(shiftMarker))
    console.log('seed ' + seed)
    console.log('tekst ' + text)

    for (const char of text){ // det er for-OF ikke for-IN for arrays din idiot
        let mask = randomAscii(rng); 
        console.log('mask ' + mask)
        console.log('char ' + char)
        let charDec = parseInt(singleValueConvert('ascii_char_dic', char, 'dec'));
        console.log('charDec ' + charDec)
        let codeCharVal = charDec ^ mask; // ^ er innebygd bitmasking??

        // flytter krypterte tegn over til en ikke-kontroll-kode ascii-verdi
        // etter å ha lagret posisjonen i stringen og hvor mye den flyttes med
        if(nonValidAscii(codeCharVal) || (codeCharVal === shiftMarker)){
            let shift = randomShiftAscii(rng);
            // shiftInfo.push(i); unødvendig med markør
            // legg til markør før den skiftede verdien
            encodedText.push(decConvert(shiftMarker));
            console.log('SKIFT ' + shift)
            codeCharVal += shift; 
        }
        console.log('masket ' + codeCharVal)
        // ascii-disctionary json-fila har alle tall som strings,
        // og paddes med 0 til de har en gitt antall siffer,
        // viktig å huske ved conversions
        encodedText.push(decConvert(codeCharVal));
    }


    // slår de sammen til en string output, må starte med masken og shiftInfo slik at
    // ||| funker som avgrenser selv om encodedText tilfeldigvis også har tre | på rad
    // let encodedOutput = mask + '|' + shiftInfoString + '|' + encodedText.join('');

    let encodedOutput = encodedText.join('');
    console.log(encodedOutput)

    return encodedOutput;
}

function nonValidAscii(dec){
    console.log('sjekk tall ' + dec)
    return (dec < 32) || (dec >= 127 && dec <= 159) || (dec >= 256)
}

function randomMarker(rng){
    // marker kan ikke være over 126,
    // i tilfelle et maskert tegn overlapper
    // med en marker på 200+ så vil randomShift
    // fucke opp alt
    let marker;
    do{
        marker = randomAscii(rng)
    } while((marker < 32) || (marker > 126))
    return marker;
}

function decConvert(dec){
    return singleValueConvert('ascii_dec_dic', dec.toString().padStart(3, '0'), 'char')
}

function decodeText(encodedText, seed){
    // leter etter de to første instansene av |||
    // let [shiftInfoStr, encodedText] = text.split('|');
    console.log('dekryptering')
    let rng = new Math.seedrandom(seed);
    let shiftMarker = randomMarker(rng)
    console.log('marker ' + shiftMarker)
    console.log('markerChar ' + decConvert(shiftMarker))
    console.log('seed ' + seed)
    console.log('tekst ' + encodedText)

    // let shiftInfo = shiftInfoStr.split(',').map(i => parseInt(i))
    let shiftNext = false;

    let decodedText = [];

    for (const char of encodedText){

        // HUSK parseInt pga typeequality-tull
        let codeCharVal = parseInt(singleValueConvert('ascii_char_dic', char, 'dec'));

        if(codeCharVal === shiftMarker){
            shiftNext = true;
            continue;
        }
        // mask MÅ genereres ETTER shiftMarker-sjekk,
        // for å opprettholde seed
        let mask = randomAscii(rng);
        console.log('mask ' + mask)
        console.log('char ' + char)
        console.log('charDec ' + codeCharVal)
        if(shiftNext) {
            let shiftValue = randomShiftAscii(rng);
            codeCharVal = (codeCharVal - shiftValue);
            shiftNext = false;
        }
        console.log('skiftet ' + codeCharVal)
        // revers bitmask returnerer original verdi (håper jeg)
        let charDec = codeCharVal ^ mask; 
        console.log('umasket ' + charDec)
        let convert = decConvert(charDec);
        console.log('konvert ' + convert)
        decodedText.push(convert)
    }
    console.log(decodedText)
    let finishedText = decodedText.join('')
    console.log(finishedText)
    return finishedText;

}

function randomAscii(rng){
    return Math.floor(rng() * (256 - 1)) + 1;
}
function randomShiftAscii(rng){
    return Math.floor(rng() * (96 - 32)) + 32;
}

function processCryptForm(code){
    const key = $(`${code}Key`).value;
    const text = $(`${code}Input`).value;
    const output = window[`${code}Text`](text, key);

    $(`${code}Output`).value = output;
}

function keyGeneration(){
    let keyLength = Math.floor(Math.random() * (17 - 8)) + 8;
    let key = [];

    while(key.length < keyLength){
        let ranDec = 0;
        do{
            ranDec = randomAscii(Math.random);
        }while(nonValidAscii(ranDec));
        key.push(singleValueConvert('ascii_dec_dic', ranDec.toString().padStart(3, '0'), 'char'))
    }
    $('encodeKey').value = key.join('');
}

// function updateEncoder(id, string){
//     console.log(id)
//     switch(id){
//         case 'encodeInput':
//             $('decodeInput').value = encodeText(string);
//             break;
//         case 'decodeInput':
//             console.log('halla')
//             $('encodeInput').value = decodeText(string);
//             break;
//     }
// }

