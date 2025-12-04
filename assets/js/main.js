/**Sources
 *SRC0 : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/JSON
 *SRC1 : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
 *SRC2 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises
 *SRC3 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array
 *SRC4 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 *SRC5 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 *SRC6 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Loops_and_iteration
 */

console.log("BDE Adventure - V.0.4")
/*Variables ========================================= */
/* Point de Vie */
let vieJoueur = 100
let vieEnnemi = 100

/**Tab JSON Import */
let eventsDB = [];
let toolsDB = [];
let malusDB = [];
let skinDB = [];

/**Timer Varibles Initialisation */
let seconde = 0;
let secondePrint;
let chrono;
let time = 0;

/**Stat Level Initialisation */
let lvlCard;
let lvlCM;
let lvlArgent;
let lvlEnergy;
let win;

/**Capacité */
let printCapaType;
let printCapaChange;

/**Level Selection & Win Variables Initialisation */
let level = 1;
const lvlWinTab = {
    1 : false,
    2 : false,
    3 : false,
    4 : false,
    5 : false,
    6 : false,
    7 : false,
    8 : false,
    9 : false,
    10 : false,
    11 : false
}

/**Skin Variables */
let skinSelect = 1;

/*Attaque*/
const degatsAttaque = {
    'attaque1': 10,
    'attaque2' : 20,
    'attaque3' : 30,
    'attaque4' : 40
}

/*Algo ============================================= */
/**Function Général */
function importJSON(val, JSON){
    console.log(`Import Start from "assets/js/data/${JSON}.json" to ${JSON}`)
    fetch(`assets/js/data/${JSON}.json`) // On va chercher le fichier JSON [SRC1]
        .then(reponse => reponse.json()) // then = ensuite (on recupére le texte brut du JSON) On convertit le fichier en JS [SRC2]
        .then(data => { //[SRC2]
            val.push(...data); // On incorpore le JSON dans la variable Event les "..." permette de vider Data dans la variable choisi [SRC4]
            ActuLevel(1);  // On lance le niveau 1 direct
        });
}

function speak(cible, message){
    document.getElementById(cible).textContent = message
}

function popup(cible, action, titre, message, texteBtn, onclick){
    if(action==true){
        document.getElementById(cible).classList.remove("hide");
        speak("popupTitre", titre)
        speak("popupMsg", message)
        speak("btn", texteBtn)
        document.getElementById("btn").setAttribute("onclick", onclick);
        console.log(`Popup ${cible} à été affiché, avec comme titre : ${titre}, comme message : ${message}, comme texte de bouton ${texteBtn} et comme action ${onclick}`)
    }
    if(action==false){
        document.getElementById(cible).classList.add("hide");
        console.log(`Popup ${cible} à été masqué`)
    }
}

function random(max) {
    console.log("Random lancer avec max = " + max)
    return Math.floor(Math.random() * max); /**[SRC5] */
}

/**Récupération des fichier JSON */
importJSON(skinDB, "skin")
importJSON(eventsDB,"event")
importJSON(toolsDB,"tools")
importJSON(malusDB,"malus")

/**Séléction des Niveaux */
function lvlPlus(win){
    level++;
    if(win==true){
        lvlWinTab[level] = true
    } else (
        lvlWinTab[level] = false
    )
    ActuLevel(level)
}

function ActuLevel(levelSelect) {
    if (eventsDB.length === 0) return; //Sécurité au cas ou le JSON charge pas
    level = levelSelect; //On initialise le niveau
    lvlCard = eventsDB[levelSelect - 1]; //Le tableau Event remplit plus tot avec le info du JSON, commence à 0 (donc ID 0 = LV 1) [SRC3]
    document.getElementById('event').src = lvlCard.src;
    time = lvlCard.Temps;
    lvlCM = lvlCard.CM;
    lvlArgent = lvlCard.Argent;
    lvlEnergy = lvlCard.Energy;
    speak("level",lvlCard.nom)
    actuStat()
    timer()
    gameWin()
}

function actuStat(){
    speak("CM",lvlCM)
    speak("argent",lvlArgent)
    speak("energy",lvlEnergy)
}

/**Système de Victoire */
function gameWin(){
    if(lvlWinTab["1"] == true && lvlWinTab["2"]  == true && lvlWinTab["3"]  == true && lvlWinTab["4"]  == true && lvlWinTab["5"]  == true && lvlWinTab["6"]  == true && lvlWinTab["7"]  == true && lvlWinTab["8"]  == true && lvlWinTab["9"]  == true && lvlWinTab["10"]  == true && lvlWinTab["11"]  == true){
        console.log("Game Win")
        popup(true, "Vous avez réussie !", "Le BDE a fait tout ses événement Félicitation !", "Quitter")
    }
}

function lvlWin(win) {
    if (win==true) {
        popup("popupBase", true, "Vous avez réussie !", `L'événément ${lvlCard.nom} est un succés !`,"Niveau Suivant", "demarrageJeu(level +1)")
    } else {
        popup("popupBase", true, "Dommage...","Mince, Une prochaine fois", "Recommencer", "demarrageJeu(level)")
    }
    gameWin()
}

function lvlWinDetect(){
    if(lvlCM == 0 && lvlArgent == 0 && lvlEnergy ==0){
        lvlWinTab[level] = true;
        clearInterval(chrono);
        console.log(`Niveau ${level} gagner !`)
        lvlWin(true)
    } else {
        lvlWinTab[level] == true;
    }
}

/**Timer Function*/
function timer(){
    console.log("Timer Start")
    if(chrono !== null){
        clearInterval(chrono);
    }
    seconde = 0; 
    chrono = setInterval(() => {
        printTimer();
        lvlWinDetect()
        actuStat()
        
        if(seconde > 0){
            seconde--;
        } else {
            if(time > 0){
                time--;
                seconde = 59;
            } else {
                lvlWin(false);
                clearInterval(chrono); 
            }
        }
    }, 1000);
}

