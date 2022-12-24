const HINTERGRUND_JM = {w: 4800, h: 3600, pfad: './jaegermeister/HINTERGRUND.jpg'};
const FADENKREUZ = {w: 300, h: 300, pfad: './jaegermeister/fadenkreuz_300.png'};
    
const Jaegermeister = {
    // Scene
    bezeichnungSceneSpiel: 'jaegermeister',
    // Titelgrafik
    titelgrafik: {
        w: 695,
        h: 200,
        pfad: './jaegermeister/titelgrafik.png',
    },
};

// Component Ziel
const VOGEL_1 = {w: 306, h: 312, pfad: './jaegermeister/vogel_1.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: MONITOR.h / 2 + Math.random() * HINTERGRUND_JM.h * 0.3, tot: {w: 306, h: 312, pfad: './jaegermeister/vogel_tot.png'}};
const VOGEL_2 = {w: 306, h: 312, pfad: './jaegermeister/vogel_2.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: MONITOR.h / 2 + Math.random() * HINTERGRUND_JM.h * 0.3, tot: {w: 306, h: 312, pfad: './jaegermeister/vogel_tot.png'}};
const VOGEL_3 = {w: 526, h: 578, pfad: './jaegermeister/vogel_3.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: MONITOR.h / 2 + Math.random() * HINTERGRUND_JM.h * 0.3, tot: {w: 306, h: 312, pfad: './jaegermeister/vogel_tot.png'}};
const VOGEL_4 = {w: 526, h: 578, pfad: './jaegermeister/vogel_4.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: MONITOR.h / 2 + Math.random() * HINTERGRUND_JM.h * 0.3, tot: {w: 306, h: 312, pfad: './jaegermeister/vogel_tot.png'}};
const VOGEL_5 = {w: 526, h: 578, pfad: './jaegermeister/vogel_5.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: MONITOR.h / 2 + Math.random() * HINTERGRUND_JM.h * 0.3, tot: {w: 306, h: 312, pfad: './jaegermeister/vogel_tot.png'}};

const HASE_1 = {w: 175, h: 200, pfad: './jaegermeister/hase_1.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: HINTERGRUND_JM.h - MONITOR.h / 2 - Math.random() * HINTERGRUND_JM.h * 0.1, tot: {w: 175, h: 200, pfad: './jaegermeister/hase_tot.png'}};
const HASE_2 = {w: 175, h: 200, pfad: './jaegermeister/hase_2.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: HINTERGRUND_JM.h - MONITOR.h / 2 - Math.random() * HINTERGRUND_JM.h * 0.1, tot: {w: 175, h: 200, pfad: './jaegermeister/hase_tot.png'}};
const HASE_3 = {w: 175, h: 200, pfad: './jaegermeister/hase_3.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: HINTERGRUND_JM.h - MONITOR.h / 2 - Math.random() * HINTERGRUND_JM.h * 0.1, tot: {w: 175, h: 200, pfad: './jaegermeister/hase_tot.png'}};
const HASE_4 = {w: 175, h: 200, pfad: './jaegermeister/hase_4.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: HINTERGRUND_JM.h - MONITOR.h / 2 - Math.random() * HINTERGRUND_JM.h * 0.1, tot: {w: 175, h: 200, pfad: './jaegermeister/hase_tot.png'}};
const HASE_5 = {w: 175, h: 200, pfad: './jaegermeister/hase_5.png', x: MONITOR.w / 2 + Math.random() * (HINTERGRUND_JM.w - MONITOR.w), y: HINTERGRUND_JM.h - MONITOR.h / 2 - Math.random() * HINTERGRUND_JM.h * 0.1, tot: {w: 175, h: 200, pfad: './jaegermeister/hase_tot.png'}};

function erzeugeVogel(VOGEL) {
    let vogel = Crafty.e('2D, Canvas, Collision, Motion, Image, Ziel, Color')
        .attr({
            x: VOGEL.x,
            y: VOGEL.y,
            z: 0,
        }) // Zufällige Anordnung in oberem Bildschirmbereich
        .origin('bottom center')
        
        // Zufällig gewählte Darstellung
        // let richtung = Math.random() > 0.5 ? 'rechts' : 'links';
        vogel.image(VOGEL.pfad);
        vogel.h = VOGEL.h;
        vogel.w = VOGEL.w;
    // Getroffen Funktion
    vogel.getroffen = function() {
        punktestand += 1;
        this.istTot = true;
        this.rotation = 50;
        this.h = VOGEL.tot.h;
        this.w = VOGEL.tot.w;
        this.image(VOGEL.tot.pfad);
        this.ay = 3000;
    }
}    


// Scene Spiel
Crafty.scene(Jaegermeister.bezeichnungSceneSpiel, function() {
    // HINTERGRUND_JM
    Crafty.e('2D, Canvas, Image')
        .attr({w: HINTERGRUND_JM.w, h: HINTERGRUND_JM.h, z: -1})
        .image(HINTERGRUND_JM.pfad);
    Crafty.viewport.bounds = {min:{x:0, y: 0}, max:{x: HINTERGRUND_JM.w, y: HINTERGRUND_JM.h}};
    
    // Zielpunkt (Charakter)
    const DAEMPFUNG_STEUERUNG = 10;
    charakter = Crafty.e('2D, Canvas, Motion, Zielpunkt, Collision')
        .attr({x: HINTERGRUND_JM.w / 2, y: HINTERGRUND_JM.h / 2, w: 1, h: 1})
        .bind('steuerung', function(evt) {
            // Steuerung Bewegung
            if (evt.type == 'deviceorientation') {
                if (winkelInitialisiert) {
                    // Grenze Horizontal
                    this.x += (evt.gamma - GAMMA_INIT) * DAEMPFUNG_STEUERUNG;
                    if (this.x > HINTERGRUND_JM.w - MONITOR.w / 2) {
                        this.x = HINTERGRUND_JM.w - MONITOR.w / 2;
                    }
                    if (this.x < MONITOR.w / 2) {
                        this.x = MONITOR.w / 2;
                    }
                    // Grenze Vertikal
                    this.y += (evt.beta - BETA_INIT) * DAEMPFUNG_STEUERUNG;
                    if (this.y > HINTERGRUND_JM.h - MONITOR.h / 2) {
                        this.y = HINTERGRUND_JM.h - MONITOR.h / 2;
                    }
                    if (this.y < MONITOR.h / 2) {
                        this.y = MONITOR.h / 2;
                    }
                }
            }
            // Steuerung Schuss
            if (evt.type == 'touchstart') {
                if (manfredIstImBild) {
                    manfred.getroffen();
                } else {
                    let arrHitData = this.hit('Ziel');
                    let ziel = arrHitData ? arrHitData[0].obj : undefined;
                    if (ziel) ziel.getroffen();
                }
            }
        })
    Crafty.viewport.follow(charakter);
    
    // Fadenkreuz
    const fadenkreuz = Crafty.e('2D, Canvas, Image')
        .attr({
            w: FADENKREUZ.w, 
            h: FADENKREUZ.h, 
            x: charakter.x - (FADENKREUZ.w / 2), 
            y: charakter.y - (FADENKREUZ.h / 2),
            z: 4
        })
        .image(FADENKREUZ.pfad);
    charakter.attach(fadenkreuz);
    
    // Ziel
    erzeugeVogel(VOGEL_1);
    erzeugeVogel(VOGEL_2);
    erzeugeVogel(VOGEL_3);
    erzeugeVogel(VOGEL_4);
    erzeugeVogel(VOGEL_5);
    erzeugeVogel(HASE_1);
    erzeugeVogel(HASE_2);
    erzeugeVogel(HASE_3);
    erzeugeVogel(HASE_4);
    erzeugeVogel(HASE_5);

    // Manfred
    let manfredIstImBild;
    const MANFRED = {
        w: 260, 
        h: 343, 
        pfad: './jaegermeister/manfred.png',
        pfad_getroffen: './jaegermeister/manfred_getroffen.png',
    };
    let manfred = Crafty.e('2D, Canvas, Image, Motion')
        .attr({
            w: MANFRED.w,
            h: MANFRED.h,
            x: charakter.x - (MANFRED.w / 2),
            y: charakter.y + MONITOR.h,
            z: 5,
        })
        .origin('center')
        .bind('UpdateFrame', function() {
            // In Bildmitte umdrehen
            if (this.y < (charakter.y - 100)) {
                this.vy = 0;
                this.ay = 2000;
            }
            // manfred ist im Bild setzen
            if (!manfredIstImBild && this.y < (charakter.y + 100)) {
                manfredIstImBild = true;
                console.log('Manfred ist im Bild');
            }
            if (manfredIstImBild && this.y > (charakter.y + 100)) {
                manfredIstImBild = false;
                console.log('Manfred ist nicht mehr im Bild');
            }
            // Außerhalb von Bild stehenbleiben
            if (this.y > charakter.y + MONITOR.h / 2 && this.vy > 0) {
                this.vy = 0;
                this.ay = 0;
                console.log('Manfred bleibt stehen');
            }
        })
    charakter.attach(manfred);
    
    manfred.erscheine = function() {
        console.log('Manfred erscheint')
        manfred.image(MANFRED.pfad);
        manfred.ay = -1000;
    }
    manfred.getroffen = function() {
        // Punkte abziehen
        punktestand -= 1;
        console.log('Manfred getroffen! Neuer Punktestand:', punktestand);
        // Bild anpassen
        manfred.image(MANFRED.pfad_getroffen);
        // Manfred abstürzen lassen
        manfred.vy = 0;
        manfred.ay = 1000;
    };
    setTimeout(manfred.erscheine, 5000);
    setTimeout(manfred.erscheine, 10000);
    setTimeout(manfred.erscheine, 15000);
    setTimeout(manfred.erscheine, 20000);
    setTimeout(manfred.erscheine, 25000);

    // Endkriterium
    setTimeout(() => {Crafty.scene('endbildschirm')}, 1);
})