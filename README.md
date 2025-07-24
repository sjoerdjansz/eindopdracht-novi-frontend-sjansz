# Installatiehandleiding

### Sweat Daddy - *Who's your trainer now?*

------

## Inleiding

Sweat Daddy is een softwareoplossing voor personal trainers die de voortgang van hun cliënten willen bijhouden. Als trainer kan je registreren en inloggen, cliëntprofielen maken, workouts creëren en deze koppelen aan cliënten, en oefeningen toevoegen aan de exercise list. Het doel van de applicatie is om het bijhouden van de voortgang van cliënten leuker en gemakkelijker te maken.

>Volg de stappen in deze installatiehandleiding om het project lokaal te installeren en draaien.

![sweat-daddy-app-screenshot.png](src/assets/sweat-daddy-app-screenshot.png)

## Installatie

### Stap 1. Node en NPM installeren

Open de terminal en controleer of je Node en NPM hebt geïnstalleerd en zo ja, welke versie je hebt. Het project is gemaakt op Node 23.7.0 en NPM 11.2.0. Het is aan te raden om minimaal deze versie te gebruiken.

```bash
node -v
npm -v
```

Indien je Node nog niet hebt geïnstalleerd kan je dit doen door de stappen op de website van Node.js te volgen:

[Node.js website]: https://nodejs.org/en/download

Als NPM nog niet is geinstalleerd doe je dat door het volgende commando in de terminal te runnen:

```bash
npm install -g npm
```

------

### Stap 2. Project dependencies installeren

Open het project en je code editor en installeer de npm packages door het volgende commando te gebruiken:

```bash
npm install
```

------

### Stap 3. Het .env bestand aanmaken

Maak een .env file in de root directory van het project en plaats de volgende gegevens in de .env file.

```env
VITE_API_KEY=
VITE_BASE_URL=
```

------

### Stap 4. Database configureren

De applicatie maakt gebruik van de Novi Dynamic API om informatie op te halen en op te slaan. Om CRUD operaties te doen, moet de database geconfigureerd worden. Dit doe je door onderstaande stappen te volgen.

1. Navigeer naar https://novi-backend-api-wgsgz.ondigitalocean.app/
2. Voeg de string achter de *VITE_API_KEY=* uit stap 3 toe in het inputveld bij *API Configureren* op de Novi Dynamic API website.
3. Klik op *bestand kiezen* en selecteer het **database.json** bestand welke je kunt vinden in de *data* map die zich bevindt in de *src* map van het project. Het pad naar het betreffende bestand is: *src/data/database.json*
4. Druk op de button *Upload API configuratie*
5. Klik op de button onderaan de pagina onder *API-documentatie gebruiken* om naar de Swagger-UI van het project te gaan. Hier hoef je in principe niks te doen, maar kun je de database structuur inzien.

------

### Stap 5. Project starten

Na het volgen van alle bovenstaande stappen is het mogelijk om het project lokaal te draaien. Dit doe je door in de terminal van het project het volgende commando te typen:

```bash
npm run dev
```

Het project zal vervolgens op een ingestelde en beschikbare port draaien (meestal http://localhost:5173).

Er zijn verder geen andere npm commando's beschikbaar.

------

## De applicatie gebruiken

Om de applicatie te gebruiken kun je ervoor kiezen om eerst een nieuw trainer account aan te maken op de Signup pagina voor een fictieve organisatie, of in te loggen als **Hank the Tank**. Deze gerenommeerde trainer heeft er geen moeite om wat meer van zichzelf te laten zien (letterlijk en figuurlijk), dus ook zijn inloggegevens zijn zichtbaar. 😅

>E-mailadres: **hank@tankfitness.com**
> 
> Wachtwoord: **hank123**

**Let op:** de functionaliteiten *inloggen via Google* en *forget password* zijn (nog) niet geïmplementeerd en vooral voor de show en om dichtbij de schermontwerpen te blijven.

Na inloggen word je doorgestuurd naar de Dashboard pagina. Deze pagina bevat geen van de kernfunctionaliteiten, maar is wel één van de schermontwerpen. De functionaliteiten bevinden zich op de overige pagina's. 