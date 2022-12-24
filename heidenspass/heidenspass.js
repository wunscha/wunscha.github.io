const V_CHARAKTER = 500;
const A_GRAVITATION = 500;
const DAEMPFUNG_DREHUNG = 100;

const Heidenspass = {
    // Scene
    bezeichnungSceneSpiel: 'heidenspass',
    // Titelgrafik
    titelgrafik: {
        w: 695,
        h: 200,
        pfad: './heidenspass/titelgrafik.png',
    },
};

// Boden
function erzeugeBoden(optionen) {
    let componentString = '2D, Canvas, Color, Boden, Collision';
    if (optionen.istWiese) {componentString += ', Wiese'};
    return Crafty.e(componentString)
        .attr({
            w: optionen.w, 
            h: optionen.h || optionen.istWiese ? MONITOR.h * 5 : 300, 
            x:optionen.x , 
            y: optionen.y, 
            z: optionen.istWiese ? 2 : 1,
            rotation: optionen.rotation
        })
        .color(optionen.istWiese ? 'green' : 'brown')
        .checkHits('Charakter')
        .bind('HitOn', (arrHitData) => {
            hitData = arrHitData[0];
            let charakter = hitData.obj;
            charakter.flugphase = false;
            charakter.ay = 0;
            charakter.y -= Math.abs(hitData.ny * hitData.overlap);
            charakter.vx = Math.cos(optionen.rotation * (Math.PI / 180)) * charakter.v;
            charakter.vy = Math.sin(optionen.rotation * (Math.PI / 180)) * charakter.v;
        })
        .bind('HitOff', () => {
            charakter.ay = A_GRAVITATION;
            charakter.flugphase = true;
        }) 
}

Crafty.scene(Heidenspass.bezeichnungSceneSpiel, function() {
    // Hintergrund
    Crafty.e('2D, Canvas, Color')
        .attr({x: MONITOR.w / 2 * (-1), y: MONITOR.h * (-1), w: 9000 + MONITOR.w, h: MONITOR.h * 7, z: -1})
        .color('blue')
    
    // Charakter
    charakter = Crafty.e('2D, Canvas, Motion, Color, Collision, Image, Charakter')
        .attr({w:88, h:264})
        .image('./heidenspass/christian_stick_88_264.png')
        .origin('center')
        .bind('steuerung', function(evt) {
            if (this.flugphase) {
                switch (evt.type) {
                    case 'deviceorientation':
                        this.rotation = (evt.alpha - ALPHA_INIT) * DAEMPFUNG_DREHUNG * (-1);
                }
            }
        })
    charakter.sprungzahl = 0
    // Trefferfläche oben
    charakter.attach(
        Crafty.e('2D, Canvas, Collision')
            .attr({
                x: charakter.x,
                y: charakter.y,
                w: charakter.w,
                h: charakter.h / 2,
            })
            .checkHits('Wiese')
            .bind('HitOn', function() {
                punktestand -= 2;
                if (++charakter.sprungzahl > 5) {setTimeout(() => {Crafty.scene('endbildschirm');}, 1000)};
                console.log('Bruchlandung! Punktestand:', punktestand);
            })
    )
    // Trefferfläche unten
    charakter.attach(
        Crafty.e('2D, Canvas, Collision')
            .attr({
                x: charakter.x,
                y: charakter.y + charakter.h / 2,
                w: charakter.w,
                h: charakter.h / 2,
            })
            .checkHits('Wiese')
            .bind('HitOn', function() {
                punktestand += 2;
                if (++charakter.sprungzahl > 5) {setTimeout(() => {Crafty.scene('endbildschirm');}, 1000)};
                console.log('Gute Landung! Punktestand:', punktestand);
            })
    )
    
    charakter.v = V_CHARAKTER;
    charakter.ay = A_GRAVITATION;

    Crafty.viewport.follow(charakter);
    Crafty.viewport.clampToEntities = false;
    
    // Boden
    let wiese1 = erzeugeBoden({istWiese: true, w: 9000, x: 0, y: MONITOR.h / 2, rotation: 20,});
    erzeugeBoden({istWiese: false, w: 100, x: 400, y: 40 + wiese1.y + Math.tan(wiese1.rotation * Math.PI / 180) * 400, rotation: -30});
    erzeugeBoden({istWiese: false, w: 100, x: 2000, y: 40 + wiese1.y + Math.tan(wiese1.rotation * Math.PI / 180) * 2000, rotation: -50});
    erzeugeBoden({istWiese: false, w: 100, x: 4000, y: 40 + wiese1.y + Math.tan(wiese1.rotation * Math.PI / 180) * 4000, rotation: -40});
    erzeugeBoden({istWiese: false, w: 100, x: 6000, y: 40 + wiese1.y + Math.tan(wiese1.rotation * Math.PI / 180) * 6000, rotation: -35});
    erzeugeBoden({istWiese: false, w: 100, x: 8000, y: 40 + wiese1.y + Math.tan(wiese1.rotation * Math.PI / 180) * 8000, rotation: -10});

});