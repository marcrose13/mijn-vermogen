

/*
 * ==========================================
 * DATA
 * ==========================================
 */

let rekeningen = JSON.parse(
    localStorage.getItem("mijnVermogenRekeningen")
) || [];

let historie = JSON.parse(
    localStorage.getItem("mijnVermogenHistorie")
) || [];

let huidigePeriode = "alles";

let vermogensDoel =
    Number(
        localStorage.getItem(
            "mijnVermogenDoel"
        )
    ) || 0;


/*
 * Punten van de huidige grafiek.
 * Deze worden gebruikt voor hover en tik.
 */

let grafiekPunten = [];


/*
 * ==========================================
 * ACHTERGRONDKLEUR
 * ==========================================
 */

const standaardAchtergrond =
    "#C5DEDE";


let opgeslagenAchtergrond =
    localStorage.getItem(
        "mijnVermogenAchtergrond"
    ) || standaardAchtergrond;


function achtergrondInstellen(kleur) {

    document.documentElement.style
        .setProperty(
            "--app-background",
            kleur
        );

}


achtergrondInstellen(
    opgeslagenAchtergrond
);


/*
 * ==========================================
 * INSTELLINGEN OPENEN
 * ==========================================
 */

function instellingenOpenen() {

    const overlay =
        document.createElement("div");

    overlay.className =
        "instellingen-popup-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "instellingen-popup";


    const titel =
        document.createElement("div");

    titel.className =
        "instellingen-titel";

    titel.textContent =
        "Instellingen";


    const subtitel =
        document.createElement("div");

    subtitel.className =
        "instellingen-subtitel";

    subtitel.textContent =
        "Geef Mijn Vermogen jouw eigen uitstraling.";


    const label =
        document.createElement("div");

    label.className =
        "instellingen-label";

    label.textContent =
        "Achtergrondkleur";


    const kleurOpties =
        document.createElement("div");

    kleurOpties.className =
        "kleur-opties";


    const kleuren = [

        {
            naam: "Mint",
            kleur: "#C5DEDE"
        },

        {
            naam: "Blauw",
            kleur: "#C7D8E8"
        },

        {
            naam: "Lavendel",
            kleur: "#D8D0E8"
        }

    ];


    kleuren.forEach(
        function(item) {

            const optie =
                document.createElement("button");

            optie.className =
                "kleur-optie";

            optie.type =
                "button";


            if (
                item.kleur ===
                opgeslagenAchtergrond
            ) {

                optie.classList.add(
                    "active"
                );

            }


            const preview =
                document.createElement("div");

            preview.className =
                "kleur-preview";

            preview.style.background =
                item.kleur;


            const naam =
                document.createElement("div");

            naam.className =
                "kleur-naam";

            naam.textContent =
                item.naam;


            optie.appendChild(
                preview
            );

            optie.appendChild(
                naam
            );


            optie.onclick =
                function() {

                    opgeslagenAchtergrond =
                        item.kleur;


                    localStorage.setItem(
                        "mijnVermogenAchtergrond",
                        item.kleur
                    );


                    achtergrondInstellen(
                        item.kleur
                    );


                    document
                        .querySelectorAll(
                            ".kleur-optie"
                        )
                        .forEach(
                            function(knop) {

                                knop.classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                    optie.classList.add(
                        "active"
                    );

                };


            kleurOpties.appendChild(
                optie
            );

        }
    );


    const sluitenButton =
        document.createElement("button");

    sluitenButton.className =
        "primary-button";

    sluitenButton.type =
        "button";

    sluitenButton.textContent =
        "Gereed";


    sluitenButton.onclick =
        function() {

            overlay.remove();

        };


    popup.appendChild(titel);

    popup.appendChild(subtitel);

    popup.appendChild(label);

popup.appendChild(kleurOpties);


/*
 * ==========================================
 * VERMOGENSDOEL
 * ==========================================
 */

const doelLabel =
    document.createElement("div");

doelLabel.className =
    "instellingen-label";

doelLabel.textContent =
    "Vermogensdoel";


const doelInput =
    document.createElement("input");

doelInput.type =
    "number";

doelInput.inputMode =
    "decimal";

doelInput.className =
    "formulier-input";

doelInput.placeholder =
    "Bijvoorbeeld 100000";

doelInput.style.marginBottom =
    "18px";

doelInput.value =
    vermogensDoel > 0
        ? vermogensDoel
        : "";


doelInput.addEventListener(
    "input",
    function() {

        vermogensDoel =
            Number(
                doelInput.value
            ) || 0;

        localStorage.setItem(
            "mijnVermogenDoel",
            vermogensDoel
        );

        berekenTotaal();

    }
);


popup.appendChild(
    doelLabel
);

popup.appendChild(
    doelInput
);


popup.appendChild(
    sluitenButton
);


    overlay.appendChild(
        popup
    );


    document.body.appendChild(
        overlay
    );


    overlay.onclick =
        function(event) {

            if (
                event.target === overlay
            ) {

                overlay.remove();

            }

        };

}


/*
 * ==========================================
 * OPSLAAN
 * ==========================================
 */

function slaRekeningenOp() {

    localStorage.setItem(
        "mijnVermogenRekeningen",
        JSON.stringify(rekeningen)
    );

}


function slaHistorieOp() {

    localStorage.setItem(
        "mijnVermogenHistorie",
        JSON.stringify(historie)
    );

}


/*
 * ==========================================
 * BEDRAG OPMAKEN
 * ==========================================
 */

function formatteerBedrag(bedrag) {

    return new Intl.NumberFormat(
        "nl-NL",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(bedrag);

}


/*
 * ==========================================
 * DATUM OPMAKEN
 * ==========================================
 */

function formatteerDatum(datum) {

    return new Date(datum).toLocaleDateString(
        "nl-NL",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/*
 * ==========================================
 * TOTAAL BEREKENEN
 * ==========================================
 */
function berekenTotaal() {

    let totaal = 0;

    rekeningen.forEach(function(rekening) {

        totaal += Number(rekening.bedrag) || 0;

    });


    document.getElementById(
        "total-vermogen"
    ).textContent = formatteerBedrag(totaal);


    /*
     * ==========================================
     * DOELBALK BIJWERKEN
     * ==========================================
     */

    const doelContainer =
        document.getElementById(
            "doel-container"
        );

    const doelPercentage =
        document.getElementById(
            "doel-percentage"
        );

    const doelBalkVulling =
        document.getElementById(
            "doel-balk-vulling"
        );

    const doelTekst =
        document.getElementById(
            "doel-tekst"
        );


    if (
        vermogensDoel <= 0
    ) {

        doelContainer.style.display =
            "none";

        return;

    }


    doelContainer.style.display =
        "block";


    let percentage =
        (totaal / vermogensDoel) * 100;


    let weergegevenPercentage =
        Math.min(
            Math.round(percentage),
            100
        );


    doelPercentage.textContent =
        weergegevenPercentage + "%";


    doelBalkVulling.style.width =
        weergegevenPercentage + "%";


    doelTekst.textContent =
        formatteerBedrag(totaal)
        + " van "
        + formatteerBedrag(vermogensDoel);

}

/*
 * ==========================================
 * REKENINGEN TONEN
 * ==========================================
 */

function toonRekeningen() {

    const container =
        document.getElementById("rekeningen");

    container.innerHTML = "";


    if (rekeningen.length === 0) {

        container.innerHTML =
            '<div class="leeg">Nog geen rekeningen toegevoegd.</div>';

        return;

    }


    rekeningen.forEach(function(rekening) {

        const div =
            document.createElement("div");

        div.className = "rekening";


        div.innerHTML = `

            <div class="rekening-info">

                <div class="rekening-naam">
                    ${rekening.naam}
                </div>

                <div class="rekening-type">
                    ${rekening.type}
                </div>

            </div>


            <div class="rekening-bedrag">
                ${formatteerBedrag(rekening.bedrag)}
            </div>


            <div class="rekening-acties">

                <button
                    onclick="rekeningBewerken(${rekening.id})"
                >
                    ✏️
                </button>

                <button
                    onclick="rekeningVerwijderen(${rekening.id})"
                >
                    🗑️
                </button>

            </div>

        `;


        container.appendChild(div);

    });

}


/*
 * ==========================================
 * REKENING TOEVOEGEN
 * ==========================================
 */

function rekeningToevoegen() {

    const overlay =
        document.createElement("div");

    overlay.className =
        "rekening-popup-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "rekening-popup";


    const titel =
        document.createElement("div");

    titel.className =
        "rekening-popup-titel";

    titel.textContent =
        "Rekening toevoegen";


    const subtitel =
        document.createElement("div");

    subtitel.className =
        "rekening-popup-subtitel";

    subtitel.textContent =
        "Vul de gegevens van je rekening in.";


    const naamGroep =
        document.createElement("div");

    naamGroep.className =
        "formulier-groep";


    const naamLabel =
        document.createElement("label");

    naamLabel.className =
        "formulier-label";

    naamLabel.textContent =
        "Naam rekening";


    const naamInput =
        document.createElement("input");

    naamInput.className =
        "formulier-input";

    naamInput.type =
        "text";

    naamInput.placeholder =
        "Bijvoorbeeld ING Spaarrekening";

    naamInput.autocomplete =
        "off";


    naamGroep.appendChild(naamLabel);

    naamGroep.appendChild(naamInput);


    const typeGroep =
        document.createElement("div");

    typeGroep.className =
        "formulier-groep";


    const typeLabel =
        document.createElement("label");

    typeLabel.className =
        "formulier-label";

    typeLabel.textContent =
        "Type rekening";


    const typeSelect =
        document.createElement("select");

    typeSelect.className =
        "formulier-select";


    typeSelect.innerHTML = `

        <option value="">
            Kies een type
        </option>

        <option value="Sparen">
            🏦 Sparen
        </option>

        <option value="Beleggen">
            📈 Beleggen
        </option>

        <option value="Betaalrekening">
            💳 Betaalrekening
        </option>

        <option value="Overig">
            📦 Overig
        </option>

    `;


    typeGroep.appendChild(typeLabel);

    typeGroep.appendChild(typeSelect);


    const bedragGroep =
        document.createElement("div");

    bedragGroep.className =
        "formulier-groep";


    const bedragLabel =
        document.createElement("label");

    bedragLabel.className =
        "formulier-label";

    bedragLabel.textContent =
        "Huidig bedrag";


    const bedragInput =
        document.createElement("input");

    bedragInput.className =
        "formulier-input";

    bedragInput.type =
        "text";

    bedragInput.inputMode =
        "decimal";

    bedragInput.placeholder =
        "Bijvoorbeeld 12500,50";

    bedragInput.autocomplete =
        "off";


    bedragGroep.appendChild(bedragLabel);

    bedragGroep.appendChild(bedragInput);


    const knoppen =
        document.createElement("div");

    knoppen.className =
        "popup-knoppen";


    const annulerenButton =
        document.createElement("button");

    annulerenButton.className =
        "secondary-button";

    annulerenButton.type =
        "button";

    annulerenButton.textContent =
        "Annuleren";


    const opslaanButton =
        document.createElement("button");

    opslaanButton.className =
        "primary-button";

    opslaanButton.type =
        "button";

    opslaanButton.textContent =
        "Opslaan";


    knoppen.appendChild(
        annulerenButton
    );

    knoppen.appendChild(
        opslaanButton
    );


    popup.appendChild(titel);

    popup.appendChild(subtitel);

    popup.appendChild(naamGroep);

    popup.appendChild(typeGroep);

    popup.appendChild(bedragGroep);

    popup.appendChild(knoppen);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    setTimeout(function() {

        naamInput.focus();

    }, 100);


    annulerenButton.onclick = function() {

        overlay.remove();

    };


    opslaanButton.onclick = function() {

        const naam =
            naamInput.value.trim();

        const type =
            typeSelect.value;

        const bedragInputWaarde =
            bedragInput.value.trim();


        if (!naam) {

            alert(
                "Vul een naam voor de rekening in."
            );

            naamInput.focus();

            return;

        }


        if (!type) {

            alert(
                "Kies eerst een type rekening."
            );

            typeSelect.focus();

            return;

        }


        if (!bedragInputWaarde) {

            alert(
                "Vul een bedrag in."
            );

            bedragInput.focus();

            return;

        }


        const bedrag =
            parseFloat(
                bedragInputWaarde
                    .replace("€", "")
                    .replace(/\s/g, "")
                    .replace(/\./g, "")
                    .replace(",", ".")
            );


        if (isNaN(bedrag)) {

            alert(
                "Vul een geldig bedrag in."
            );

            bedragInput.focus();

            return;

        }


        rekeningen.push({

            id: Date.now(),

            naam: naam,

            type: type,

            bedrag: bedrag

        });


        slaRekeningenOp();

        toonRekeningen();

        berekenTotaal();

        overlay.remove();

        vraagVermogensMomentOpslaan();

    };


    bedragInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                opslaanButton.click();

            }

        }
    );

}


/*
 * ==========================================
 * REKENING BEWERKEN
 * ==========================================
 */

function rekeningBewerken(id) {

    const rekening =
        rekeningen.find(function(item) {

            return item.id === id;

        });


    if (!rekening) {
        return;
    }


    const oudBedrag =
        Number(rekening.bedrag);


    const overlay =
        document.createElement("div");

    overlay.className =
        "rekening-popup-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "rekening-popup";


    const titel =
        document.createElement("div");

    titel.className =
        "rekening-popup-titel";

    titel.textContent =
        "Rekening bewerken";


    const subtitel =
        document.createElement("div");

    subtitel.className =
        "rekening-popup-subtitel";

    subtitel.textContent =
        "Pas de gegevens van je rekening aan.";


    const naamGroep =
        document.createElement("div");

    naamGroep.className =
        "formulier-groep";


    const naamLabel =
        document.createElement("label");

    naamLabel.className =
        "formulier-label";

    naamLabel.textContent =
        "Naam rekening";


    const naamInput =
        document.createElement("input");

    naamInput.className =
        "formulier-input";

    naamInput.type =
        "text";

    naamInput.value =
        rekening.naam;

    naamInput.autocomplete =
        "off";


    naamGroep.appendChild(naamLabel);

    naamGroep.appendChild(naamInput);


    const typeGroep =
        document.createElement("div");

    typeGroep.className =
        "formulier-groep";


    const typeLabel =
        document.createElement("label");

    typeLabel.className =
        "formulier-label";

    typeLabel.textContent =
        "Type rekening";


    const typeSelect =
        document.createElement("select");

    typeSelect.className =
        "formulier-select";


    typeSelect.innerHTML = `

        <option value="Sparen">
            🏦 Sparen
        </option>

        <option value="Beleggen">
            📈 Beleggen
        </option>

        <option value="Betaalrekening">
            💳 Betaalrekening
        </option>

        <option value="Overig">
            📦 Overig
        </option>

    `;


    typeSelect.value =
        rekening.type;


    typeGroep.appendChild(typeLabel);

    typeGroep.appendChild(typeSelect);


    const bedragGroep =
        document.createElement("div");

    bedragGroep.className =
        "formulier-groep";


    const bedragLabel =
        document.createElement("label");

    bedragLabel.className =
        "formulier-label";

    bedragLabel.textContent =
        "Huidig bedrag";


    const bedragInput =
        document.createElement("input");

    bedragInput.className =
        "formulier-input";

    bedragInput.type =
        "text";

    bedragInput.inputMode =
        "decimal";

    bedragInput.value =
        rekening.bedrag
            .toString()
            .replace(".", ",");

    bedragInput.autocomplete =
        "off";


    bedragGroep.appendChild(bedragLabel);

    bedragGroep.appendChild(bedragInput);


    const knoppen =
        document.createElement("div");

    knoppen.className =
        "popup-knoppen";


    const annulerenButton =
        document.createElement("button");

    annulerenButton.className =
        "secondary-button";

    annulerenButton.type =
        "button";

    annulerenButton.textContent =
        "Annuleren";


    const opslaanButton =
        document.createElement("button");

    opslaanButton.className =
        "primary-button";

    opslaanButton.type =
        "button";

    opslaanButton.textContent =
        "Opslaan";


    knoppen.appendChild(
        annulerenButton
    );

    knoppen.appendChild(
        opslaanButton
    );


    popup.appendChild(titel);

    popup.appendChild(subtitel);

    popup.appendChild(naamGroep);

    popup.appendChild(typeGroep);

    popup.appendChild(bedragGroep);

    popup.appendChild(knoppen);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    setTimeout(function() {

        naamInput.focus();

        naamInput.select();

    }, 100);


    annulerenButton.onclick =
        function() {

            overlay.remove();

        };


    opslaanButton.onclick =
        function() {

            const nieuweNaam =
                naamInput.value.trim();

            const nieuwType =
                typeSelect.value;

            const nieuwBedragInput =
                bedragInput.value.trim();


            if (!nieuweNaam) {

                alert(
                    "Vul een naam voor de rekening in."
                );

                naamInput.focus();

                return;

            }


            if (!nieuwType) {

                alert(
                    "Kies eerst een type rekening."
                );

                typeSelect.focus();

                return;

            }


            if (!nieuwBedragInput) {

                alert(
                    "Vul een bedrag in."
                );

                bedragInput.focus();

                return;

            }


            const nieuwBedrag =
                parseFloat(
                    nieuwBedragInput
                        .replace("€", "")
                        .replace(/\s/g, "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                );


            if (isNaN(nieuwBedrag)) {

                alert(
                    "Vul een geldig bedrag in."
                );

                bedragInput.focus();

                return;

            }


            rekening.naam =
                nieuweNaam;

            rekening.type =
                nieuwType;

            rekening.bedrag =
                nieuwBedrag;


            slaRekeningenOp();

            toonRekeningen();

            berekenTotaal();

            overlay.remove();


            if (nieuwBedrag !== oudBedrag) {

                vraagVermogensMomentOpslaan();

            }

        };


    bedragInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                opslaanButton.click();

            }

        }
    );

}


/*
 * ==========================================
 * REKENING VERWIJDEREN
 * ==========================================
 */

function rekeningVerwijderen(id) {

    const rekening =
        rekeningen.find(function(item) {

            return item.id === id;

        });


    if (!rekening) {
        return;
    }


    const bevestigen = confirm(
        "Wil je " +
        rekening.naam +
        " verwijderen?"
    );


    if (!bevestigen) {
        return;
    }


    rekeningen =
        rekeningen.filter(function(item) {

            return item.id !== id;

        });


    slaRekeningenOp();

    toonRekeningen();

    berekenTotaal();

}


/*
 * ==========================================
 * VRAGEN OF VERMOGENSMOMENT OPGESLAGEN MOET WORDEN
 * ==========================================
 */

function vraagVermogensMomentOpslaan() {

    const totaal =
        rekeningen.reduce(
            function(som, rekening) {

                return som +
                    (Number(rekening.bedrag) || 0);

            },
            0
        );


    const bevestigen =
        confirm(
            "Je totale vermogen is nu " +
            formatteerBedrag(totaal) +
            ".\n\n" +
            "Wil je dit opslaan als nieuw vermogensmoment?"
        );


    if (!bevestigen) {
        return;
    }


    historie.push({

        datum:
            new Date().toISOString(),

        bedrag:
            totaal

    });


    historie.sort(
        function(a, b) {

            return (
                new Date(a.datum) -
                new Date(b.datum)
            );

        }
    );


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

}


/*
 * ==========================================
 * VERMOGENSMOMENT OPSLAAN
 * ==========================================
 */

function vermogensMomentOpslaan() {

    let totaal = 0;


    rekeningen.forEach(function(rekening) {

        totaal +=
            Number(rekening.bedrag) || 0;

    });


    historie.push({

        datum:
            new Date().toISOString(),

        bedrag:
            totaal

    });


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

}


/*
 * ==========================================
 * HISTORIE TONEN
 * ==========================================
 */

function toonHistorie() {

    const container =
        document.getElementById("historie");

    container.innerHTML = "";


    if (historie.length === 0) {

        container.innerHTML =
            '<div class="leeg">Nog geen vermogensmomenten opgeslagen.</div>';

        return;

    }


    historie.forEach(function(moment, index) {

        const div =
            document.createElement("div");

        div.className =
            "historie-item";


        const datum =
            document.createElement("div");

        datum.className =
            "historie-datum";

        datum.textContent =
            formatteerDatum(moment.datum);


        const bedrag =
            document.createElement("div");

        bedrag.textContent =
            formatteerBedrag(moment.bedrag);


        const verwijderButton =
            document.createElement("button");

        verwijderButton.type =
            "button";

        verwijderButton.textContent =
            "🗑️";

        verwijderButton.title =
            "Dit vermogensmoment verwijderen";

        verwijderButton.setAttribute(
            "aria-label",
            "Vermogensmoment van " +
            formatteerDatum(moment.datum) +
            " verwijderen"
        );

        verwijderButton.style.border =
            "none";

        verwijderButton.style.borderRadius =
            "8px";

        verwijderButton.style.padding =
            "6px 10px";

        verwijderButton.style.background =
            "#f3f4f6";

        verwijderButton.style.cursor =
            "pointer";


        verwijderButton.onclick =
            function() {

                historischMomentVerwijderen(
                    index
                );

            };


        div.appendChild(datum);

        div.appendChild(bedrag);

        div.appendChild(
            verwijderButton
        );

        container.appendChild(div);

    });

}


/*
 * ==========================================
 * HISTORISCH VERMOGENSMOMENT TOEVOEGEN
 * ==========================================
 */

function historischMomentToevoegen() {

    const overlay =
        document.createElement("div");

    overlay.className =
        "rekening-popup-overlay";


    const popup =
        document.createElement("div");

    popup.className =
        "rekening-popup";


    const titel =
        document.createElement("div");

    titel.className =
        "rekening-popup-titel";

    titel.textContent =
        "Historisch vermogensmoment";


    const subtitel =
        document.createElement("div");

    subtitel.className =
        "rekening-popup-subtitel";

    subtitel.textContent =
        "Leg je vermogen op een eerdere datum vast.";


    const datumGroep =
        document.createElement("div");

    datumGroep.className =
        "formulier-groep";


    const datumLabel =
        document.createElement("label");

    datumLabel.className =
        "formulier-label";

    datumLabel.textContent =
        "Datum";


    const datumInput =
        document.createElement("input");

    datumInput.className =
        "formulier-input";

    datumInput.type =
        "date";

    datumInput.max =
        new Date().toISOString().split("T")[0];


    datumGroep.appendChild(
        datumLabel
    );

    datumGroep.appendChild(
        datumInput
    );


    const bedragGroep =
        document.createElement("div");

    bedragGroep.className =
        "formulier-groep";


    const bedragLabel =
        document.createElement("label");

    bedragLabel.className =
        "formulier-label";

    bedragLabel.textContent =
        "Totaal vermogen";


    const bedragInput =
        document.createElement("input");

    bedragInput.className =
        "formulier-input";

    bedragInput.type =
        "text";

    bedragInput.inputMode =
        "decimal";

    bedragInput.placeholder =
        "Bijvoorbeeld 12500,50";

    bedragInput.autocomplete =
        "off";


    bedragGroep.appendChild(
        bedragLabel
    );

    bedragGroep.appendChild(
        bedragInput
    );


    const knoppen =
        document.createElement("div");

    knoppen.className =
        "popup-knoppen";


    const annulerenButton =
        document.createElement("button");

    annulerenButton.className =
        "secondary-button";

    annulerenButton.type =
        "button";

    annulerenButton.textContent =
        "Annuleren";


    const opslaanButton =
        document.createElement("button");

    opslaanButton.className =
        "primary-button";

    opslaanButton.type =
        "button";

    opslaanButton.textContent =
        "Opslaan";


    knoppen.appendChild(
        annulerenButton
    );

    knoppen.appendChild(
        opslaanButton
    );


    popup.appendChild(titel);

    popup.appendChild(subtitel);

    popup.appendChild(datumGroep);

    popup.appendChild(bedragGroep);

    popup.appendChild(knoppen);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    setTimeout(function() {

        datumInput.focus();

    }, 100);


    annulerenButton.onclick =
        function() {

            overlay.remove();

        };


    opslaanButton.onclick =
        function() {

            const datumWaarde =
                datumInput.value;

            const bedragInputWaarde =
                bedragInput.value.trim();


            if (!datumWaarde) {

                alert(
                    "Kies een datum."
                );

                datumInput.focus();

                return;

            }


            if (!bedragInputWaarde) {

                alert(
                    "Vul het totale vermogen in."
                );

                bedragInput.focus();

                return;

            }


            const bedrag =
                parseFloat(
                    bedragInputWaarde
                        .replace("€", "")
                        .replace(/\s/g, "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                );


            if (isNaN(bedrag)) {

                alert(
                    "Vul een geldig bedrag in."
                );

                bedragInput.focus();

                return;

            }


            const datum =
                new Date(
                    datumWaarde +
                    "T12:00:00"
                );


            const vandaag =
                new Date();

            vandaag.setHours(
                23,
                59,
                59,
                999
            );


            if (datum > vandaag) {

                alert(
                    "Oeps, deze datum ligt in de toekomst!"
                );

                datumInput.focus();

                return;

            }


            historie.push({

                datum:
                    datum.toISOString(),

                bedrag:
                    bedrag

            });


            historie.sort(
                function(a, b) {

                    return (
                        new Date(a.datum) -
                        new Date(b.datum)
                    );

                }
            );


            slaHistorieOp();

            toonHistorie();

            tekenGrafiek();

            overlay.remove();

        };


    bedragInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                opslaanButton.click();

            }

        }
    );

}


