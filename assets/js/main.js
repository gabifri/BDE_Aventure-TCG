/**Sources
 *SRC0 : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/JSON
 *SRC1 : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
 *SRC2 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises
 *SRC3 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array
 *SRC4 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */

console.log("BDE Adventure - V.0.3")
/*Variables ========================================= */
/* Point de Vie */
let vieJoueur = 100
let vieEnnemi = 100
let lvlSelct = 0;
let events = [];
let tools = [];
let malus = [];
let level = 1;
let time = 0;
let durationTimer = time;
let seconde = 0;
let secondePrint;
let lvlTime;
let lvlCM;
let lvlArgent;
let lvlEnergy;
let chrono;
let win;

const lvlWin = {
    '1' : false,
    '2' : false,
    '3' : false,
    '4' : false,
    '5' : false,
    '6' : false,
    '7' : false,
    '8' : false,
    '9' : false,
    '10' : false,
    '11' : false
}

/*Attaque*/
const degatsAttaque = {
    'attaque1': 10,
    'attaque2' : 20,
    'attaque3' : 30,
    'attaque4' : 40
}

/*Algo ============================================= */
function importJSON(val, JSON){
    console.log(`Import Start from "assets/js/data/${JSON}.json" to ${JSON}`)
    fetch(`assets/js/data/${JSON}.json`) // On va chercher le fichier JSON [SRC1]
        .then(reponse => reponse.json()) // then = ensuite (on recupére le texte brut du JSON) On convertit le fichier en JS [SRC2]
        .then(data => { //[SRC2]
            val.push(...data); // On incorpore le JSON dans la variable Event les "..." permette de vider Data dans la variable choisi [SRC4]
            ActuLevel(1);  // On lance le niveau 1 direct
        });
}

function ActuLevel(levelSelect) {
    if (events.length === 0) return; //Sécurité au cas ou le JSON charge pas
    level = levelSelect; //On initialise le niveau
    const carte = events[levelSelect - 1]; //Le tableau Event remplit plus tot avec le info du JSON, commence à 0 (donc ID 0 = LV 1) [SRC3]
    document.getElementById('event').src = carte.src;
    time = carte.Temps;
    lvlTime = time;
    speak("level",carte.nom)
    speak("CM",carte.CM)
    speak("argent",carte.Argent)
    speak("energy",carte.Energy)
    timer()
    gameWin()
}

function lvlPlus(win){
    lvlSelct = lvlSelct + 1;
    if(win==true){
        lvlWin[lvlSelct] = true
    } else (
        lvlWin[lvlSelct] = false
    )
    ActuLevel(lvlSelct)
}

function timer(){
    if(chrono !== null){
        clearInterval(chrono);
    }
    seconde = 0; 
    chrono = setInterval(() => {
        printTimer();
        
        if(seconde > 0){
            seconde--;
        } else {
            if(time > 0){
                time--;
                seconde = 59;
            } else {
                lvlWinDetect(false);
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

/** Fonction de démarrage du Gameplay */
function speak(cible, message){
    document.getElementById(cible).textContent = message
}

function demarrageJeu(){
    importJSON(events,"event")
    importJSON(tools,"tools")
    importJSON(malus,"malus")
    document.getElementById('popupIntro').style.display = "none";
    ActuLevel(1)
    speak("announcement", "Un Enemie Approche")
    setTimeout(() => { 
        speak("announcement", "Choisissez votre attaque !")
    }, 3000);
}

/* -------------------------- Tours de jeu -------------------------- */

/* Mise à jour des points de vie */
function updateScore(personnage, degats) {
    let totalVie = personnage === 'player' ? vieJoueur -= degats : vieEnnemi -= degats;
    
    //Update graphique de la barre de vie
    let barreVieUpdate = document.getElementById(personnage === 'player' ? 'joueurBarreVieRemplissage' : 'ennemiBarreVieRemplissage');
    let pourcentageVie = (totalVie / 100) * 100;
    barreVieUpdate.style.width = pourcentageVie + '%';
    barreVieUpdate.style.backgroundColor = pourcentageVie <= 10 ? 'red' : pourcentageVie <= 20 ? 'yellow' : 'green';
}

/* Fonction d'attaque du joueur */
function attaqueJoueur(attackType) {
    let degats = degatsAttaque[attackType];
    updateScore('enemy', degats);
    speak("announcement", `L'attaque choisie cause ${degats} de dégâts à l'adversaire !`);
    if (vieEnnemi <= 0) {conclusionVictoire(true)}
    else {setTimeout(attaqueEnnemi, 3000);}
}

/* Fonction d'attaque de l'ennemi */
function attaqueEnnemi() {
    let attackTypes = Object.keys(degatsAttaque); //On transforme l'objet en tableau plus synthétique
    let attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)]; //On tire au sort dans le tableau
    let degats = degatsAttaque[attackType]; //On récupère sa valeur dans l'objet
    updateScore('player', degats);
    speak("announcement", `L'attaque ennemie vous inflige ${degats} de dégâts.`);
    if (vieJoueur <= 0) conclusionVictoire(false);
}

function popup(cible, action, message, texteBtn){
    if(action==true){
        document.getElementById(cible).classList.remove("hide");
        speak("popupMsg", message)
        speak("btn", texteBtn)
    }
    if(action==false){
        document.getElementById(cible).classList.add("hide");
    }
}

function gameWin(){
    if(lvlWin["1"] == true && lvlWin["2"]  == true && lvlWin["3"]  == true && lvlWin["4"]  == true && lvlWin["5"]  == true && lvlWin["6"]  == true && lvlWin["7"]  == true && lvlWin["8"]  == true && lvlWin["9"]  == true && lvlWin["10"]  == true && lvlWin["11"]  == true){
        console.log("Game Win")
        popup(true, "Vous avez réussie ! Le BDE a fait tout ses événement Félicitation !")
    }
}

function lvlWinDetect(win) {
    clearInterval(chrono);
    if (win==true) {
        popup("popupIntro", true, "Vous avez réussie ! Le BDE a fait tout ses événement Félicitation !","Recommencer")
    } else {
        popup("popupIntro", true, "Mince, Une prochaine fois", "Recommencer")
    }
    document.getElementById("btn").onclick.
    gameWin()
}