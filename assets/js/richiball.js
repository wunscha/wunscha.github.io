const PFAD_IMG = './assets/img/';
const HINTERGRUND = {w: 10000, h: 10000, pfad: './assets/img/papier_zerknittert_orig.png'};
const SPIELER = {w: 41, h: 81};
const BTN_SPIELBEGINN = {w: 186, h: 91, pfad: './assets/img/btn_spielbeginn.png'};
const BTN_RUNDENSTART = {w: 186, h: 91, pfad: './assets/img/btn_rundenstart.png'};
const SPIELER_TOT = {pfad: './assets/img/spieler_tot.png'}
const COUNTDOWN = {
    intervall: 100, 
    font: {family: 'Courier', size: '72px', weigth: 'bold'},
};
const TXT_RUNDENENDE = {
    font: {family: 'Courier', size: '50px', weight: 'bold'},
}
const KOLLISIONSKREIS = {w: 61, h: 120, pfad: './assets/img/kollisionskreis.png'};
const ABSTAND_RAND = 50;
const WAND = {h: 30, w: 30, nMax: 10, pfad: './assets/img/wand.png'};
let IGNORIERE_MOVE // Bollean um Move-Listener auszusetzen

// erzeugeEntityWand
function erzeugeEntityWand(attr) {
    let attrWand = attr || {
        x: Math.random() * HINTERGRUND.w,
        y: Math.random() * HINTERGRUND.h,
        z: 2,
        h: WAND.h,
        w: Math.round(Math.random() * WAND.nMax) * WAND.w,
        rotation: Math.random() * 360,
    }
    
    let wand = Crafty.e('2D, Canvas, Collision, Wand, Color')
        .attr(attrWand)
        .color('grey')
        .checkHits('Spieler')
        .bind('HitOn', function(arrHitData) {
            let hitData = arrHitData[0];
            if (hitData.type === 'SAT') { // SAT, advanced collision resolution
                console.log('hitData:', hitData);
                // move player back by amount of overlap
                hitData.obj.vx = (-1) * hitData.nx * 2000;
                hitData.obj.vy = (-1) * hitData.ny * 2000;
                //setTimeout(function() {hitData.obj.ax = 0; hitData.obj.ay = 0;}, 1000)
            }
        })

    return wand;
}



// erzeugeEntityAbgrund
// erzeugeEntitySchlammfeld
// erzeugeEntityTurbofeld
// erzeugeEntityBumper


// erzeugeEntityKollisionskreis
function erzeugeEntityKollisionskreis() {
    let kollisionskreis = Crafty.e('2D, Canvas, Image');
    kollisionskreis.attr({w: KOLLISIONSKREIS.w, h: KOLLISIONSKREIS.h, z: 1});
    kollisionskreis.image(KOLLISIONSKREIS.pfad);
    return kollisionskreis;
}

