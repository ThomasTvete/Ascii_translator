function loadNav() {
    let liHtml = "";

    pages.forEach((page) => {
        let name = page.name;
        let id = page.id;
        liHtml += /*HTML*/ `
        <li class="navMenuLink"><a onclick="updateView(id)" id="${id}" href="#${name}">${name}</a></li>
        `;
    });

    document.getElementById("navbar").innerHTML = /*HTML*/ `
    <nav class="nav">
        <div class="navLogo">Ascii-verktøy</div>
        <a href="#" class="navHamburger">
            <span class="navHamLine"></span>
            <span class="navHamLine"></span>
            <span class="navHamLine"></span>
        </a>
        <div class="navMenu">
            <ul>
                ${liHtml}
            </ul>
        </div>
    </nav>
    `;

    const hamburger = document.querySelector(".navHamburger");
    const linksContainer = document.querySelector(".navMenu");
    const links = document.querySelectorAll(".navMenuLink");
    console.log(hamburger);
    hamburger.addEventListener("click", () => {
        linksContainer.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(max-width: 550px)").matches) {
            closeMenu();
        }
    });

    if (window.matchMedia("(max-width: 550px)").matches) {
        closeMenu();
    }

    function closeMenu() {
        links.forEach((link) => {
            link.addEventListener("click", () => {
                linksContainer.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }
}

function loadMain() {
    let html = "";

    formats.forEach((format) => {
        html += /*HTML*/ `
        <div class="input-wrapper">
            <h3>${format.name}:</h3>
            <textarea oninput="inputValidation(this); updateInputs(this.id, value)" id="${format.subDictionary}" placeholder="Skriv her" value=""></textarea>
        </div>
        `;
    });
    document.getElementById("app").innerHTML = /*HTML*/ `
    <div class="header-container">
        <h1>Skriv inn i feltet</h1>
        <h1>du vil oversette fra</h1>
    </div>
    <div class="input-container">
        ${html}
    </div>
    `;
}

function loadDemo() {
    let demoHtml = /*HTML*/ `
        <div class="input-wrapper">
            <h3>Desimaltallet</h3>
            <div id="decDemo"></div>
        </div>
    `;

    formats.forEach((format) => {
        if(format.system){
            demoHtml += /*HTML*/ `
            <div class="input-wrapper">
                <h3>${format.name}</h3>
                <div id="${format.key}Demo">Her kommer utregning i ${format.system}system</div>
            </div>
        `;}
    });    
    document.getElementById("app").innerHTML = /*HTML*/ `
    <div class="header-container">
        <h1>Hvert tegn har en tilsvarende desimalverdi mellom 0 og 255,</h1>
        <h1>tegnets binære og heksadesimale verdi regnes ut fra dette desimaltallet</h1>
    </div>
    <div class="input-container">
        <div class="input-wrapper">
            <h3>Skriv inn et tegn for å se demonstrasjon av utregning</h3>
            <input id="demoInput" oninput="showDemo(value)" type=text placeholder="Skriv her" maxlength="1" value="">
        </div>
        ${demoHtml}
    </div>
    `;
}

function loadDecoder() {
    document.getElementById("app").innerHTML = /*HTML*/ `
    <div class="header-container">
    </div>
    `;
}

function loadView() {
    loadMain();
    loadNav();
}

function updateView(view) {
    switch (view) {
        case "translator":
            loadMain();
            break;
        case "demo":
            loadDemo();
            break;
        case "decoder":
            loadDecoder();
            break;
        default:
            loadMain();
    }
}

function demoCalc(toFormat, decimal){
    let system = {};
    let newNr = [];
    let dec = decimal;
    let extraHtml = ''
    console.log('halla')
    if(toFormat == 'bin'){
        system = { name: "Binær", divisor: 2, single: 'B' };
    }
    else if(toFormat == 'hex'){
        system = { name: "Heksadesimal", divisor: 16, single: 'H' };
        extraHtml = `<p>Siden heksadesimal er et sekstentallssystem og trenger 16 siffer,
                        </br>representeres "sifrene" 10-15 med bokstavene a-f.</p>`
    }


    let html = `<p>${system.name}tall regnes ut ved å dele tallet på ${system.divisor},</br>
                og for resultat så setter man resten (R) som et siffer</br>
                til ${system.name.toLowerCase()}tallet (${system.single}), og så deler man kvotienten på ${system.divisor}</br>
                til man har en kvotient på null.</p>
                ${extraHtml}`

    while(dec > 0) {
        let remainder = dec % system.divisor
        let trueRemainder = remainder
        if(toFormat == 'hex' && remainder > 9){
            console.log(0 + remainder)
            trueRemainder = singleValueConvert('ascii_dec_dic', ("0" + `${remainder}`), 'hex').replace(/^0+/, '');
            remainder = `${remainder} -> ${trueRemainder}`
        }
        newNr.unshift(trueRemainder);
        newDec = Math.floor(dec/system.divisor);
        html += `${dec}/${system.divisor} = ${newDec} -> R = ${remainder} -> ${system.single} => ${newNr.join('')}</br>`;
        dec = newDec;
    }

    if(toFormat == 'bin'){
        while(newNr.length < 8){
            newNr.unshift(0)
        }
        html += `</br>For at hvert tegn skal være en byte, eller 8 bit, så fylles
                </br> det binære tallet med 0 foran, til det når 8 siffer.`
    }

    html += `</br> Det endelige ascii-kompatible ${system.name.toLowerCase()}e tallet er da 
            </br><strong class="boldL">${newNr.join('')}</strong>`
    
    return html;
}

// function demoCalc(char, toFormat){
//     let binary = [];
//     let dec = singleValueConvert('ascii_char_dic', char, toFormat);

//     let html = `<p>Binærtall regnes ut ved å dele tallet i to,</br>
//                 og for resultat så setter man resten som ett siffer</br>
//                 til binærtallet, og så deler man kvotienten i to>/br>
//                 til man har en kvotient på null</p>`
    
//     while(dec > 0) {
//         let remainder = dec % 2
//         binary.unshift(remainder);
//         newDec = Math.floor(dec/2);
//         html += `${dec}/2 er lik ${newDec} med en rest og nytt siffer på ${remainder}, og et binært tall på ${binary.join('')}</br>`;
//         dec = newDec;
//     }

//     while(binary.length < 8){
//         binary.unshift(0)
//     }
//     html += `For at hvert tegn skal være en byte, eller 8 bit, så fylles
//             </br> det binære tallet med 0 foran, til det når 8 siffer.
//             </br> Det endelige ascii-kompatible binære tallet er da ${binary.join('')}`
// }
