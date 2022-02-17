---
title: Openhoteldag
links: 
    - title: Website
      url: https://openhoteldag.com/
    - title: Jekyll programma template (raw)
      url: /uploads/openhoteldag.txt
    - title: Site javascript
      url: /uploads/ohd-2.js
    - title: Map javascript
      url: /uploads/ohd-1.js
---

Ik werd in de eerste week meteen in het diepe gegooid. Samen met Cris en Thomas van D/DOCK, een design community gelegen in de houthavens is het concept “Openhoteldag” neergezet. 

![](/uploads/openhoteldag-2.png)

### Aanpak

Thomas zorgde ervoor dat data van de hotels verzameld werd, het was aan mij om hier een juist format voor te vinden en er een website van te realiseren. De wens was om alle activiteiten in een soort festivalprogramma te verpakken. Hierin kon je over de gehele dag zien wat er te doen was. Best een uitdaging. 

> Tijdens de nationale Open Hotel Dag kunnen bedrijven en inwoners van de grootste Nederlandse steden bij hotels komen werken, samenwerken, lunchen, sporten, borrelen, zwemmen, en meer. Dit is de uitgelezen kans voor bewoners en bedrijven om kennis te maken met de faciliteiten en gastvrijheid die de hotels in eigen stad te bieden hebben.
> 

### data 
Ik was begonnen met het uitzoeken van welke data we per hotel nodig hadden om dit in elkaar te kunnen zetten. Oorspronkelijk wilde we dit in een excel speadsheet zetten, maar nadat ik alle benodigde data hier in kolommen had neergezet leek dit veel te onoverzichtelijk te worden. Ik heb uiteindelijk gekozen voor een .yml file, zodat ik de data ook kon nesten. Ook kon iemand van D/DOCK dan alle data invullen. 

De schets die ik had binnengekregen zag er zo uit:  

![](/uploads/openhoteldag-1.png)

Dit is een voorbeeld van hoe een input er aan de achterkant uitziet:

```yml
- title: Kimpton De Witt
  image: /uploads/kimpton-de-witt-exterior.jpg
  description_markdown: >-
    **Welkom bij Kimpton De Witt Amsterdam\!**


    Kimpton De Witt is our first European boutique hotel, Kimpton De Witt Hotel,
    which exudes a modern approach to luxury through fresh, refined rooms and
    imaginative spaces steeped in inspired Dutch design. Experience an immersive
    labyrinth of contemporary millwork, lush layers and clean lines. A journey
    where rooms open to grand inspiration and eclectic treasures. Nestled in the
    heart of Amsterdam’s thriving&nbsp;[City
    Centre](https://www.kimptondewitthotel.com/en/city-centre-hotels/), our
    hotel inspires you to imagine, explore, create and find a comfortable place
    to relax. With our unique personality and heartfelt service, consider our
    intimate boutique hotel your personal sanctuary.
  address: Nieuwezijds Voorburgwal 5
  hotel_mailadres: 'press@kimptondewitthotel.com '
  optional_url:
  activities:
    - title: Deep House Yoga
      description_markdown: >-
        Deep House Yoga workout x Blue Birds<br>Kick off your morning with a
        deep house yoga workout provided by Blue Birds and get a surprise goodie
        bag afterwards.
      category: sports_leasure
      from: '08:30'
      to: '09:15'
      cost: '0'
      registration_required: true
      optional_registration_mail: 'press@kimptondewitthotel.com '
      optional_registration_url:
      optional_registration_instructions:
      optional_no_registration_input_markdown:
    - title: 'Driegangen diner bij Celia Amsterdam '
      description_markdown: >-
        Enjoy a delicious Californian inspired 3-course dinner at Celia
        Amsterdam.
      category: food
      from: '17:00'
      to: '22:00'
      cost: 32.5
      registration_required: true
      optional_registration_mail: www.celiaasmterdam.com and leave a note 'Open Hotel Dag'
      optional_registration_url: https://www.celiaamsterdam.com/nl
      optional_registration_instructions: Leave a note "Open Hotel Dag"
      optional_no_registration_input_markdown:

```

Deze datafile is uiteindelijk ~ 2500 regels lang geworden.

### Programma

Na een hoop hoofdpijn en ellende ben is het wel allemaal gelukt. Op [deze link](https://openhoteldag.com/programma) kun je zien hoe het er uitziet. Het moeilijkste was om hier uit te rekenen wanneer er twee activiteitblokken waren die geen overlap hadden, zodat deze op dezelfde row konden te komen staan. Het hele ding is ook responsive, waar op mobile ook de labels van de activiteiten horizontaal meescrollen. 

Er kan ook gefilterd worden, waarna alle blokken met een transition verwijnen. Ik had hier gekozen om de breedtes en posities van de activiteiten static te coderen in Jekyll. Bij de [links bovenin](#top) kun je de jekyll template zien. 

_Desktop versie_
![](/uploads/ohd-3.png)

_Mobiele versie_
![](/uploads/ohd-4.png)

### interactieve kaart

Het project was hier nog niet klaar! Er was ook een interactieve kaart van Amsterdam gewenst waar alle hotels instonden. Gelukkig had ik het themasemester Datavisualisatie gekozen, hier had ik al een ontmoeting met [d3](https://d3js.org/), een framework voor datavisualisaties. 

Ik heb uiteindelijk met een combinatie van d3 en [leaflet](https://leafletjs.com/) deze interactieve kaart in elkaar weten te fietsen. De hotels worden uit de datafile gehaald, hierbij wordt een corresponderende latitude en longitude gezocht in een andere datafile. 

Op basis van deze gegevens krijgt een hotel zo een stip op de kaart, waarop geklikt kan worden om door te linken naar de individuele hotelpagina. Ik heb zelfs als easter egg nog een cloropleth-map gemaakt van de kaart (thanks, dataviz track). Hoe meer bolletjes in een bepaald stadsdeel, hoe meer opacity de buurt heeft op de kaart.

_De interactieve kaart van Openhoteldag, fresh state_
![](/uploads/ohd-5.png)

_Kaart, geklikt op een buurt state_
![](/uploads/ohd-6.png)

Ik raad aan om [zelf even te kijken!](https://openhoteldag.com/hotels#scroll_to_map)