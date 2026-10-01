/*
 * ==========================================
 * DATA
 * ==========================================
 */

let rekeningen =
    JSON.parse(
        localStorage.getItem(
            "mijnVermogenRekeningen"
        )
    ) || [];


let historie =
    JSON.parse(
        localStorage.getItem(
            "mijnVermogenHistorie"
        )
    ) || [];


let huidigePeriode =
    "alles";


let vermogensDoel =
    Number(
        localStorage.getItem(
            "mijnVermogenDoel"
        )
    ) || 0;


/*
 * ==========================================
 * HISTORIE OPSLAAN
 * ==========================================
 */

function slaHistorieOp() {

    localStorage.setItem(
        "mijnVermogenHistorie",
        JSON.stringify(historie)
    );

}


/*
 * ==========================================
 * BEDRAG FORMATTEREN
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
 * DATUM FORMATTEREN
 * ==========================================
 */

function formatteerDatum(datum) {

    return new Date(
        datum
    ).toLocaleDateString(
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


    rekeningen.forEach(
        function(rekening) {

            totaal +=
                Number(
                    rekening.bedrag
                ) || 0;

        }
    );


    const totaalElement =
        document.getElementById(
            "totaal"
        );


    if (totaalElement) {

        totaalElement.textContent =
            formatteerBedrag(
                totaal
            );

    }


    /*
     * ==========================================
     * DOELSTELLING
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
        !doelContainer ||
        !doelPercentage ||
        !doelBalkVulling ||
        !doelTekst
    ) {

        return;

    }


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
        (
            totaal /
            vermogensDoel
        ) * 100;


    percentage =
        Math.min(
            percentage,
            100
        );


    doelPercentage.textContent =
        Math.round(
            percentage
        ) + "%";


    doelBalkVulling.style.width =
        percentage + "%";


    if (
        totaal >=
        vermogensDoel
    ) {

        doelTekst.textContent =
            "Doel bereikt 🎉";

    } else {

        const resterend =
            vermogensDoel -
            totaal;


        doelTekst.textContent =
            formatteerBedrag(
                resterend
            ) +
            " te gaan";

    }

}


/*
 * ==========================================
 * REKENINGEN TONEN
 * ==========================================
 */

function toonRekeningen() {

    const container =
        document.getElementById(
            "rekeningen"
        );


    container.innerHTML =
        "";


    if (
        rekeningen.length === 0
    ) {

        container.innerHTML =
            '<div class="leeg">Nog geen rekeningen toegevoegd.</div>';

        return;

    }


    rekeningen.forEach(
        function(rekening, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "rekening-item";


            const informatie =
                document.createElement(
                    "div"
                );


            informatie.className =
                "rekening-informatie";


            const naam =
                document.createElement(
                    "div"
                );


            naam.className =
                "rekening-naam";


            naam.textContent =
                rekening.naam;


            const type =
                document.createElement(
                    "div"
                );


            type.className =
                "rekening-type";


            type.textContent =
                rekening.type;


            informatie.appendChild(
                naam
            );

            informatie.appendChild(
                type
            );


            const bedrag =
                document.createElement(
                    "div"
                );


            bedrag.className =
                "rekening-bedrag";


            bedrag.textContent =
                formatteerBedrag(
                    rekening.bedrag
                );


            const acties =
                document.createElement(
                    "div"
                );


            acties.className =
                "rekening-acties";


            const bewerkButton =
                document.createElement(
                    "button"
                );


            bewerkButton.type =
                "button";


            bewerkButton.className =
                "rekening-bewerkknop";


            bewerkButton.textContent =
                "✎";


            bewerkButton.title =
                "Rekening bewerken";


            bewerkButton.onclick =
                function() {

                    rekeningBewerken(
                        index
                    );

                };


            const verwijderButton =
                document.createElement(
                    "button"
                );


            verwijderButton.type =
                "button";


            verwijderButton.className =
                "rekening-verwijderknop";


            verwijderButton.textContent =
                "×";


            verwijderButton.title =
                "Rekening verwijderen";


            verwijderButton.onclick =
                function() {

                    rekeningVerwijderen(
                        index
                    );

                };


            acties.appendChild(
                bewerkButton
            );


            acties.appendChild(
                verwijderButton
            );


            div.appendChild(
                informatie
            );


            div.appendChild(
                bedrag
            );


            div.appendChild(
                acties
            );


            container.appendChild(
                div
            );

        }
    );

}


/*
 * ==========================================
 * REKENING TOEVOEGEN
 * ==========================================
 */

function rekeningToevoegen() {

    const naam =
        prompt(
            "Naam van de rekening:"
        );


    if (
        !naam
    ) {

        return;

    }


    const bedrag =
        Number(
            prompt(
                "Bedrag:"
            )
        );


    if (
        isNaN(bedrag)
    ) {

        return;

    }


    const type =
        prompt(
            "Type rekening:\n\n" +
            "◈ Sparen\n" +
            "↗ Beleggen\n" +
            "≡ Betaalrekening\n" +
            "• Overig"
        );


    if (
        !type
    ) {

        return;

    }


    rekeningen.push({

        id:
            Date.now(),

        naam:
            naam,

        type:
            type,

        bedrag:
            bedrag

    });


    localStorage.setItem(
        "mijnVermogenRekeningen",
        JSON.stringify(
            rekeningen
        )
    );


    toonRekeningen();

    berekenTotaal();

}


/*
 * ==========================================
 * REKENING BEWERKEN
 * ==========================================
 */

function rekeningBewerken(index) {

    const rekening =
        rekeningen[index];


    if (
        !rekening
    ) {

        return;

    }


    const nieuweNaam =
        prompt(
            "Naam van de rekening:",
            rekening.naam
        );


    if (
        nieuweNaam === null
    ) {

        return;

    }


    const nieuwBedrag =
        Number(
            prompt(
                "Bedrag:",
                rekening.bedrag
            )
        );


    if (
        isNaN(nieuwBedrag)
    ) {

        return;

    }


    const nieuwType =
        prompt(
            "Type rekening:\n\n" +
            "◈ Sparen\n" +
            "↗ Beleggen\n" +
            "≡ Betaalrekening\n" +
            "• Overig",
            rekening.type
        );


    if (
        nieuwType === null
    ) {

        return;

    }


    rekening.naam =
        nieuweNaam;


    rekening.bedrag =
        nieuwBedrag;


    rekening.type =
        nieuwType;


    localStorage.setItem(
        "mijnVermogenRekeningen",
        JSON.stringify(
            rekeningen
        )
    );


    toonRekeningen();

    berekenTotaal();

}


/*
 * ==========================================
 * REKENING VERWIJDEREN
 * ==========================================
 */

function rekeningVerwijderen(index) {

    if (
        !rekeningen[index]
    ) {

        return;

    }


    const akkoord =
        confirm(
            "Weet je zeker dat je deze rekening wilt verwijderen?"
        );


    if (
        !akkoord
    ) {

        return;

    }


    rekeningen.splice(
        index,
        1
    );


    localStorage.setItem(
        "mijnVermogenRekeningen",
        JSON.stringify(
            rekeningen
        )
    );


    toonRekeningen();

    berekenTotaal();

}


/*
 * ==========================================
 * VERMOGENSMOMENT OPSLAAN
 * ==========================================
 */

function vraagVermogensMomentOpslaan() {

    const akkoord =
        confirm(
            "Wil je het huidige vermogen opslaan als vermogensmoment?"
        );


    if (
        !akkoord
    ) {

        return;

    }


    vermogensMomentOpslaan();

}


/*
 * ==========================================
 * VERMOGENSMOMENT OPSLAAN
 * ==========================================
 */

function vermogensMomentOpslaan() {

    let totaal = 0;


    rekeningen.forEach(
        function(rekening) {

            totaal +=
                Number(
                    rekening.bedrag
                ) || 0;

        }
    );


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
        document.getElementById(
            "historie"
        );


    container.innerHTML =
        "";


    if (
        historie.length === 0
    ) {

        container.innerHTML =
            '<div class="leeg">Nog geen vermogensmomenten opgeslagen.</div>';

        return;

    }


    /*
     * ==========================================
     * HISTORIE SORTEREN
     * ==========================================
     */

    const gesorteerdeHistorie =
        historie
            .map(
                function(moment, index) {

                    return {

                        moment:
                            moment,

                        origineleIndex:
                            index

                    };

                }
            )
            .sort(
                function(a, b) {

                    return new Date(
                        b.moment.datum
                    ) -
                    new Date(
                        a.moment.datum
                    );

                }
            );


    /*
     * ==========================================
     * HISTORIE-ITEMS TONEN
     * ==========================================
     */

    gesorteerdeHistorie.forEach(
        function(item, weergaveIndex) {

            const moment =
                item.moment;


            const origineleIndex =
                item.origineleIndex;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "historie-item";


            /*
             * Vanaf het 4e moment zijn
             * de historische momenten ouder.
             */

            if (
                weergaveIndex >= 3
            ) {

                div.classList.add(
                    "historie-ouder"
                );

            }


            const datum =
                document.createElement(
                    "div"
                );


            datum.className =
                "historie-datum";


            datum.textContent =
                formatteerDatum(
                    moment.datum
                );


            const bedrag =
                document.createElement(
                    "div"
                );


            bedrag.textContent =
                formatteerBedrag(
                    moment.bedrag
                );


            const verwijderButton =
                document.createElement(
                    "button"
                );


            verwijderButton.type =
                "button";


            verwijderButton.className =
                "historie-verwijderknop";


            verwijderButton.textContent =
                "×";


            verwijderButton.title =
                "Dit vermogensmoment verwijderen";


            verwijderButton.setAttribute(
                "aria-label",
                "Vermogensmoment van " +
                formatteerDatum(
                    moment.datum
                ) +
                " verwijderen"
            );


            verwijderButton.onclick =
                function() {

                    historischMomentVerwijderen(
                        origineleIndex
                    );

                };


            div.appendChild(
                datum
            );


            div.appendChild(
                bedrag
            );


            div.appendChild(
                verwijderButton
            );


            container.appendChild(
                div
            );

        }
    );


    /*
     * ==========================================
     * OUDERE MOMENTEN INKLAPPEN
     * ==========================================
     */

    if (
        gesorteerdeHistorie.length > 3
    ) {

        const oudereMomenten =
            Array.from(
                container.querySelectorAll(
                    ".historie-ouder"
                )
            );


        oudereMomenten.forEach(
            function(item) {

                item.style.display =
                    "none";

            }
        );


        const knop =
            document.createElement(
                "button"
            );


        knop.type =
            "button";


        knop.className =
            "historie-meer-knop";


        knop.textContent =
            "Toon oudere momenten ↓";


        let geopend =
            false;


        knop.onclick =
            function() {

                geopend =
                    !geopend;


                oudereMomenten.forEach(
                    function(item) {

                        item.style.display =
                            geopend
                                ? "flex"
                                : "none";

                    }
                );


                knop.textContent =
                    geopend
                        ? "Verberg oudere momenten ↑"
                        : "Toon oudere momenten ↓";

            };


        container.appendChild(
            knop
        );

    }

}


/*
 * ==========================================
 * HISTORISCH VERMOGENSMOMENT TOEVOEGEN
 * ==========================================
 */

function historischMomentToevoegen() {

    const datum =
        prompt(
            "Datum (bijvoorbeeld 01-09-2026):"
        );


    if (
        !datum
    ) {

        return;

    }


    const delen =
        datum.split("-");


    if (
        delen.length !== 3
    ) {

        alert(
            "Gebruik het formaat DD-MM-JJJJ."
        );

        return;

    }


    const dag =
        delen[0];


    const maand =
        delen[1];


    const jaar =
        delen[2];


    const datumObject =
        new Date(
            jaar,
            maand - 1,
            dag
        );


    if (
        isNaN(
            datumObject.getTime()
        )
    ) {

        alert(
            "Ongeldige datum."
        );

        return;

    }


    const bedrag =
        Number(
            prompt(
                "Vermogen op deze datum:"
            )
        );


    if (
        isNaN(bedrag)
    ) {

        return;

    }


    historie.push({

        datum:
            datumObject.toISOString(),

        bedrag:
            bedrag

    });


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

}


/*
 * ==========================================
 * HISTORISCH MOMENT VERWIJDEREN
 * ==========================================
 */

function historischMomentVerwijderen(index) {

    if (
        !historie[index]
    ) {

        return;

    }


    const akkoord =
        confirm(
            "Weet je zeker dat je dit vermogensmoment wilt verwijderen?"
        );


    if (
        !akkoord
    ) {

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

    if (
        historie.length === 0
    ) {

        return;

    }


    const akkoord =
        confirm(
            "Weet je zeker dat je alle historische vermogensmomenten wilt verwijderen?"
        );


    if (
        !akkoord
    ) {

        return;

    }


    historie = [];


    slaHistorieOp();

    toonHistorie();

    tekenGrafiek();

}


/*
 * ==========================================
 * PERIODE INSTELLEN
 * ==========================================
 */

function zetPeriode(
    periode
) {

    huidigePeriode =
        periode;


    document
        .querySelectorAll(
            ".periode-knop"
        )
        .forEach(
            function(knop) {

                knop.classList.remove(
                    "actief"
                );

            }
        );


    const actieveKnop =
        document.querySelector(
            '[data-periode="' +
            periode +
            '"]'
        );


    if (
        actieveKnop
    ) {

        actieveKnop.classList.add(
            "actief"
        );

    }


    updateGroeiInfo();

    tekenGrafiek();

}


/*
 * ==========================================
 * GROEI-INFORMATIE
 * ==========================================
 */

function updateGroeiInfo() {

    const groeiInfo =
        document.getElementById(
            "groeiInfo"
        );


    if (
        !groeiInfo
    ) {

        return;

    }


    if (
        historie.length < 2
    ) {

        groeiInfo.textContent =
            "";

        return;

    }


    const gesorteerd =
        historie
            .slice()
            .sort(
                function(a, b) {

                    return new Date(
                        a.datum
                    ) -
                    new Date(
                        b.datum
                    );

                }
            );


    let relevanteHistorie =
        gesorteerd;


    const nu =
        new Date();


    if (
        huidigePeriode ===
        "3m"
    ) {

        const grens =
            new Date();

        grens.setMonth(
            grens.getMonth() - 3
        );


        relevanteHistorie =
            gesorteerd.filter(
                function(moment) {

                    return new Date(
                        moment.datum
                    ) >= grens;

                }
            );

    }


    if (
        huidigePeriode ===
        "1j"
    ) {

        const grens =
            new Date();

        grens.setFullYear(
            grens.getFullYear() - 1
        );


        relevanteHistorie =
            gesorteerd.filter(
                function(moment) {

                    return new Date(
                        moment.datum
                    ) >= grens;

                }
            );

    }


    if (
        relevanteHistorie.length < 2
    ) {

        groeiInfo.textContent =
            "";

        return;

    }


    const eerste =
        relevanteHistorie[0].bedrag;


    const laatste =
        relevanteHistorie[
            relevanteHistorie.length - 1
        ].bedrag;


    const verschil =
        laatste - eerste;


    const percentage =
        eerste !== 0
            ? (
                verschil /
                eerste
            ) * 100
            : 0;


    const teken =
        verschil >= 0
            ? "+"
            : "";


    groeiInfo.textContent =
        teken +
        formatteerBedrag(
            verschil
        ) +
        " (" +
        teken +
        percentage.toFixed(
            1
        ) +
        "%)";

}


/*
 * ==========================================
 * GRAFIEK
 * ==========================================
 */

function tekenGrafiek() {

    const canvas =
        document.getElementById(
            "vermogenGrafiek"
        );


    if (
        !canvas
    ) {

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    const wrapper =
        canvas.parentElement;


    const breedte =
        wrapper.clientWidth;


    const hoogte =
        290;


    canvas.width =
        breedte;


    canvas.height =
        hoogte;


    ctx.clearRect(
        0,
        0,
        breedte,
        hoogte
    );


    if (
        historie.length === 0
    ) {

        return;

    }


    /*
     * ==========================================
     * HISTORIE PER MAAND
     * ==========================================
     */

    const perMaand = {};


    historie.forEach(
        function(moment) {

            const datum =
                new Date(
                    moment.datum
                );


            const sleutel =
                datum.getFullYear() +
                "-" +
                String(
                    datum.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            perMaand[sleutel] =
                moment;

        }
    );


    const punten =
        Object.keys(
            perMaand
        )
        .sort()
        .map(
            function(sleutel) {

                return perMaand[
                    sleutel
                ];

            }
        );


    if (
        punten.length === 0
    ) {

        return;

    }


    const padding =
        30;


    const minWaarde =
        Math.min(
            ...punten.map(
                function(punt) {

                    return punt.bedrag;

                }
            )
        );


    const maxWaarde =
        Math.max(
            ...punten.map(
                function(punt) {

                    return punt.bedrag;

                }
            )
        );


    const verschil =
        maxWaarde -
        minWaarde;


    const marge =
        verschil === 0
            ? 100
            : verschil * 0.15;


    const ondergrens =
        minWaarde -
        marge;


    const bovengrens =
        maxWaarde +
        marge;


    function xPositie(index) {

        if (
            punten.length === 1
        ) {

            return breedte / 2;

        }


        return padding +
            (
                index /
                (
                    punten.length - 1
                )
            ) *
            (
                breedte -
                padding * 2
            );

    }


    function yPositie(bedrag) {

        return hoogte -
            padding -
            (
                (
                    bedrag -
                    ondergrens
                ) /
                (
                    bovengrens -
                    ondergrens
                )
            ) *
            (
                hoogte -
                padding * 2
            );

    }


    /*
     * ==========================================
     * LIJN
     * ==========================================
     */

    ctx.beginPath();


    punten.forEach(
        function(punt, index) {

            const x =
                xPositie(
                    index
                );


            const y =
                yPositie(
                    punt.bedrag
                );


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


    ctx.stroke();


    /*
     * ==========================================
     * PUNTEN
     * ==========================================
     */

    punten.forEach(
        function(punt, index) {

            const x =
                xPositie(
                    index
                );


            const y =
                yPositie(
                    punt.bedrag
                );


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );


            ctx.fill();

        }
    );

}


/*
 * ==========================================
 * GRAFIEK OPNIEUW TEKENEN BIJ RESIZE
 * ==========================================
 */

window.addEventListener(
    "resize",
    tekenGrafiek
);


/*
 * ==========================================
 * APP STARTEN
 * ==========================================
 */

toonRekeningen();

berekenTotaal();

toonHistorie();

zetPeriode(
    "alles"
);
