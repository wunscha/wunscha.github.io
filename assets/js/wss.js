import {WebSocketServer} from 'ws';

const PORT = 5000;
const N_SPIELER_MAX = 4;
let arrObjSpieler = [];
let wsMonitor;

const WSS = new WebSocketServer({port: PORT});

WSS.on('start', () => {console.log(`WebsocketServer gestartet. Port Nummer: ${PORT}`)});

WSS.on('connection', (ws) => {
    ws.on('message', msg => {
        let msgData = JSON.parse(msg.toString());
        switch (msgData.ereignis) {
            case 'spielerNeu':
                /** 
                 * Controller speichern, Controller-Id generieren, und zurücksenden/ an Monitor weiterleiten 
                 */
                if (arrObjSpieler.length == N_SPIELER_MAX) {
                    let msgHinweis = {ereignis: 'hinweisServer', text: 'Maximale Spielerzahl erreicht!'};
                    let strMsgHinweis = JOSN.stringify(msgHinweis);
                    ws.send(strMsgHinweis);
                    console.log(msgHinweis.text);
                    break;
                }
                // Controller-ID generieren und zurücksenden/ an Monitor weiterleiten
                let idController = arrObjSpieler.length;
                let objSpielerNeu = {idController: idController};
                Object.assign(objSpielerNeu, msgData);
                let strMsgData = JSON.stringify(objSpielerNeu);
                ws.send(strMsgData);
                wsMonitor.send(strMsgData);
                // Spieler speichern
                objSpielerNeu.ws = ws;
                arrObjSpieler.push(objSpielerNeu);
                break;
            case 'infoSpiel':
                /**
                 * Spielinformationen zurückschicken
                 * Anfrage nach Spielinfo kann nur von Monitor kommen ==> Verbindung wird zu wsMonitor 
                 */
                wsMonitor = ws;
                let msgInfoSpiel = erzeugeMsgInfoSpiel();
                ws.send(msgInfoSpiel);
                break;
            case 'zuruecksetzeSpiel':
                /**
                 * Setzt alle Spieleigenschaften zurück
                 * Sendet infoSpiel zurück (für Update Darstellung)
                 */
                arrObjSpieler = [];
                ws.send(erzeugeMsgInfoSpiel());
                break;
            case 'steuerung':
                /**
                 * Leitet Steuerungs-Event an Monitor weiter
                 */
                wsMonitor.send(JSON.stringify(msgData));
                break;
        }
    })
})

/**
 * Erzeugt stringified Message mit Infos über das Spiel für Update am Monitor
 * @returns {Object} infoSpiel
 */
function erzeugeMsgInfoSpiel() {
    let msgInfoSpiel = {
        ereignis: 'infoSpiel',
        arrSpieler: arrObjSpieler.map(objS => {return {idController: objS.idController, name: objS.name}}),
    };
    return JSON.stringify(msgInfoSpiel);
}

// wsMonitor
// arrWsController

// evt spielerNeu
// evt spielerEntfernen
// evt steuerung
// evt spielerEvt