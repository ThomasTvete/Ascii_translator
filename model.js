const asciiDic = {};

fetch('ascii_dic.json')
    .then(response => response.json())
    .then(data => {
        Object.assign(asciiDic, data); 
    })
    .catch(error => console.error('Klarte ikke finne ASCII dictionary', error));

const formats = [{subDictionary: 'ascii_char_dic', key: 'char', name: 'Tekst'}, 
                {subDictionary: 'ascii_bin_dic', key: 'bin', name: 'Binært'},
                {subDictionary: 'ascii_hex_dic', key: 'hex', name: 'Heksadesimalt'}];