/*
 * ==========================================
 * ÉÉN HISTORISCH VERMOGENSMOMENT VERWIJDEREN
 * ==========================================
 */

function historischMomentVerwijderen(index) {

    const moment =
        historie[index];


    if (!moment) {
        return;
    }


    const bevestigen =
        confirm(
            "Wil je het vermogensmoment van " +
            formatteerDatum(moment.datum) +
            " (" +
            formatteerBedrag(moment.bedrag) +
            ") verwijderen?"
        );


    if (!bevestigen) {
        return;
    }


    historie.splice(
        index,
        1
    );


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

}


/*
 * ==========================================
 * HISTORIE WISSEN
 * ==========================================
 */

function historieWissen() {

    if (historie.length === 0) {
        return;
    }


    const bevestigen =
        confirm(
            "Weet je zeker dat je alle historie wilt wissen?"
        );


    if (!bevestigen) {
        return;
    }


    historie = [];


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

    updateGroeiInfo([]);

}


/*
 * ==========================================
 * PERIODE INSTELLEN
 * ==========================================
 */

function zetPeriode(periode) {

    huidigePeriode =
        periode;


    document
        .getElementById("btn-3m")
        .classList.remove("active");


    document
        .getElementById("btn-1j")
        .classList.remove("active");


    document
        .getElementById("btn-alles")
        .classList.remove("active");


    if (periode === "3m") {

        document
            .getElementById("btn-3m")
            .classList.add("active");

    }


    if (periode === "1j") {

        document
            .getElementById("btn-1j")
            .classList.add("active");

    }


    if (periode === "alles") {

        document
            .getElementById("btn-alles")
            .classList.add("active");

    }


    tekenGrafiek();

}


