# Applicazione per il riconoscimento dei dettagli in opere d'arte
L'applicativo consente il riconoscimento di opere d'arte e loro dettagli nelle immagini inquadrate dalla webcam di uno
smartphone in tempo reale mostrando all'utente le informazioni multimediali relative.
Il meccanismo di riconoscimento dei dettagli è implementato in 3 diversi modi:
* Retrieval utilizzando la rete MobileNet v3 Small di Tensorflow.js
* Classificazione sfruttando la rete MobileNet v3 su cui è stato eseguito fine-tuning sul dataset
presente all'indirizzo [https://github.com/EleonoraRistori/SmartLens/tree/master/data](https://github.com/EleonoraRistori/SmartLens/tree/master/data)
* Object Detection utilizzando la rete SSD/MobileNetV3 su cui è stato eseguito fine tuning per il riconoscimento degli
"oggetti" (dettagli) delle opere del dataset precedente.

## Installazione
Per il corretto funzionamento è necessario un database di tipo MySQL che può essere popolato come descritto in 
[https://github.com/EleonoraRistori/SmartLens](https://github.com/EleonoraRistori/SmartLens). Sarà poi necessario
modificare le credenziali utente, password, database e host all'interno del file ./server/config.php 

## Cambiare metodo di riconoscimento dei dettagli
Per scegliere il metodo di riconoscimento adottato dall'applicazione è necessario scommentare uno degli script presenti in fondo 
al file camera-view.html.
* getDetailsObjDet.js per la Object Detection
* getDetailsRetrieval per il Retrieval
* getDetailsClass.js per la Classificazione

La versione con retrieval è fornita in due varianti che adottano una diversa suddivisione delle immagini da cui vengono estratte le features.
La versione può essere cambiata modificando il valore della variabile version all'inizio del file getDetailsRetrieval.js.
* version = 1 : il Retrieval è applicato per ogni fotogramma a 5 immagini: quella intera prelevata dalla webcam e 4 sue parti
ottenute da una suddivisione simmetrica senza sovrapposizione.
* version = 2 : il Retrieval è applicato per ogni fotogramma a 6 immagini: oltre a quella intera vegono generate 5 sue porzioni
di altezza e larghezza pari a 2/3 delle misure dell'immagine originale disposte come in figura

![alt text](https://github.com/EleonoraRistori/SmartLens/blob/master/Suddivisione.png?raw=true)