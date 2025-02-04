function loadView(){
    let html = '';

    formats.forEach(format => {
        html += /*HTML*/ `
        <div class="input-wrapper">
            <h3>${format.name}:</h3>
            <textarea oninput="inputValidation(this); updateInputs(this.id, value)" id="${format.subDictionary}" placeholder="Skriv her" value=""></textarea>
        </div>
        `;
    })
    document.getElementById('app').innerHTML = /*HTML*/ `
    <div class="header-container">
            <h1>Skriv inn i feltet</h1>
            <h1>du vil oversette fra</h1>
        </div>
        <div class="input-container">
            ${html}
        </div>
    `;
    }