/*
 * ==========================================
 * GROEI INFORMATIE
 * ==========================================
 */

function updateGroeiInfo(gegevens) {

    const element =
        document.getElementById(
            "groeiInfo"
        );


    if (
        !gegevens ||
        gegevens.length < 2
    ) {

        element.textContent =
            "Nog onvoldoende gegevens voor groei.";

        return;

    }


    const eerste =
        Number(
            gegevens[0].bedrag
        );


    const laatste =
        Number(
            gegevens[
                gegevens.length - 1
            ].bedrag
        );


    const verschil =
        laatste - eerste;


    const percentage =
        eerste !== 0
            ? (verschil / eerste) * 100
            : 0;


    const teken =
        verschil >= 0
            ? "+"
            : "";


    element.textContent =
        "Groei: " +
        teken +
        formatteerBedrag(verschil) +
        " (" +
        teken +
        percentage.toFixed(1) +
        "%)";

}


/*
 * ==========================================
 * GRAFIEK TOOLTIP
 * ==========================================
 */

function verbergGrafiekTooltip() {

    const tooltip =
        document.getElementById(
            "grafiekTooltip"
        );


    if (!tooltip) {
        return;
    }


    tooltip.classList.remove(
        "visible"
    );

    tooltip.classList.remove(
        "onder"
    );

    tooltip.setAttribute(
        "aria-hidden",
        "true"
    );

}


