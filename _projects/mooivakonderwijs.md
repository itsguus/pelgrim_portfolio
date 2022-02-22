---
title: Mooivakonderwijs
order: 4
links: 
    - title: Website
      url: https://www.mooivakonderwijs.nl/
    - title: Aangeleverd design
      url: https://xd.adobe.com/view/8193ba55-4296-4396-8ed2-46ac2dc323bb-d4c0/screen/51fd9f09-9c77-401b-96fb-3d323b548648/
---

Een onderwijsorganisatie die opleidingen in vakmanschap aanbiedt. Omelette Du Fromage werd benaderd door [Studio ANTIGIF](https://www.antigif.nl/) om een door hen ontworpen website te kunnen bouwen. 

![](/uploads/mvo-1.png)

>
Zou je het fantastisch vinden een vak te leren waarmee je iets met je handen maakt? Onze leermeesters brengen je graag de fijne kneepjes van het vak bij. Voor alle leeftijden! Voor particulieren & bedrijven.
>


### uitdagingen

Bij deze website stond functionaliteit hoog op de prioriteitenlijst. Het design was gemaakt met gebruiksgemak op nummer 1. Een belangrijk onderdeel van deze website was een API-koppeling met [Coachview](https://www.coachview.net/), software om opleidingen te beheren. Het was aan mij om deze website en deze koppeling te bouwen.

Ik heb deze website ook in Hugo gecodeerd. Bij dit project was dit wel een grote uitdaging, want er waren veel cross-links en er kwam behoorlijk wat templating aan toe. 

### hugo

Developer Joost vertelde mij aan het begin van mijn stage al dat het beginnen in Hugo voelt alsof je een bord zand leeg moet eten. Ik geef hem geen ongelijk. Om een voorbeeld te geven vergelijk ik respectievelijk een conditional statement in Jekyll met dezelfde uit Hugo. 

```{%raw%}
{% if page.images.size > 1 and page.images[0] != nil %}

    // Do something

{% endif %}{%endraw%}
```


```{%raw%}
{{ if and (gt (len .Params.images) 1) (not (eq (index .Params.images 0) ""))}}

    // Do something

{{ end }}{%endraw%}
```

Ik vind hier Jekyll ontzettend logisch, ik geloof zelfs dat iemand die een basiskennis van code heeft hier uit kan komen. Hugo daarentegen is echt een soep met tekens. De constructors van de conditional statements komen voor de paramaters, wat zorgt voor een vreemde syntax. 

Maar, als je het eenmaal onder de knie hebt vind ik het wel echt de moeite waard. De build speed is zo veel sneller dan Jekyll, en het image processen is ook erg waardevol voor je page-speed. 

### Coachview

Dit vond ik best wel spannend. Ik ben de afgelopen jaren voornamelijk met Front-end development bezig geweest en heb niet zoveel ervaring met back-end development. 

Voor de koppeling wilde ik zo veel mogelijk data binnen hebben om te gebruiken met Hugo. Dit betekende dat mijn koppeling te gebruiken moet zijn met Hugo, en hierna met deze data pagina's bouwt. De koppeling met Coachview moest dus een paar dingen kunnen doen: 

1. Data over opleidingen halen uit Coachview en deze gebruiken voordat de website met Hugo wordt gebouwd. (GET)
1. Middels een contactformulier een aanvraag van een persoon toevoegen aan Coachview. (POST)
1. Live op een cursuspagina kunnen zien hoeveel plaatsen er nog beschikbaar zijn in een cursus. 

_Punt 1_
Ik had Joost gevraagd om mij te helpen bij het eerste punt. Hij vertelde dat het mogelijk was om binnen Hugo data binnen te halen met `resources.GetRemote`. Hij had zelfs een [tutorial](https://www.thenewdynamic.com/article/toward-using-a-headless-cms-with-hugo-part-2-building-from-remote-api/) gevonden van iemand met een zelfde soort use case als dit project.

Dit heeft zich uiteindelijk vertaald naar het volgende stuk code, die zich als `prebuild` gedraagt, wat betekent dat dit wordt gerund vóórdat Hugo zelf gaat draaien. Dit had ik getest met een .JSON bestand en dit leek locaal al te werken. Top! 

```{% raw %}
{{ with resources.GetRemote "URL_TO_DATA_ENDPOINT" }}
  {{ $opleidingen := unmarshal .Content }}
    {{ range $opleidingen }}
        {{ $string := jsonify . }} 
        {{ $filename := printf "opleidingen/%s.md" (urlize .opleidingId) }} 
        {{ $resource := resources.FromString $filename $string }} 
        {{ $file := $resource.RelPermalink }} 
    {{ end }}
{{ end }}{% endraw %}
```

Hierna was het zaak om de data die vanuit Coachview kwam te transformeren naar bruikbare data om mee te werken. Ik wilde dit in PHP doen, en Joost raadde mij aan om dit te doen met een [Digitalocean droplet](https://www.digitalocean.com/). Na wat lokaal testen, af en toe live pushen en verder itereren heb ik de data precies gekregen zoals ik hem nodig had. 

Het idee was om de data uit de API open te gooien naar een public endpoint. De data die ik public maak wordt dan alleen de data die ik nodig heb op de website, privacygevoelig materiaal verdwijnt op deze manier. 

```php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://secure.coachview.net/api/v1/Opleidingen?take=100&where=audittrail.gewijzigddatumtijd>' . date('d.m.Y',strtotime("-3 days")),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer ********************',
  ),
));

$response = curl_exec($curl);
curl_close($curl);

// Save file
$json = json_decode($response, true);
$time = time();

header('Content-Type: application/json');
$myResponse = array(); 

foreach($json as $item) {
  if($item["opleidingStatusId"] == "Geannuleerd") {} else {
    $startDatum = $item["startDatum"];
    $eindDatum =  $item["eindDatum"];
    $totaalAantalUur = $item["totaalAantalUur"];

    $newJSON = array(
      'naam' => $item["naam"],
      'opleidingId' => $item["id"],
      'opleidingssoortId' => $item["opleidingssoortId"],
      'plaatsenMax' => $item["aantalPlaatsenMax"],
      'plaatsenBezet' => $item["aantalPlaatsenBezet"],
      'weekDag' => translateWeekday($item["planningWeekdagen"]),
      'eindDatum' => $eindDatum,
      'startDatum' => $startDatum,
      'date' => $startDatum,
      'adres' => $item["startLocatie"]["bedrijf"]["bezoekadres"]["adres1"],
      'postcode' => $item["startLocatie"]["bedrijf"]["bezoekadres"]["postcode"],
      'lessen' => array(),
    );
    
    $ch = curl_init();

    $url = 'https://secure.coachview.net/api/v1/Opleidingsonderdelen?take=100&where=opleidingId=' . $item["id"];
    curl_setopt_array($ch, array(
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer ********************',
      ),
    ));
    $lessen = curl_exec($ch);
    curl_close($ch);
    
    $lessen = json_decode($lessen, true);

    foreach($lessen as $les) {
      $newLes = array(
          'lesNummer' => $les["volgnummer"],
          'datum' => $les['datum'],
          'van' => $les["tijdVan"],
          'tot' => $les["tijdTot"],
      );    
      array_push($newJSON["lessen"], $newLes);
    }
    array_push($myResponse, $newJSON);
  }
}

$myResponse = json_encode($myResponse);
file_put_contents("$time.json", $myResponse);

echo $myResponse;

function translateWeekday($day) {
  if($day == "Monday") return "Maandag";
  if($day == "Tuesday") return "Dinsdag";
  if($day == "Wednesday") return "Woensdag";
  if($day == "Thursday") return "Donderdag";
  if($day == "Friday") return "Vrijdag";
  if($day == "Saturday") return "Zaterdag";
  if($day == "Sunday") return "Zondag";
}

?>
```

Als ik nu een call deed naar deze endpoint, kreeg ik mijn benodigde data netjes binnen via `resources.GetRemote`. Een voorbeeld van variabele `$myResponse` ziet er zo uit: 

```json
[
    {
        "naam": "Metselen basiscursus 5 daags - maandag",
        "opleidingId": "2aa65a59-93b7-449a-8abe-28222a828372",
        "opleidingssoortId": "8a9e5099-216e-4dbd-8864-df73952d32b7",
        "plaatsenMax": 8,
        "plaatsenBezet": 1,
        "weekDag": null,
        "eindDatum": "2022-07-18T16:00:00",
        "startDatum": "2022-06-20T09:00:00",
        "date": "2022-06-20T09:00:00",
        "adres": "Mierloseweg 244; Werkplaats nummer 7",
        "postcode": "5707 AV",
        "lessen": [
            {
                "lesNummer": 4,
                "datum": "2022-07-11",
                "van": "09:00:00",
                "tot": "16:00:00"
            },
            {
                "lesNummer": 3,
                "datum": "2022-07-04",
                "van": "09:00:00",
                "tot": "16:00:00"
            },
            {
                "lesNummer": 5,
                "datum": "2022-07-18",
                "van": "09:00:00",
                "tot": "16:00:00"
            },
            {
                "lesNummer": 1,
                "datum": "2022-06-20",
                "van": "09:00:00",
                "tot": "16:00:00"
            },
            {
                "lesNummer": 2,
                "datum": "2022-06-27",
                "van": "09:00:00",
                "tot": "16:00:00"
            }
        ]
    }
]
```

Met een cronjob heb ik er voor gezorgd dat de pagina elke 24 uur opnieuw bouwt. Op deze manier zijn alle wijzigingen in Coachview in elk geval iedere dag up to date. 


_Punt 2_
Nu moest ik ook nog een endpoint hebben die de formdata van een aanvraag zou verwerken. De formdata werd via een webhook naar mijn endpoint gestuurd, en vervolgens werd deze toegevoegd aan Coachview.

```php
<?php

$json = file_get_contents('php://input');
$body = json_decode($json, true);

if (is_null($body)) {
    // When something goes wrong, return an invalid status code
    // such as 400 BadRequest.
    header('HTTP/1.1 400 Bad Request');
    echo "\n";
    echo "Bad request";
    echo "\n";
    echo "\n";
    return;
}

$data = json_decode($json, true);
$postData = array (
    'referentieNrKlant' => $data['reference'],
    'opmerking' => $data['vragen'],
    'aantalPersonen' => 1,
    'uitvoeringstermijn' => null,
    'aanvraagIsOrder' => true,
    'vrijevelden' => 
    array (
      'additionalProp1' => null,
      'additionalProp2' => null,
      'additionalProp3' => null,
    ),
    'bedrijf' => 
    array (
      'naam' => $data['bedrijf_title'],
      'adres' => 
      array (
        'adres1' => $data['bedrijf_factuuradres'],
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => $data['bedrijf_factuurpostcode'],
        'plaats' => $data['bedrijf_plaats'],
        'landCode' => null,
      ),
      'bezoekAdres' => 
      array (
        'adres1' => $data['bedrijf_factuuradres'],
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => $data['bedrijf_factuurpostcode'],
        'plaats' => $data['bedrijf_plaats'],
        'landCode' => null,
      ),
      'factuurAdres' => 
      array (
        'adres1' => $data['bedrijf_factuuradres'],
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => $data['bedrijf_factuurpostcode'],
        'plaats' => $data['bedrijf_plaats'],
        'landCode' => null,
      ),
      'emailadres' => $data['bedrijf_factuurmailadres'],
      'telefoonnummer' => null,
      'opmerking' => null,
      'externId' => null,
      'externSource' => null,
      'optInOut' => 'Onbekend',
      'vrijevelden' => 
      array (
        'additionalProp1' => null,
        'additionalProp2' => null,
        'additionalProp3' => null,
      ),
      'categorieen' => 
      array (
        0 => 
        array (
          'categorieId' => null,
        ),
      ),
    ),
    'contactpersoon' => 
    array (
      'voorletters' => null,
      'voornaam' => $data['bedrijf_contactpersoon'],
      'tussenvoegsels' => null,
      'achternaam' => null,
      'adres' => 
      array (
        'adres1' => null,
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => null,
        'plaats' => null,
        'landCode' => null,
      ),
      'factuurAdres' => 
      array (
        'adres1' => null,
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => null,
        'plaats' => null,
        'landCode' => null,
      ),
      'emailadres' => null,
      'emailadres2' => null,
      'externId' => null,
      'externSource' => null,
      'telefoonnummer' => null,
      'telefoonnummerType' => null,
      'telefoonnummer2' => null,
      'telefoonnummer2Type' => null,
      'optInOut' => null,
      'geslacht' => null,
      'opmerking' => null,
      'geboorteAchternaam' => null,
      'geboorteTussenvoegsels' => null,
      'geboorteDatum' => null,
      'geboortePlaats' => null,
      'titel' => null,
      'achterTitel' => null,
      'afdelingId' => null,
      'functieId' => null,
      'persoonId' => null,
      'vrijeveldenPersoon' => 
      array (
        'additionalProp1' => null,
        'additionalProp2' => null,
        'additionalProp3' => null,
      ),
      'vrijeveldenOpleidingsvraag' => 
      array (
        'additionalProp1' => null,
        'additionalProp2' => null,
        'additionalProp3' => null,
      ),
      'categorieen' => 
      array (
        0 => 
        array (
          'categorieId' => null,
        ),
      ),
    ),
    'contactpersoonIsLeidinggevende' => true,
    'autorisatieEigenaar' => 
    array (
      'voorletters' => null,
      'voornaam' => null,
      'tussenvoegsels' => null,
      'achternaam' => null,
      'adres' => 
      array (
        'adres1' => null,
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => null,
        'plaats' => null,
        'landCode' => null,
      ),
      'factuurAdres' => 
      array (
        'adres1' => null,
        'adres2' => null,
        'adres3' => null,
        'adres4' => null,
        'postcode' => null,
        'plaats' => null,
        'landCode' => null,
      ),
      'emailadres' => null,
      'emailadres2' => null,
      'externId' => null,
      'externSource' => null,
      'telefoonnummer' => null,
      'telefoonnummerType' => null,
      'telefoonnummer2' => null,
      'telefoonnummer2Type' => null,
      'optInOut' => null,
      'geslacht' => null,
      'opmerking' => null,
      'geboorteAchternaam' => null,
      'geboorteTussenvoegsels' => null,
      'geboorteDatum' => null,
      'geboortePlaats' => null,
      'titel' => null,
      'achterTitel' => null,
      'afdelingId' => null,
      'functieId' => null,
      'persoonId' => null,
      'vrijeveldenPersoon' => 
      array (
        'additionalProp1' => null,
        'additionalProp2' => null,
        'additionalProp3' => null,
      ),
      'vrijeveldenOpleidingsvraag' => 
      array (
        'additionalProp1' => null,
        'additionalProp2' => null,
        'additionalProp3' => null,
      ),
      'categorieen' => 
      array (
        0 => 
        array (
          'categorieId' => null,
        ),
      ),
    ),
    'debiteur' => 
    array (
      'naamRekeninghouder' => null,
      'btwNummer' => null,
      'iban' => null,
      'bicCode' => null,
      'particulier' => true,
      'opmerking' => null,
      'betaalwijzeId' => null,
      'verzendwijzeFactuur' => null,
      'emailType' => null,
      'emailadresAnders' => null,
    ),
    'deelnemers' => 
    array (
      0 => 
      array (
        'voorletters' => null,
        'voornaam' => $data['firstName'],
        'tussenvoegsels' => $data['tussen'],
        'achternaam' => $data['lastName'],
        'adres' => 
        array (
          'adres1' => $data['streetName'],
          'adres2' => null,
          'adres3' => null,
          'adres4' => null,
          'postcode' => $data['postalCode'],
          'plaats' => $data['location'],
          'landCode' => null,
        ),
        'factuurAdres' => 
        array (
          'adres1' => $data['streetName'],
          'adres2' => null,
          'adres3' => null,
          'adres4' => null,
          'postcode' => $data['postalCode'],
          'plaats' => $data['location'],
          'landCode' => null,
        ),
        'emailadres' => $data['mail'],
        'emailadres2' => null,
        'externId' => null,
        'externSource' => null,
        'telefoonnummer' => $data['phoneNumber'],
        'telefoonnummerType' => 'Direct',
        'telefoonnummer2' => null,
        'telefoonnummer2Type' => null,
        'optInOut' => null,
        'geslacht' => $data['gener'],
        'opmerking' => null,
        'geboorteAchternaam' => null,
        'geboorteTussenvoegsels' => null,
        'geboorteDatum' => $data['dateOfBirth'],
        'geboortePlaats' => null,
        'titel' => null,
        'achterTitel' => null,
        'afdelingId' => null,
        'functieId' => null,
        'persoonId' => null,
        'vrijeveldenPersoon' => 
        array (
          'additionalProp1' => null,
          'additionalProp2' => null,
          'additionalProp3' => null,
        ),
        'vrijeveldenOpleidingsvraag' => 
        array (
          'additionalProp1' => null,
          'additionalProp2' => null,
          'additionalProp3' => null,
        ),
        'categorieen' => 
        array (
          0 => 
          array (
            'categorieId' => null,
          ),
        ),
      ),
    ),
    'opleidingen' => 
    array (
      0 => 
      array (
        'opleidingId' => $data['id'],
        'opleidingssoortId' => $data['parentId'],
      ),
    ),
);

$postData = json_encode($postData);

$ch = curl_init(); 

curl_setopt($ch, CURLOPT_URL, "https://secure.coachview.net/api/v1/Webaanvragen");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type:application/json',
    'Authorization: Bearer ********************************',
));

$response = curl_exec($ch);
curl_close($ch);

header('HTTP/1.1 200 OK');

?>
```

_Punt 3_
Nu moest ik op dezelfde droplet ook nog een PHP bestand schrijven die de beschikbare plaatsen van een opleiding ophaalt uit Coachview. Deze lijkt heel veel op het PHP script uit Punt 1, maar dan flink gereduceerd. 

```php
<?php

$id =  $_GET['id'];

$curl = curl_init();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://secure.coachview.net/api/v1/Opleidingen/' . $id,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer ***************************',
  ),
));


$response = curl_exec($curl);
curl_close($curl);

$json = json_decode($response, true);
$myResponse = array(
    'max' => $json["aantalPlaatsenMax"],
    'bezet' => $json["aantalPlaatsenBezet"],
);

$myResponse = json_encode($myResponse);
file_put_contents("$time.json", $myResponse);

echo $myResponse;

?>
```

Als je bij deze endpoint in de URL een id meegeeft, wordt via Coachview het max aantal plaatsen samen met het bezette aantal plaatsen gereturned. 

![](/uploads/mvo-2.png)

Zodra een bezoeker op een opleidingspagina komt, wordt er met JS een fetch gedaan naar deze endpoint. De data die terugkomt wordt ingevuld op de juiste plek. De data van deze pagina wordt dan ook in de sessionStorage gezet, zodat de fetch niet bij iedere refresh gedaan hoeft te worden, en wel nog up to date blijft. 


```js
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function populatePlaatsen() {
    const id = document.querySelector("section.content.details").getAttribute("data-id");
    if(id) {
        const elements = {
            vrij: document.querySelector("section.content.details #plaatsen span.deel"),
            max: document.querySelector("section.content.details #plaatsen span.geheel"),
        };
        if (sessionStorage.getItem(`plaatsen-${id}`)) {
            const data = JSON.parse(sessionStorage.getItem(`plaatsen-${id}`));
            elements.vrij.textContent = data.vrij;
            elements.max.textContent = data.max;
        }
        else {
            try {
                const url = `https://connect.omelettedufromage.nl/getPlaces.php?id=${id}`;
                getData(url).then(data => {
                    const vrij = parseInt(data.max - data.bezet);
                    elements.vrij.textContent = vrij;
                    elements.max.textContent = data.max;
                    sessionStorage.setItem(`plaatsen-${id}`, JSON.stringify({
                        vrij: vrij,
                        max: data.max
                    }));
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
}

```

### Resultaat

Ik had dit project een beetje onderschat. Toen ik de layouts zag verwachtte ik het in een paar dagen gemaakt te kunnen hebben. Dit klopt ergens ook wel, want de front-end stelde, los van het [filteren en zoeken van producten](https://www.mooivakonderwijs.nl/vakscholing/), niet super veel voor. 

Uiteindelijk was dit meer werk dan ik dacht, omdat ik ook nog zat te vechten met Hugo. Ik had ook gebruik gemaakt van het image-processen, wat supergoed werkte. Ik had alle images in webp format met de juiste afmetingen, de site scoorde op pagespeed overal op 100. 

Helaas had ik niet rekening gehouden met oude versies van Safari, die .webp nog niet supporten. Ik heb hierdoor voor alle images ook jpg en .png fallbacks moeten maken, toen de site al bijna helemaal gecodeerd was. Hier heb ik wel weer wat van geleerd, want de volgende keer doe ik dat in één keer. Ik heb hiervoor ook een mooie `partial "image.html` gemaakt. Als je deze `partial` aanroept hoef je alleen nog wat parameters mee te sturen die bij de context horen.

```{% raw %}
{{ partial "image.html" (dict 
  "size" "500x500"
  "path" "/img/sticker.png"
  "class" "sticker"
  "alt" "CRKBO geregistreerde instelling" 
  "png" true   )}}{% endraw %}
```

```html{% raw  %}
<picture class="{{ .class }}">
    {{ $webpSize := print .size " webp" }}
    {{ $webp := ((resources.GetMatch .path).Fill $webpSize).RelPermalink }}
    <source srcset="{{ $webp }}" type="image/webp">
    {{ if .png }}
        {{ $pngSize := print .size " png" }}
        {{ $png := ((resources.GetMatch .path).Fill $pngSize).RelPermalink }}
        <source srcset="{{ $png }}" type="image/png"> 
        <img src="{{ $png }}" alt="{{ .alt }}" {{ if .title }} title="{{ .title }}" {{ end }}>
    {{ else }}
        {{ $jpgSize := print .size " jpg" }}
        {{ $jpg := ((resources.GetMatch .path).Fill $jpgSize).RelPermalink }}
        <source srcset="{{ $jpg }}" type="image/jpg"> 
        <img src="{{ $jpg }}" alt="{{ .alt }}" {{ if .title }} title="{{ .title }}" {{ end }} type="image/jpeg">
    {{ end }}
</picture>{% endraw %}
```

```html
<!-- OUTPUT FOR THIS CASE: -->
<picture class="sticker">
  <source srcset="/generated_webp_image.webp" type="image/webp">
  <source srcset="/generated_jpg_image.png" type="image/png">
  <img src="/generated_png_image.png" alt="CRKBO geregistreerde instelling">
</picture>
```

De koppeling met coachview heeft me ook heel erg veel tijd gekost. Een grote reden hiervoor was omdat ik nog geen vloeiend PHP spreek. Al met al ben ik wel tevreden met het eindresultaat, en zeer te spreken met hoeveel ik heb kunnen leren binnen 1 project. Het is natuurlijk ook leuk om [de website even te bekijken](https://www.mooivakonderwijs.nl/)

Ik vond het wel fijn om een design te ontvangen die gemaakt was in Adobe XD (Sketch of Figma zou hetzelfde effect hebben). Binnen XD kon ik namelijk heel makkelijk alle iconen naar svg exporteren, kleurcodes extraheren, marges bekijken, afbeeldingen exporteren en box-shadows bekijken. Dit kan in Illustrator ook wel, maar met XD was het allemaal net wat toegankelijker. 