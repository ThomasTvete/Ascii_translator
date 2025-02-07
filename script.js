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

