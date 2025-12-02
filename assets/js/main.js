/**Sources
 *SRC0 : https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/JSON
 *SRC1 : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
 *SRC2 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises
 *SRC3 : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array
 */

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

/*Attaque*/
const degatsAttaque = {
    'attaque1': 10,
    'attaque2' : 20,
    'attaque3' : 30,
    'attaque4' : 40
}

/*Algo ============================================= */
function importJSON(val, JSON){
    console.log(`Import Start from "assets/js/data/${JSON}.json" to ${val}`)
    fetch(`assets/js/data/${JSON}.json`) // On va chercher le fichier JSON [SRC1]
        .then(reponse => reponse.json()) // then = ensuite (on recupére le texte brut du JSON) On convertit le fichier en JS [SRC2]
        .then(data => { //[SRC2]
            val = data; // On incorpore le JSON dans la variable Event 
            ActuLevel(1);  // On lance le niveau 1 direct
        });
        if (val.length === 0){
            console.log("Import Fail")
        } else{
            console.log("Import Succes")
        }
}

function ActuLevel(levelSelect) {
    if (events.length === 0) return; //Sécurité au cas ou le JSON charge pas
    level = levelSelect; //On initialise le niveau
    const carte = events[levelSelect - 1]; //Le tableau Event remplit plus tot avec le info du JSON, commence à 0 (donc ID 0 = LV 1) [SRC3]
    document.getElementById('event').src = carte.src;
    time = carte.Temps;
    speak("level",carte.nom)
    printTimer()
}

function lvlPlus(){
    lvlSelct = lvlSelct + 1;
    ActuLevel(lvlSelct)
}

function timer(){
    setInterval(() => {
        printTimer()
        if(seconde > 0){
            seconde--
        } else{
            if(time>0){
                time--
                seconde = 59;
            } else{
                conclusionVictoire(false)
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
    timer(level)
    speak("announcement", "Un Enemie Approche")
    setTimeout(() => { // C'est une fonction fléchée, une fonction qui ne marche que dans ce cas précis
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