// erzeugeEntitySpieler
function erzeugeEntitySpieler() {
    let spieler = Crafty.e('2D, Canvas, Spieler, Motion, Image, Collision, Color');
    spieler.attr({w: SPIELER.w, h: SPIELER.h, z: 0});
    // Bild wird in scene 'runde' erstellt
    //spieler.color('red');

    // Defaults
    spieler.v = 500;
    spieler.vx = 0;
    spieler.vy = 0;
    spieler.korrekturfaktorRotation = 5;
    spieler.korrekturfaktorV = 1;
    spieler.origin('center')

    // Spieler: Steuerung
    spieler.bind('steuerung', function(evt) {
        if (this.steuerungBlockiert === true) {return;}
        if (this.tot === true) {return;}
        switch (evt.type) {
            case 'deviceorientation':
                this.rotation = evt.gamma * this.korrekturfaktorRotation;
                this.berechneVxVy();
                break;
            case 'touchstart':
            case 'mousedown':
                if (evt.target.id == 'actionbutton-links' || evt.target.id == 'actionbutton-rechts') {
                    this.faehrt = true;
                    this.berechneVxVy();
                }
                break;
            case 'touchend':
            case 'mouseup':
                if (evt.target.id == 'actionbutton-links' || evt.target.id == 'actionbutton-rechts') {
                    this.faehrt = false;
                    this.berechneVxVy();
                }
                break;
        }
    })

    spieler.bind('Move', function(evt) {
        if (IGNORIERE_MOVE) {return;}
        if (this.istIdk) {
            // Viewport mitziehen (x/y-Koordinaten von viewport haben negative Vorzeichen)
            let xMax = ((-1) * Crafty.viewport.x + Crafty.viewport.width) - (ABSTAND_RAND + SPIELER.w);
            let xMin = (-1) * Crafty.viewport.x + ABSTAND_RAND;
            let yMax = ((-1) * Crafty.viewport.y + Crafty.viewport.height) - (ABSTAND_RAND + 2 * SPIELER.h);
            let yMin = (-1) * Crafty.viewport.y + ABSTAND_RAND;
            if (this.x > xMax) {
                Crafty.viewport.x -= this.x - xMax;
            } else if (this.x < xMin) {
                Crafty.viewport.x -= this.x - xMin;
            }
            if (this.y > yMax) {
                Crafty.viewport.y -= this.y - yMax;
            } else if (this.y < yMin) {
                Crafty.viewport.y -= this.y - yMin;
            }
            // Hinausgefallene Spieler kontrollieren
            for (let sp of Object.values(MAP_SPIELER)) {
                if (!sp.entity) {continue;}
                if (!sp.entity.fnIstImViewport()) {sp.entity.stirb();}
                // // if (sp.entity.istIdk) {continue;}
                // let xMaxSp = ((-1) * Crafty.viewport.x + Crafty.viewport.width) - SPIELER.w;
                // let xMinSp = (-1) * Crafty.viewport.x;
                // let yMaxSp = ((-1) * Crafty.viewport.y + Crafty.viewport.height) - SPIELER.h;
                // let yMinSp = (-1) * Crafty.viewport.y;

                // if (
                //     sp.entity.x > xMaxSp ||
                //     sp.entity.x < xMinSp ||
                //     sp.entity.y > yMaxSp ||
                //     sp.entity.y < yMinSp
                // ) {sp.entity.stirb();} 
            }
        } else {
            if (!this.fnIstImViewport()) {this.stirb();}
        }

        // Berühre Spieler
        if ((arrHitData = this.hit('Spieler'))) {
            let spielerGetroffen = arrHitData[0].obj;
            if (spielerGetroffen.istIdk) {
                this.werdeIdk();
                spielerGetroffen.stirb();
            }
        }

    })

    /**
     * Berechnet Bewegungsgeschwindigkeiten
     */
    spieler.berechneVxVy = function() {
        if (this.faehrt) {
            this.vx = this.v * Math.sin(this.rotation * (Math.PI / 180)) * this.korrekturfaktorV;
            this.vy = (-1) * this.v * Math.cos(this.rotation * (Math.PI / 180)) * this.korrekturfaktorV;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    }

    /**
     * Macht Spieler zum IdK
     */
    spieler.werdeIdk = function() {
        // Kollisionskreis vorest nicht darstellen (einfacher zu entwickeln, lustiger zu spielen wegen verwirrung)
        // KOLLISIONSKREIS.rotation = this.rotation;
        // KOLLISIONSKREIS.entity.x = this.x;
        // KOLLISIONSKREIS.entity.y = this.y;
        // this.attach(KOLLISIONSKREIS.entity);
        for (let sp of Object.values(MAP_SPIELER)) {
            if (sp.entity) {sp.entity.istIdk = false;}
        }
        this.istIdk = true;
        aktualisiereHud();
    }

    /**
     * Prüft ob Spieler noch im Viewport
     */
    spieler.fnIstImViewport = function() {
        let xMaxSp = ((-1) * Crafty.viewport.x + Crafty.viewport.width) - SPIELER.w;
        let xMinSp = (-1) * Crafty.viewport.x;
        let yMaxSp = ((-1) * Crafty.viewport.y + Crafty.viewport.height) - SPIELER.h;
        let yMinSp = (-1) * Crafty.viewport.y;

        if (
            this.x > xMaxSp ||
            this.x < xMinSp ||
            this.y > yMaxSp ||
            this.y < yMinSp
        ) {return false}
        
        return true
    }

    /**
     * Tötet Spieler und ermittelt Rundensieger
     */
    spieler.stirb = function() {
        if (this.tot) {return;}
        this.ignoreHits('Spieler');
        this.tot = true;
        this.w = SPIELER_TOT.w;
        this.h = SPIELER_TOT.h;
        this.destroy();
        aktualisiereHud();
        ermittleRundensieger();
    }

    return spieler;
}
// erzeugeEntityWand
// etc...



// Scene spielbeginn
Crafty.scene('spielbeginn', function() {
    // Hintergrund
    HINTERGRUND.entity = Crafty.e('2D, Canvas, Image, Persist')
        .attr({x: 0, y: 0, z: -999, w: HINTERGRUND.w, h: HINTERGRUND.h})
        .image(HINTERGRUND.pfad, 'repeat');
    // Startpunkt IDK
    STARTPUNKT_IDK.entity = Crafty.e('2D, Canvas, Persist')
        .attr({x: STARTPUNKT_IDK.x, y: STARTPUNKT_IDK.y});
    // Startbutton
    Crafty.e('2D, Canvas, Image, Mouse')
        .attr({
            x: MONITOR.w / 2 - BTN_SPIELBEGINN.w / 2,
            y: MONITOR.h / 2 - BTN_SPIELBEGINN.h / 2,
            w: BTN_SPIELBEGINN.w,
            h: BTN_SPIELBEGINN.h,
        })
        .image(BTN_SPIELBEGINN.pfad)
        .bind('Click', function() {
            Crafty.scene('rundenstart');
        })
})

// Scene rundenstart
Crafty.scene('rundenstart', function() {
    RUNDENZAEHLER++;
    aktualisiereHud();
    
    let countdownzaehler = Crafty.e('2D, Canvas, Text');
    countdownzaehler.textFont(COUNTDOWN.font);
    countdownzaehler.attr({
        x: MONITOR.w / 2,
        y: MONITOR.h / 2, 
    });
    // Countdown runterzählen
    countdownzaehler.text('3');
    setTimeout(() => {countdownzaehler.text('2');}, COUNTDOWN.intervall);
    setTimeout(() => {countdownzaehler.text('1');}, 2 * COUNTDOWN.intervall);
    setTimeout(() => {Crafty.scene('runde');}, 3 * COUNTDOWN.intervall);
})

// Scene runde
Crafty.scene('runde', function() {
    // Spielefeld
    let wandOben = {x: 0, y:0, w: HINTERGRUND.w, h: WAND.h};
    erzeugeEntityWand(wandOben);
    let wandUnten = {x: 0, y: HINTERGRUND.h - WAND.h, w: HINTERGRUND.w, h: WAND.h};
    erzeugeEntityWand(wandUnten);
    let wandLinks = {x: 0, y: 0, w: WAND.h, h: HINTERGRUND.h};
    erzeugeEntityWand(wandLinks);
    let wandRechts = {x: HINTERGRUND.w - WAND.w, y: 0, w: WAND.h, h: HINTERGRUND.h};
    erzeugeEntityWand(wandRechts);
    
    for (let i = 0; i < 1000; i++) {
        erzeugeEntityWand();
    }

    // Spieler
    let arrSpieler = Object.values(MAP_SPIELER);
    for (let sp of arrSpieler) {
        // Spielerzustand zurücksetzen
        sp.tot = false;
        // Entitys erzeugen
        sp.entity = erzeugeEntitySpieler();
        IGNORIERE_MOVE = true;
        sp.entity.x = STARTPUNKT_SPIELER.x;
        sp.entity.y = STARTPUNKT_SPIELER.y;
        sp.entity.image(PFAD_IMG + sp.bild);
        // Gespeicherte Attribute übertragen
    }
    aktualisiereHud();
    KOLLISIONSKREIS.entity = erzeugeEntityKollisionskreis();
    ermittleIdkRundenstart();
    IGNORIERE_MOVE = false;

    // Auf Startpunkt zoomen
    Crafty.viewport.x = (-1) * (STARTPUNKT_IDK.x + SPIELER.w / 2 - MONITOR.w / 2);
    Crafty.viewport.y = (-1) * (STARTPUNKT_IDK.y + SPIELER.h / 2 - MONITOR.h / 2);
})

// Scene rundenende
Crafty.scene('rundenende', function() {
    aktualisiereHud();
    // Anzeige Sieger
    let txt = Crafty.e('2D, Canvas, Text')
        .text(`Rundensieger:${RUNDENSIEGER.name}`)
        .textFont(TXT_RUNDENENDE.font)
    txt.x = (-1) * Crafty.viewport.x + MONITOR.w / 2 - txt.w / 2,
    txt.y = (-1) * Crafty.viewport.y + MONITOR.h / 2 - txt.h / 2,
    // Startbutton
    Crafty.e('2D, Canvas, Image, Mouse')
        .attr({
            x: MONITOR.w / 2 - BTN_RUNDENSTART.w / 2,
            y: MONITOR.h / 2 + txt.h / 2 + 30,
            w: BTN_RUNDENSTART.w,
            h: BTN_RUNDENSTART.h,
        })
        .image(BTN_RUNDENSTART.pfad)
        .bind('Click', function() {
            Crafty.scene('rundenstart');
        })
})

/**
 * Mach Spieler mit der geringsten Punktezahl (wenn mehrere: zufällige Auswahl) zum IdK;
 * @returns 
 */
function ermittleIdkRundenstart() {
    let arrSpieler = Object.values(MAP_SPIELER);
    // hole niedrigste Punktezahl
    let punkteMin;
    for (let sp of arrSpieler) {
        if (!punkteMin || sp.punkte < punkteMin) {
            punkteMin = sp.punkte;
        }
    }
    // hole Spieler mit niedrigster Punktezahl
    let arrVerlierer = arrSpieler.filter(sp => sp.punkte == punkteMin);
    // Wähle zufällig aus
    let index = Math.round(Math.random() * (arrVerlierer.length - 1));
    let idkNeu = arrSpieler[index];
    idkNeu.entity.werdeIdk();
    idkNeu.entity.x = STARTPUNKT_IDK.x;
    idkNeu.entity.y = STARTPUNKT_IDK.y;
}

/**
 * Ermittelt Rundensieger und startet neue Runde, wenn Sieger vorhanden
 */
function ermittleRundensieger() {
    // Prüfe ob nur 1 Überlebender vorhanden
    let arrUeberlebende = Object.values(MAP_SPIELER).filter(sp => !sp.entity.tot);
    if (arrUeberlebende.length == 1) {
        RUNDENSIEGER = arrUeberlebende[0];
        RUNDENSIEGER.punkte++;
        Crafty.scene('rundenende');
    }
}

// Scene rundenende
