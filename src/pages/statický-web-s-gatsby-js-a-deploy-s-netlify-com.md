---
date: 2018-10-05T12:57:39.570Z
title: Statický web s Gatsby.js a deploy s Netlify.com
featuredImage: /images/gatsbyjs_netlify_github.jpeg
---
Na zařijové poSobotě nám (dopln) ukazoval JAMstack. Během jeho přenášky jsem si řekl, že je to možná řešení mého problému. Již dlouho jsem chtěl svůj blog, ale nebyl čas ne jeho přípravu a vubec ty věci okolo. A tady všichni slibovali stránky do 30 minut a pak už je hurá na tvorbu obsahu.

<!-- end -->

## Šablona

Začal jsem tedy hledat nějakou free použitelnou šablonu. To se zprvu jevilo jako asi nejtěžší úkol. \
Šablon jsou asi tisíce ale upřímně řečeno obrovské množstvý z nich se mě nelíbilo a nebo nevyhovalo. \
Nakonec jsem našel šablonu přímo na https://templates.netlify.com

Ok. Našel jsem šablonu. Hurá.

Paráda, je tady tlačíko pro deploy rovnou na Netlif

 ![Deploy to Netlify](https://d33wubrfki0l68.cloudfront.net/65a18ef24e011fbc0b5ddb411d611c0e1d1111a6/17e0b/images/deploy-button.svg)  

Klikám na něj. Otevře se Netlify.com, dávám registorovat pomocí GitHub a už beží deploy.

Po deployi ale přichází překvápko :( Chtěl jsem šablonu co umí i code highlighting. Tato to sice slibovala ale jaksi se zvyrazňování nekoná. Jdu zjisti proč. Stahuji si repo k sobě a instaluji gastby-cli a závislosti z npm.

```bash
npm install --global gatsby-cli
npm install
```

## PrisimJs a code highlighting

Tak jo, můžu začít hledat kde je chyba.  Spouštím `gatsby develop`. Paráda už to běží. V develop módu funguje i *hot reload* což je super fíčura.

```
You can now view devblog in the browser.

http://localhost:8000/

View GraphiQL, an in-browser IDE, to explore your site's data and schema

http://localhost:8000/___graphql
```

Otvírám v browseru `http://localhost:8000`, klikám na testovací článek a nestačím se divit. WTF kód je obarvený. Než začnu nadávat na Netlify tak mě napadá zkusit produkční build s `gastby build`. Po doběhnutí se dozvídám o možnosti přikazu `gastby serve` který spustí webserver na `http://localhost:9000` s posledním produkčním buildem.
Otetevřu testovací článek jako předtím ale tentokráte z produkčního buildu. 
WTF barvičky nikde.

Nejsem žádný JS expert, ale záhady kdy něco v dev modu funnguje a prod ne fakt nesnáším.
