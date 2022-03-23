---
title: Basecamp festival
order: 3
links:
  - title: Website
    url: https://basecampfestival.nl/
  - title: Aangeleverd design
    url: uploads/basecamp-1.pdf
---

Een festival voor de re-generation. In samenwerking met [Nachtlab Agency](https://www.nachtlabagency.com/) hebben we deze unieke custom website opgezet. Ik was in direct contact met designer Victor. Nachtlab is ook onderdeel van D/DOCK en zij werken vaak in DB55. 

![](uploads/basecamp-1.png)

### Concept &nbsp;

Victor kwam echt met een klapper van een design aanzetten. Aanvankelijk stonden alleen de homepagina en de muziekpagina uitgewerkt om te developen, gaanderweg zijn er telkens designs bijgekomen. Victor had een unieke circulaire navigatie bedacht, iets wat je niet vaak ziet. Het was aan mij om te zorgen dat dit er goed uitzag en lekker werkte. 

Op de [muziekpagina](https://basecampfestival.nl/music/) en [aboutpagina](https://basecampfestival.nl/about/) zijn uiteindelijk ook CSS flip-cards gekomen. Verder had Victor point-gradient achtergrond en 3d modellen ontworpen. 

>
Wij vieren het leven graag uitbundig op Basecamp Festival. Mét respect voor onze omgeving, elkaar, én met een netto positief effect op onze planeet.
>

Dit was mijn eerste project die ik in [Hugo](https://gohugo.io/) ging coderen. Dit leek me een mooi startpunt omdat het meerendeel van de moeilijkheidsgraad hier lag in CSS & Javascript en niet zozeer in templating.

### Cirkelnavigatie

De grootste uitdaging lag hier in de circulaire navigatie. Ik had mezelf extra werk opgeleverd door voor te stellen dat deze ook te manipuleren moet zijn door scroll en touch, dit idee werd ook goed ontvangen.

Ik heb dit aanvankelijk aangepakt door een ``svg`` ``circle id="path"`` met ``viewBox`` in de code te zetten. Hiernaast heb ik een `text` met een `textPath href="#path"` neergezet waarin een `tspan` met een aantal `a` elementen erin. Dit ging op FireFox en Safari helemaal goed. 

Helaas wilde Chrome niet met me meedoen. Schijnbaar kun je een `textPath` alleen op een `path` zetten. Ik heb dit uiteindelijk op weten te lossen door het pad van de `circle` te transformeren naar een `path`. Uiteindelijk zag mijn `partial` in Hugo er zo uit: 

```html{%raw%}
<div class="circlebox">
    <svg id="myShape" xmlns="http://www.w3.org/2000/svg" data-deg=0 version=1.1 viewBox="0 0 1000 1000">
        <path id="path1"  d="M220,500A280,280 0 1 1780,500A280,280 0 1 1220,500" fill=none />
        <text id="myText" textLength=175%>
            <textPath href="#path1">
                <tspan dy="2px" font-size="170%">
                    {{ range .data }}
                            &nbsp;
                            &nbsp;
                            {{ $slugname := replace .title "/" "-" }}
                            {{ if .url }}
                                <a data-name="{{ $slugname | urlize }}" href="{{ .url }}">{{ .title }}</a>
                                {{ else  }}
                                <a class="soon" data-name="{{ $slugname | urlize }}">{{ .title }}</a>
                            {{ end  }}
                            &nbsp;
                            &nbsp;
                    {{ end }}
                </tspan>
            </textPath>
        </text>
    </svg>
</div>{% endraw %}
```

Dit werkte statisch al goed, de links deden het en de cirkel zag eruit zoals op het design. Ik wilde alleen ook nog een hover-effect maken. Ik had het idee om op `:hover` de menu item een gedraaide achtergrond te geven met een `::before`. De kleur van deze achtergrond is met elke hover random één van de 5 huisstijl-kleuren,   Zoals hieronder afgebeeld: 

![](uploads/basecamp-2.png)

Dit trucje ging helaas niet werken. Ik had geen toeggang tot pseudo-elementen omdat ik een een SVG zat te werken. Ik heb dit uiteindelijk opgelost door dezelfde `partial` nog een keer op de pagina te zetten, die niet zichtbaar is. Als er gehoverd wordt krijgt de achterliggende cirkel een random kleurtje, een kleine scale en een kleine rotation. Hierdoor heb ik het gewenste effect alsnog voor elkaar gekregen. 

Om de cirkel te laten draaien als je 'scrollt' heb ik een `eventListener` gezet op de `wheel` event. Omdat er niks te scrollen valt zou een listener op `scroll` nergens op slaan. 

```js
  // DESKTOP SCROLL TURN LISTENER
  window.addEventListener("wheel", (e) => {
      const delta = e.wheelDeltaY;
      turnWheel(delta);
  });
```
De functie `turnWheel` krijg een `delta` mee als parameter. Deze wordt met een `factor` 0.02 vermenigvuldigd om de draaisnelheid drastisch te verminderen. Dit wordt vervolgens als een transform op beide cirkels gezet. Binnen deze functie staat ook de functie `resizeChecker`. Deze stelt niet zoveel voor, de functie returnt een scale op basis van de `window.innerWidth` en de `window.innerHeight`. Dit is om te zorgen dat de `scale()` goed staat bij verschillende viewports. 


```js
// DESKTOP SCROLL TURN FUNCTION
function turnWheel(delta) {
    const svg = document.querySelectorAll("main svg");
    scroll -= delta;
    const factor = 0.02,
        deg = factor * scroll;


    scale = resizeChecker();
    svg.forEach(svg => {
        svg.style = `transform: scale(${scale}) rotate(${deg}deg);`
    })
    oldRotation = deg;
}
```

De touch-variant hiervan was iets lastiger. Ik moest hier wat oude wiskunde B lessen van de middelbare school ophalen. Omdat de cirkel een cirkel is, moest deze niet draaien op X-Y maar op radialen. 

Ik heb een drie `eventListeners` aangemaakt voor de events `touchstart`,  `touchmove` en `touchend`. Bij `touchstart` wordt de oude draaigraad opgeslagen in een globale variabele. Als je vervolgens je touch beweegt worden de graden die je vanaf het midden hebt bewogen berekend met onder ander `Math.atan()`. Met deze graden wordt de navcircle gemanipuleerd. Aan het einde van je touch wordt de nieuwe state opgeslagen in globale variabelen en wordt niks meer gedaan met `touchmove`. 

```js
// MOBILE SCROLL LISTENER 1/3
    window.addEventListener("touchstart", (e) => {
        touchStarted = true;
        const
            x1 = window.innerWidth / 2,
            y1 = window.innerHeight / 2,
            deltaX = e.touches[0].screenX - x1,
            deltaY = e.touches[0].screenY - y1,
            rad = Math.atan2(deltaY, deltaX);

        oldDeg = rad * (180 / Math.PI);
    });

    // MOBILE SCROLL LISTENER 2/3
    window.addEventListener("touchmove", (e) => {
        if (touchStarted) {
            const
                x1 = window.innerWidth / 2,
                y1 = window.innerHeight / 2,
                deltaX = e.touches[0].screenX - x1,
                deltaY = e.touches[0].screenY - y1,
                rad = Math.atan2(deltaY, deltaX),
                newDeg = rad * (180 / Math.PI),
                delta = (newDeg - oldDeg),
                newRotation = delta + oldRotation;

            scale = resizeChecker();
            svg.forEach(svg => {
                svg.style = `transform: scale(${scale}) rotate(${newRotation}deg);`
            });
        }
    });

    // MOBILE SCROLL LISTENER 3/3
    window.addEventListener("touchend", (e) => {
        if (touchStarted) {
            const
                x1 = window.innerWidth / 2,
                y1 = window.innerHeight / 2,
                deltaX = e.changedTouches[0].screenX - x1,
                deltaY = e.changedTouches[0].screenY - y1,
                rad = Math.atan2(deltaY, deltaX),
                newDeg = rad * (180 / Math.PI),
                delta = (newDeg - oldDeg),
                newRotation = delta + oldRotation;

            oldRotation = newRotation;
            touchStarted = false;
        }
    });
```

Tot slot staat er ook altijd een `animation` op de cirkelnav, zodat deze ook zachtjes draait wanneer je niks doet. 

```css
div.circlebox { animation: rotate 150s linear infinite;}

@keyframes rotate {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
}
```

### Custom cursor

Victor wilde ook graag een custom cursor hebben. Hij wilde oorspronkelijk een statische, maar toen ik vroeg of hij een geanimeerde wilde vond hij dat ook een goed idee. Ik heb dit gedaan door een `div` in de website te zetten die met een `mousemove` altijd wordt gepositioneerd naar de positie van de cursor. Op mobile verdwijnt deze. Als de muis hovert op een `a` of iets met `class="a"`, krijgt deze een hover state, die een beetje lijkt op een bullseye. 

```js
// CUSTOM CURSOR
const cursor = document.querySelector('.cursor');
window.addEventListener("mousemove", (e) => {
    cursor.style = `transform: translate3d(${e.clientX}px, ${e.clientY}px, 0);`
    moveBackground(e);
});

// --------------- CURSOR STATES ---------------
const pointerPoints = document.querySelectorAll("a:not(.soon), .a");
pointerPoints.forEach(a => {
    a.addEventListener("mouseenter", () => { cursor.classList.add("pointer"); })
});
pointerPoints.forEach(a => {
    a.addEventListener("mouseleave", () => { cursor.classList.remove("pointer"); })
});

const soonPoints = document.querySelectorAll(".soon");
soonPoints.forEach(point => {
    point.addEventListener("mouseenter", () => { cursor.classList.add("soon"); })
});
soonPoints.forEach(point => {
    point.addEventListener("mouseleave", () => { cursor.classList.remove("soon"); })
});
// --------------- END CURSOR STATES ---------------
```

### resultaat &nbsp;

Ik was heel erg tevreden met het resultaat. Het was ook gaaf dat Victor hier een heel mooi concept had bedacht en mijn feedback zo mooi verwelkomd werd. Het voelde zo echt als een teamsport. Toen ik het de eerste keer via Zoom aan Victor presenteerde was hij er zeker over te spreken. Hij zei dat het nog beter was geworden dan hij had verwacht. Dat vond ik erg leuk om te horen. 

Ook bij deze website vind ik dat screenshots het project niet alle eer aandoen. Ik raad wederom aan om zeker de cirkelnavigatie even [zelf te bekijken](https://basecampfestival.nl/)