function toonGrafiekTooltip(punt) {

    const tooltip =
        document.getElementById(
            "grafiekTooltip"
        );


    const wrapper =
        document.getElementById(
            "grafiekWrapper"
        );


    if (
        !tooltip ||
        !wrapper ||
        !punt
    ) {

        return;

    }


    const vorigePunt =
        punt.index > 0
            ? grafiekPunten[
                punt.index - 1
            ]
            : null;


    let verschil =
        null;


    if (vorigePunt) {

        verschil =
            Number(punt.item.bedrag) -
            Number(
                vorigePunt.item.bedrag
            );

    }


    const teken =
        verschil !== null &&
        verschil >= 0
            ? "+"
            : "";


    tooltip.innerHTML = `

        <div class="grafiek-tooltip-datum">
            ${formatteerDatum(punt.item.datum)}
        </div>

        <div class="grafiek-tooltip-bedrag">
            ${formatteerBedrag(punt.item.bedrag)}
        </div>

        ${
            verschil !== null
                ? `
                    <div class="grafiek-tooltip-verschil">
                        ${teken}${formatteerBedrag(verschil)}
                        t.o.v. vorig meetpunt
                    </div>
                  `
                : ""
        }

    `;


    /*
     * Tooltip niet buiten de grafiek laten vallen.
     */

    const tooltipBreedte =
        tooltip.offsetWidth || 180;


    const helft =
        tooltipBreedte / 2;


    const breedte =
        wrapper.clientWidth;


    let tooltipX =
        punt.x;


    tooltipX =
        Math.max(
            helft + 4,
            Math.min(
                breedte - helft - 4,
                tooltipX
            )
        );


    tooltip.style.left =
        tooltipX + "px";


    tooltip.style.top =
        punt.y + "px";


    tooltip.classList.remove(
        "onder"
    );


    if (punt.y < 80) {

        tooltip.classList.add(
            "onder"
        );

    }


    tooltip.classList.add(
        "visible"
    );


    tooltip.setAttribute(
        "aria-hidden",
        "false"
    );

}


