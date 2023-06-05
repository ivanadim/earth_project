let countries = []

function Country(flag, altOfFlag, name, capitalCity, continet, population, languages, currency, map, streetMaps) {
    this.flag = flag,
        this.altOfFlag = altOfFlag,
        this.name = name,
        this.capitalCity = capitalCity,
        this.continet = continet,
        this.population = population,
        this.languages = languages,
        this.currency = currency,
        this.map = map,
        this.streetMaps = streetMaps,
        this.time = ""
}

//go zima saatot od api
async function getTime(place) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const url = `https://timezone.abstractapi.com/v1/current_time/?api_key=5595d10a6b974d0a96972ad58234f64b&location=${place}`;

    const response = await fetch(url);
    const result = await response.json();
    // return result.datetime
    const timeInfo = result.datetime.split(" ");

    const date = new Date(timeInfo[0]).getDay();
    const time = timeInfo[1];

    const day = weekday[date]

    return `${day}  ${time}`
}




let pathElements = document.getElementsByTagName("path");
//ja dobiavme datata za country
async function getData(place) {
    const url = `https://restcountries.com/v3.1/name/${place}`;

    //proveravme dali e sekoj county od country nizata e validen
    const areCountriesValid = countries.every((country) => Object.keys(country).length > 0)
    // izlezi od funkcija dokolku dvete drzhavi imaat vrednosti
    if (countries.length === 2 && areCountriesValid) {
        return
    }
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            // console.log(result)
            let { flag, altOfFlag, name, capitalCity, continet, population,
                languages, currency, maps, mapsStreet } = mapCountryProps(result);
            const country = new Country(flag, altOfFlag, name,
                capitalCity, continet, population, languages, currency, maps, mapsStreet);
            // i dali vtoriot element nema vrednosti
            if (countries.length > 1 && Object.values(countries[1]).length === 0) {
                countries[1] = country
                printCountries(countries);
                return;
            }
            //ako e prazna ili samo eden element sa dodava na 0index
            else if (countries.length === 0 || countries.length === 1) {
                countries[0] = country;
                printCountries(countries);
            }
        })
}



//set a function to languages  to return a string into new line
const languagesToString = (listOfLanguages) => {
    let element = "<span>"
    listOfLanguages.forEach((language, index) => {
        if (index !== 0 && index % 2 === 1) {
            element += ` ${language} <br />`
        } else {
            element += ` ${language}`
        }
    })
    element += "</span>"
    return element
}

// reset comparing
const resetComparing = () => {
    countries[1] = {}
    printCountries(countries)
};
//remove comparing
const removeComparing = () => {
    countries = [];
    document.getElementById("results").innerHTML = ""
}

//zemajne na podatocite od api za zemjata
function mapCountryProps(result) {
    let name = result[0].name.common;
    let capitalCity = result[0].capital;
    let flag = result[0].flags.png;
    let altOfFlag = result[0].flags.alt;
    let population = result[0].population;
    let continet = result[0].continents;
    let currencies = Object.values(result[0].currencies);
    let currency = currencies[0].name;
    let rawLanguages = result[0].languages;
    let languages = Object.values(rawLanguages);
    let maps = result[0].maps.googleMaps;
    let mapsStreet = result[0].maps.openStreetMaps;

    return { flag, altOfFlag, name, capitalCity, continet, population, languages, currency, maps, mapsStreet };
}


//print na zemjite iterire niz nizata i gi printime 
function printCountries(countries) {
    document.getElementById("results").innerHTML = ""

    countries.forEach((country, index) => {
        printCountry(country, index);

    });
}


function printCountry(country, index) {
    // priverka dali objektot ima keys
    const isCountryEmpty = Object.keys(country).length === 0; // dali objectot e prazen

    const countryWindow = countryCardContent(isCountryEmpty, index, country)


    document.getElementById("results").innerHTML += ` ${countryWindow} `;
}