function printTimer(){
    if(seconde < 10){
        secondePrint = `0${seconde}`
    } else {
        secondePrint = seconde
    }
    speak("timer",time + ":" + secondePrint)
}

function cligno(cible){
    for(let i = 0; i < 5; i++){ /**[SRC6] */
        console.info("cligno s'est ext")
        document.getElementById(cible).classList.add("red")
        setTimeout(() => {
            document.getElementById(cible).classList.remove("red")
        }, 500);
    }
}

/**Skin Selection */
function ActuSkinApercu(){
    const printSkin = skinDB[skinSelect - 1];
    document.getElementById('skinApercu').src = printSkin.src;
    document.getElementById('nomSkin').textContent = printSkin.nom;
    const printTagline = `"${printSkin.tagline}"`
    document.getElementById('tagSkin').textContent = printTagline;
    document.getElementById('roleSkin').textContent = printSkin.role;
}

function ActuSkin(){
    const printSkin = skinDB[skinSelect - 1];
    document.getElementById('player').src = printSkin.src;
}

function choixSkinPopup(){
    skinSelect = 1
    ActuSkinApercu()
    popup("popupIntro", false)
    popup("popupSkin", true)
}

function leftArrow(){
    if (skinSelect>1){
        skinSelect--
    } else if(skinSelect<=1){
        skinSelect = 21;
    }
    console.log("Skin Séléctioner N° : " + skinSelect)
    ActuSkinApercu()
}

function rightArrow(){
    if (skinSelect<21){
        skinSelect++
    } else if(skinSelect>=21){
        skinSelect = 1;
    }
    console.log("Skin Séléctioner N° : " + skinSelect)
    ActuSkinApercu()
}

/* -------------------------- Gameplay -------------------------- */

/**Démarrage du Jeu */
function demarrageJeu(levelSelect){
    popup("popupBase", false)
    ActuSkin()
    popup("popupSkin", false)
    ActuLevel(levelSelect)
    speak("announcement", `Réaliser l'événement ${lvlCard.nom}`)
}

/* Mise à jour des points de vie */
function updateScore(stat, change, called) {
    console.log(`Update et à été lancé par ${called} avec stat= ${stat} et change= ${change}`)
    if(stat!=undefined && change!=undefined){
        if(stat=="energy"){
            console.info(`Energie est à ${lvlEnergy} avant changement`)
            lvlEnergy = lvlEnergy + change
            console.info(`Energie est à ${lvlEnergy} après changement`)
        } else if (stat=="argent"){
            console.info(`Argent est à ${lvlArgent} avant changement`)
            lvlArgent = lvlArgent + change
            console.info(`Argent est à ${lvlArgent} après changement`)
        } else if (stat=="temps"){
            console.info(`Temps est à ${time} avant changement`)
            time = time + change
            console.info(`Temps est à ${time} après changement`)
            cligno("timer")
        } else if (stat=="CM"){
            console.info(`CM est à ${lvlCM} avant changement`)
            lvlCM = lvlCM + change
            console.info(`CM est à ${lvlCM} après changement`)
        }else {
        console.error("Update n'as trouvé de corréspondance")
        }
        actuStat()
    } else {
        console.error("Update n'as trouvé de corréspondance")
    }
}

/* Fonction d'attaque du joueur */
function look(val, called){
    console.log(`look cherche ${val.nom} et à été lancer par ${called}`)
    if(val.capaType=="energy"){
        printCapaType = "d'énergie"
        printCapaChange = val.Energy
    } else if (val.capaType=="argent"){
        printCapaType = "d'argent"
        printCapaChange = val.Argent
    } else if (val.capaType=="temps"){
        printCapaType = "de temps"
        printCapaChange = val.Temps
    } else if (val.capaType=="CM"){
        printCapaType = "de couverture médiatique"
        printCapaChange = val.CM
    } else {
        console.error("Look n'as trouvé de corréspondance")
    }
    if(printCapaType==undefined && printCapaChange==undefined){
        console.error("look n'as pas trouver")
        return
    }
    console.log(`Look a trouve printCapaType = ${printCapaType} & printCapaChange = ${printCapaChange}`)
}

function callTools() {
    console.log("Tools was called")
    let ToolSelectid;
    ToolSelectid = random(7)
    console.log("ToolSelectid = " + ToolSelectid)
    const ToolSelect = toolsDB[ToolSelectid]
    console.log("Carte Choisie = " + ToolSelect.nom + " avec pour source : " + ToolSelect.src)
    document.getElementById("cardTool").src = ToolSelect.src
    look(ToolSelect, "tools")
    updateScore(ToolSelect.capaType, printCapaChange)
    speak("announcement",`Vous avez obtenu l'outil ${ToolSelect.nom}, cela vous fait gagner +${printCapaChange} ${printCapaType}`)
    setTimeout(() => {
        callMalus()
    }, 2000);
}

/* Fonction d'attaque de l'ennemi */
function callMalus() {
    console.log("Malus was called")
    let MalusSelectid;
    MalusSelectid = random(5)
    console.log("MalusSelectid = " + MalusSelectid)
    const MalusSelect = malusDB[MalusSelectid]
    console.log("Carte Choisie = " + MalusSelect.nom + " avec pour source : " + MalusSelect.src)
    document.getElementById("cardMalus").src = MalusSelect.src
    look(MalusSelect, "Malus")
    updateScore(MalusSelect.capaType, printCapaChange)
    speak("announcement",`Mince vous avez obtenu le malus "${MalusSelect.nom}", cela vous fait perdre ${printCapaChange} ${printCapaType}`)   
}