/*
 * ==========================================
 * DICHTSTBIJZIJNDE GRAFIEKPUNT VINDEN
 * ==========================================
 */

function vindDichtstbijzijndePunt(event) {

    const canvas =
        document.getElementById(
            "vermogenGrafiek"
        );


    if (
        !canvas ||
        grafiekPunten.length === 0
    ) {

        return null;

    }


    const rect =
        canvas.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    let bestePunt =
        null;


    let besteAfstand =
        Infinity;


    grafiekPunten.forEach(
        function(punt) {

            const dx =
                punt.x - x;


            const dy =
                punt.y - y;


            const afstand =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                afstand <
                besteAfstand
            ) {

                besteAfstand =
                    afstand;

                bestePunt =
                    punt;

            }

        }
    );


    /*
     * Alleen reageren als je redelijk
     * dicht bij een meetpunt zit.
     */

    if (
        besteAfstand <= 45
    ) {

        return bestePunt;

    }


    return null;

}


/*
 * ==========================================
 * TIJDAS LABELS
 * ==========================================
 */

function maakTijdAsLabels(
    ctx,
    minDatum,
    maxDatum,
    xStart,
    xEinde,
    y
) {

    const verschilMs =
        maxDatum - minDatum;


    if (verschilMs <= 0) {

        return;

    }


    const dagen =
        verschilMs /
        (
            1000 *
            60 *
            60 *
            24
        );


    let aantalLabels;


    if (dagen <= 45) {

        aantalLabels = 4;

    } else if (dagen <= 120) {

        aantalLabels = 5;

    } else if (dagen <= 400) {

        aantalLabels = 5;

    } else {

        aantalLabels = 5;

    }


    /*
     * Voor een korte periode gebruiken we
     * dagen/weken.
     *
     * Voor langere periodes gebruiken we
     * maanden.
     */

    const datums = [];


    if (dagen <= 45) {

        const stap =
            verschilMs /
            (aantalLabels - 1);


        for (
            let i = 0;
            i < aantalLabels;
            i++
        ) {

            datums.push(
                new Date(
                    minDatum.getTime() +
                    stap * i
                )
            );

        }

    } else {

        const eerste =
            new Date(minDatum);


        eerste.setDate(1);


        /*
         * Als het eerste label voor de
         * gekozen periode ligt, schuiven
         * we het door naar de volgende maand.
         */

        if (
            eerste <
            minDatum
        ) {

            eerste.setMonth(
                eerste.getMonth() + 1
            );

        }


        const laatste =
            new Date(maxDatum);


        laatste.setDate(1);


        const beschikbareMaanden =
            (
                laatste.getFullYear() -
                eerste.getFullYear()
            ) * 12 +
            (
                laatste.getMonth() -
                eerste.getMonth()
            ) +
            1;


        if (
            beschikbareMaanden <=
            aantalLabels
        ) {

            for (
                let datum = new Date(eerste);
                datum <= laatste;
                datum.setMonth(
                    datum.getMonth() + 1
                )
            ) {

                datums.push(
                    new Date(datum)
                );

            }

        } else {

            const maandStap =
                Math.ceil(
                    (
                        beschikbareMaanden - 1
                    ) /
                    (
                        aantalLabels - 1
                    )
                );


            for (
                let i = 0;
                i < aantalLabels;
                i++
            ) {

                const datum =
                    new Date(eerste);


                datum.setMonth(
                    datum.getMonth() +
                    (
                        i *
                        maandStap
                    )
                );


                if (
                    datum <=
                    laatste
                ) {

                    datums.push(
                        datum
                    );

                }

            }

        }

    }


    /*
     * Labels tekenen.
     */

    ctx.save();


    ctx.fillStyle =
        "#6b7280";


    ctx.strokeStyle =
        "#e5e7eb";


    ctx.lineWidth =
        1;


    ctx.font =
        "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "top";


    datums.forEach(
        function(datum) {

            const verhouding =
                (
                    datum -
                    minDatum
                ) /
                verschilMs;


            const x =
                xStart +
                (
                    verhouding *
                    (
                        xEinde -
                        xStart
                    )
                );


            /*
             * Verticale hulplijn.
             */

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 5
            );

            ctx.lineTo(
                x,
                y + 1
            );

            ctx.stroke();


            let label;


            if (dagen <= 45) {

                label =
                    datum.toLocaleDateString(
                        "nl-NL",
                        {
                            day: "numeric",
                            month: "short"
                        }
                    );

            } else {

                label =
                    datum.toLocaleDateString(
                        "nl-NL",
                        {
                            month: "short",
                            year: "numeric"
                        }
                    );

            }


            ctx.fillText(
                label,
                x,
                y + 7
            );

        }
    );


    ctx.restore();

}