//print na prva karticka
function countryCardContent(isCountryEmpty, index, country) {
    console.log(country);
    console.log(index)
    if (isCountryEmpty) {
        return generateEmptyCard();
    }

    return `
    ${index === 0 ? `
        <div id="buttons-icons" style="order: 2">
            <div class="btn-compare">
            <img id="compare_btn" title="Compare" src="image/share-files-white.png" alt="compare" />
            </div>
            <button class="reset-btn">
                <img id="reset_compare" title="Replay" src="image/replay-arrow.png" alt="replay" />
            </button>
            <div class="btn-compare">
                <img id="remove_cards" title="Remove" src="image/cancel-button.png" alt="remove" />
            </div>
        </div> `
            : ''}
        <div class="countryWindow" style="order: ${index === 1 ? `unset` : `3`}">
        <div id="header">
            <div class="clock-btn">
                <p id="clockResult-${country.name}">${country.time}</p>
                <img class="clock" title="Local Time" id="${country.name}" src="image/clock.png" alt="time" data-index=${index} />            
            </div>
            <div class="image-country">
                <img src="${country.flag}" alt="${country.altOfFlag}">
            </div>
            <div class="name-city-mob">
                <div class="coun-name">
                <h2>${country.name}</h2>
                </div>

                <div class="city">
                    <h3>Capital City:</h3> <span>${country.capitalCity}</span>
                </div>
            </div>
        </div>
        <div id="content">
            <div class="information">
                <div class="info-dec">
                    <h4 class="txt-decoration">Continent <span>${country.continet}</span></h4>
                    <h4 class="txt-decoration">Population <span>${country.population}</span></h4>
                    
                </div>
                <div class="info-dec-lang">               
                    <h4 class="txt-decoration">Languages <span>${languagesToString(country.languages)}</span></h4>
                    <h4 class="txt-decoration">Currencies <span>${country.currency}</span></h4>
                </div>
            </div>
            <div class="infoMaps">
                <h1>See the country on</h1> 
                <div class="icons-maps-google">
                    <a href="${country.map}" target="_blank">
                        <img id="google-map" title="Google Maps" src="image/google-maps.png" alt="google-map" />
                        <p>Google Maps</p>
                    </a> 
                    <p>or</p>
                    <a href="${country.streetMaps}" target="_blank">
                        <img id="google-map" title="Open Street" src="image/openstreetmap_icon.png" alt="google-map"/>
                        <p>Open Street</p> 
                    </a>
                </div> 
            </div>
        </div>  
        </div>`;

}

//vtora zemja prazno za da se vnese
function generateEmptyCard() {
    return `
            
        <div class="countryWindow">
            <div class="selectCountry">
                <p>Please select a country to compare</p>
            </div>
        </div>
        
    `;
}

//event listener for compare/remove/clock
document.addEventListener("click", async (e) => {
    if (e.target.id === "compare_btn") {
        if (countries.length > 1) {
            return;
        }
        countries[1] = {} //za da se ispolni if uslovot vo samiot fetch ako imame poveke od 1
        document.getElementById("results").innerHTML += generateEmptyCard()
    }
    if (e.target.id === "reset_compare") {
        resetComparing()
    }
    if (e.target.id === "remove_cards") {
        removeComparing()
    }
    if (e.target.classList.contains("clock")) {
        const country = e.target.id
        const datetime = await getTime(country);
        const clockResultElement = document.getElementById(`clockResult-${country}`)
        const index = parseInt(e.target.getAttribute('data-index'));
        console.log(datetime)


        //na elementot od nizata na samiot index mu dodeluvame datetime vrednost ako time e prazen string
        if (countries[index].time === "") {
            countries[index].time = datetime
            clockResultElement.innerHTML = datetime
        } else {
            countries[index].time = ""
            clockResultElement.innerHTML = ""
        }
    }
});

//mouse hover show name click show results
[...pathElements].forEach(e => {
    e.addEventListener("mouseover", function () {
        window.onmousemove = function (j) {
            let left = j.offsetX;
            let top = j.offsetY;
            const nameElement = document.getElementById("name");
            nameElement.style.left = left + 15 + "px";
            nameElement.style.top = top + 10 + "px"
        }

        e.style.fill = "#3e8c5d"

        document.getElementById("name").style.opacity = 1

        const countryValue = e.id || e.classList.value
        document.getElementById("namep").innerText = countryValue;
    })
    e.addEventListener("mouseleave", function () {
        e.style.fill = "#ececec"
        document.getElementById("name").style.opacity = 0
    })
    e.addEventListener("click", function () {
        const nameOfElement = this.getAttribute('name')
        const classOfElement = this.getAttribute('class')
        const place = classOfElement || nameOfElement
        getData(place)
    })
})



// zoom
let scale = 1,
    zooming = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.getElementById("zoom");



function setTransform() {

    zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}
zoom.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    zooming = true;
}
zoom.onmouseup = function (e) {
    zooming = false;
};

zoom.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!zooming) {
        return;
    }
    pointX = (e.touches[0].clientX - start.x);
    pointY = (e.touches[0].clientY - start.y);
    setTransform();
});

zoom.addEventListener("mousemove", (e) => {
    e.preventDefault();
    if (!zooming) {
        return;
    }
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
})
zoom.addEventListener("pointerdown", (e) => {

    if (window.innerWidth <= 800) {
        // console.log("tuka sum")
        e.preventDefault();
        console.log(e.innerWidth)
        console.log()
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        zooming = true;

    }
})
zoom.onwheel = function (e) {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
    setTransform();
}



// counting procent 
const loadText = document.querySelector('.loading-text')
const bg = document.querySelector('#zoom')
let int = setInterval(blurring, 30)
let load = 0
function blurring() {
    load++

    if (load >= 100) {
        clearInterval(int)
    }

    loadText.innerText = `${load}%`
    loadText.style.opacity = scele(load, 0, 100, 1, 0)
    bg.style.filter = `blur(${scele(load, 0, 100, 40, 0)}px)`

}

const scele = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
// map a range of num to another range of num from stackoverflow