/*
 * ==========================================
 * GRAFIEK TEKENEN
 * ==========================================
 */

function tekenGrafiek() {

    const canvas =
        document.getElementById(
            "vermogenGrafiek"
        );


    if (!canvas) {
        return;
    }


    const wrapper =
        document.getElementById(
            "grafiekWrapper"
        );


    const ctx =
        canvas.getContext("2d");


    const breedte =
        canvas.clientWidth;


    const hoogte =
        290;


    if (
        breedte <= 0
    ) {

        return;

    }


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        breedte * dpr;


    canvas.height =
        hoogte * dpr;


    ctx.scale(
        dpr,
        dpr
    );


    ctx.clearRect(
        0,
        0,
        breedte,
        hoogte
    );


    grafiekPunten = [];


    verbergGrafiekTooltip();


    let gegevens =
        [...historie];


    /*
     * Altijd chronologisch sorteren.
     */

    gegevens.sort(
        function(a, b) {

            return (
                new Date(a.datum) -
                new Date(b.datum)
            );

        }
    );


    /*
     * Periode filteren.
     */

    if (
        huidigePeriode === "3m"
    ) {

        const grens =
            new Date();


        grens.setMonth(
            grens.getMonth() - 3
        );


        gegevens =
            gegevens.filter(
                function(item) {

                    return (
                        new Date(item.datum) >=
                        grens
                    );

                }
            );

    }


    if (
        huidigePeriode === "1j"
    ) {

        const grens =
            new Date();


        grens.setFullYear(
            grens.getFullYear() - 1
        );


        gegevens =
            gegevens.filter(
                function(item) {

                    return (
                        new Date(item.datum) >=
                        grens
                    );

                }
            );

    }


    /*
     * Per kalendermaand alleen het laatste
     * vermogensmoment in de grafiek gebruiken.
     * De originele historie blijft ongewijzigd.
     */
    const laatsteMomentPerMaand = new Map();

    gegevens.forEach(function(item, index) {
        const datum = new Date(item.datum);
        const sleutel =
            datum.getFullYear() + "-" +
            String(datum.getMonth() + 1).padStart(2, "0");

        const bestaand = laatsteMomentPerMaand.get(sleutel);

        if (
            !bestaand ||
            datum > new Date(bestaand.item.datum) ||
            (
                datum.getTime() === new Date(bestaand.item.datum).getTime() &&
                index > bestaand.index
            )
        ) {
            laatsteMomentPerMaand.set(sleutel, {
                item: item,
                index: index
            });
        }
    });

    gegevens = Array.from(laatsteMomentPerMaand.values())
        .map(function(entry) {
            return entry.item;
        })
        .sort(function(a, b) {
            return new Date(a.datum) - new Date(b.datum);
        });

    updateGroeiInfo(
        gegevens
    );


    if (
        gegevens.length === 0
    ) {

        ctx.fillStyle =
            "#6b7280";


        ctx.font =
            "14px sans-serif";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            "Nog geen gegevens",
            breedte / 2,
            120
        );


        return;

    }


    /*
     * ==========================================
     * GRAFIEK BEREKENEN
     * ==========================================
     */

    const waarden =
        gegevens.map(
            function(item) {

                return Number(
                    item.bedrag
                );

            }
        );


    const minimum =
        Math.min(
            ...waarden
        );


    const maximum =
        Math.max(
            ...waarden
        );


    const marge =
        maximum === minimum
            ? Math.max(
                100,
                Math.abs(maximum) * 0.05
            )
            : (
                maximum - minimum
            ) * 0.15;


    const minWaarde =
        minimum - marge;


    const maxWaarde =
        maximum + marge;


    /*
     * Extra ruimte links/rechts zodat
     * de eerste en laatste punten niet
     * tegen de rand staan.
     */

    const paddingLinks =
        12;


    const paddingRechts =
        12;


    const paddingBoven =
        20;


    const paddingOnder =
        55;


    const grafiekBreedte =
        breedte -
        paddingLinks -
        paddingRechts;


    const grafiekHoogte =
        hoogte -
        paddingBoven -
        paddingOnder;


    /*
     * ==========================================
     * ECHTE TIJDSCHAAL
     * ==========================================
     */

    let minDatum =
        new Date(
            gegevens[0].datum
        );


    let maxDatum =
        new Date(
            gegevens[
                gegevens.length - 1
            ].datum
        );


    /*
     * Als er maar één meetpunt is,
     * maken we een kleine tijdspanne.
     */

    if (
        minDatum.getTime() ===
        maxDatum.getTime()
    ) {

        minDatum =
            new Date(
                minDatum.getTime() -
                7 *
                24 *
                60 *
                60 *
                1000
            );


        maxDatum =
            new Date(
                maxDatum.getTime() +
                7 *
                24 *
                60 *
                60 *
                1000
            );

    }


    const tijdsduur =
        maxDatum -
        minDatum;


    /*
     * ==========================================
     * HULPLIJNEN
     * ==========================================
     */

    ctx.save();


    ctx.strokeStyle =
        "#f0f1f3";


    ctx.lineWidth =
        1;


    /*
     * Een paar horizontale hulplijnen.
     */

    const aantalHorizontaleLijnen =
        4;


    for (
        let i = 0;
        i <= aantalHorizontaleLijnen;
        i++
    ) {

        const y =
            paddingBoven +
            (
                i /
                aantalHorizontaleLijnen
            ) *
            grafiekHoogte;


        ctx.beginPath();


        ctx.moveTo(
            paddingLinks,
            y
        );


        ctx.lineTo(
            breedte -
            paddingRechts,
            y
        );


        ctx.stroke();

    }


    ctx.restore();


    /*
     * ==========================================
     * LIJN TEKENEN
     * ==========================================
     */

    ctx.beginPath();


    gegevens.forEach(
        function(item, index) {

            const datum =
                new Date(
                    item.datum
                );


            const tijdVerhouding =
                (
                    datum -
                    minDatum
                ) /
                tijdsduur;


            const x =
                paddingLinks +
                (
                    tijdVerhouding *
                    grafiekBreedte
                );


            const waarde =
                Number(
                    item.bedrag
                );


            const waardeVerhouding =
                (
                    waarde -
                    minWaarde
                ) /
                (
                    maxWaarde -
                    minWaarde
                );


            const y =
                paddingBoven +
                (
                    1 -
                    waardeVerhouding
                ) *
                grafiekHoogte;


            grafiekPunten.push({

                x: x,

                y: y,

                item: item,

                index: index

            });


            if (
                index === 0
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#111827";


    ctx.lineWidth =
        3;


    ctx.lineJoin =
        "round";


    ctx.lineCap =
        "round";


    ctx.stroke();


    /*
     * ==========================================
     * MEETPUNTEN
     * ==========================================
     */

    grafiekPunten.forEach(
        function(punt) {

            ctx.beginPath();


            ctx.arc(
                punt.x,
                punt.y,
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#111827";


            ctx.fill();

        }
    );


    /*
     * ==========================================
     * TIJDAS
     * ==========================================
     */

    maakTijdAsLabels(
        ctx,
        minDatum,
        maxDatum,
        paddingLinks,
        breedte - paddingRechts,
        paddingBoven +
        grafiekHoogte
    );


}


/*
 * ==========================================
 * GRAFIEK INTERACTIE
 * ==========================================
 */

const grafiekCanvas =
    document.getElementById(
        "vermogenGrafiek"
    );


if (grafiekCanvas) {

    /*
     * Desktop: hover.
     */

    grafiekCanvas.addEventListener(
        "mousemove",
        function(event) {

            const punt =
                vindDichtstbijzijndePunt(
                    event
                );


            if (punt) {

                toonGrafiekTooltip(
                    punt
                );

            } else {

                verbergGrafiekTooltip();

            }

        }
    );


    grafiekCanvas.addEventListener(
        "mouseleave",
        function() {

            verbergGrafiekTooltip();

        }
    );


    /*
     * Mobiel: tik op een meetpunt.
     */

    grafiekCanvas.addEventListener(
        "click",
        function(event) {

            const punt =
                vindDichtstbijzijndePunt(
                    event
                );


            if (punt) {

                toonGrafiekTooltip(
                    punt
                );

            } else {

                verbergGrafiekTooltip();

            }

        }
    );

}


/*
 * ==========================================
 * APP STARTEN
 * ==========================================
 */

toonRekeningen();

berekenTotaal();

toonHistorie();

zetPeriode("alles");


window.addEventListener(
    "resize",
    tekenGrafiek
);
