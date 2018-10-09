---
date: 2018-10-05T12:57:39.570Z
title: Statický web s Gatsby.js a deploy za pomoci Netlify.com
featuredImage: /images/gatsbyjs_netlify_github.jpeg
---
Na zářijové [Poslední sobotě](https://www.posobota.cz/) nám [Ladislav Prskavec](https://www.prskavec.net/) představoval JAMstack. 
Během jeho přenášky, jsem si řekl, že je to možná řešení mého problému. 
Již dlouho jsem chtěl svůj blog, ale nebyl čas na jeho přípravu a vůbec ty věci okolo... 

<!-- end -->

## Šablona

Začal jsem tedy hledat nějakou free použitelnou šablonu. To se zprvu jevilo jako nejtěžší úkol. \
Šablon jsou snad tisíce ale upřímně řečeno obrovské množství z nich se mě nelíbilo nebo nevyhovovalo. \
Nakonec jsem našel šablonu přímo na https://templates.netlify.com

Paráda, našel jsem šablonu a je tady tlačítko pro deploy rovnou na Netlify \
 ![Deploy to Netlify](https://d33wubrfki0l68.cloudfront.net/65a18ef24e011fbc0b5ddb411d611c0e1d1111a6/17e0b/images/deploy-button.svg)  

Klikám na něj. Otevře se Netlify.com, registruji se pomocí GitHub účtu a už běží deploy.

Následuje překvápko :( Chtěl jsem šablonu, co umí i *code highlighting*. 
Tato to sice slibovala ale jaksi se zvýrazňování nekoná. \
Jdu zjisti proč. Stahuji si repo k sobě a instaluji **gastby-cli** a závislosti z npm.

```bash
npm install --global gatsby-cli
npm install
```

## PrismJs a code highlighting

Tak jo, můžu začít hledat kde je chyba.  \
Spouštím `gatsby develop`.

```
You can now view devblog in the browser.

http://localhost:8000/

View GraphiQL, an in-browser IDE, to explore your site's data and schema

http://localhost:8000/___graphql
```

Otevírám v browseru `http://localhost:8000`, klikám na testovací článek a nestačím se divit. \
WTF kód je obarvený. \
Než začnu nadávat na Netlify tak mě napadá zkusit produkční build s `gastby build`. \
Po doběhnutí se dozvídám o možnosti přikazu `gastby serve` který spustí webserver na `http://localhost:9000` 
s posledním produkčním buildem.
Klikám na testovací článek jako předtím ale tentokráte z produkčního buildu. \ 
WTF barvičky nikde ...

Nejsem *JS* expert, ale záhady kdy něco v dev modu funguje a v prod ne fakt nesnáším (bez ohledu na jazyk). \
Po krátkem googleni zjišťuji, že pro highlighting se používá knihovna 
[PrisimJs](https://prismjs.com).
Hledám tedy v kódu `prism` a nacházím, že v šabloně se importují css přímo z prism-js balíčku z npm_modules.
Očividně to v *prod* módu ale nefunguje...\
Koukám do dokumentace a vidím, že by se spíš měl použít `gastby-browser.js` (v mé šabloně chybí) \
Vytvářím tedy kopii stylů do */static/prisimjs.css* a soubor *gatsby-browser.js* a spuštím build.
```js
// /gatsby-browser.js
require('./static/prismjs.css');
```

> *Voilà*, barvičky jsou tu. 

Moc se mě nelíbí, nacházím ale další [zdroj](https://atelierbram.github.io/syntax-highlighting/prism/), kde si už vybirám.
Případně v [ofiko repu](https://github.com/PrismJS/prism-themes) jsou i nějaké navíc, která nejsou na webu. 


## NPM = nefungční package manager

Za mě dosti nepříjemná zkušenost s **npm**. IDE mě hlásí, že `package.json` nejsou nějaké závislosti přestože
se v kódu používají (např: react, react-helmet, atd..). 
Očividně se nainstalují s ostatnímy balíčky, ale tak proč je tam nepřidat, ať je to košér. 

```bash
npm install react react-helmet --save
```
A nestačím se divit, npm nainstalovalo balíčky, které nejsou kompatibilní s dalšími balíčky v package.json. 
Ve zkratce jsem to řešil takto: hledám jiná repa, kde závislosti mají -> upravuji verze v mám package.json 
-> smažu složku `npm_modules` -> dávám `npm install` -> vyřešeno.

ty `peer dependencies` jsou taky hroznej výmysl....

## Přechod z Gatsby.js v1 na v2
Dle [návodu](https://www.gatsbyjs.org/docs/sourcing-from-netlify-cms/)
Chci přidat plugin `gatsby-netlify-cms` dávám tedy 
```bash
npm install --save netlify-cms gatsby-plugin-netlify-cms
```  
**npm opět boduje** a nainstaluje **v3.0.3**, která je ale doprkýnka pro **gastby.js v2**,
 přestože v package.json mám uvedeno  **"gatsby" : "1.9.272"**. To npm je fakt šílený.... 

Tak když už řeším další WFT, tak si říkám, zda nezmigrovat rovnou na v2. 
Zadávám do google: *gatsby v1 migrate to v2* hned druhý odkaz je na [readme na githubu](https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/migrating-from-v1-to-v2.md).
Chvilku to čtu a vypadá to celkem easy. \
Postupuji podle návodu a krom zanadávání si na autora šablony, který fakt nevím proč,
 **kombinoval** v pár souborech *ES6* s *CommonJS*, což je ve verzi 2 už není nepodporováno
  (a nevím proč to vůbec kdy podporováno bylo), tak přechod proběl celkem hladce a během pár minut.

## Netlify CMS 

Přidání *Netlify CMS* do projektu se nakonec ukázalo jako vůbec to nejsložitější.
V dokumentaci k Gatsby.js, která je celkem fajn, necházím návod [Sourcing from Netlify CMS](https://www.gatsbyjs.org/docs/sourcing-from-netlify-cms).
Bohuže nefunguje :( \
Kromě balíčků `netlify-cms` a `gatsby-plugin-netlify-cms`, které uvádí dokumentace, je potřeba i `netlify` což jsem následně zjisti v repu
 nějaké šablony, co hlásila, že podporu netlify-cms má.

Vytvářím konfig v `static/admin` podle (dokumentace)[https://www.netlifycms.org/docs/add-to-your-site] 
```yaml
#static/admin/config.yaml
backend:
  name: github
  repo: ondraondra81/votava.blog

media_folder: /static/images
public_folder: /images
publish_mode: editorial_workflow

collections:
- name: blog
  label: Blog
  folder: src/pages
  create: true
  fields:
  - { name: 'date', label: 'Date', widget: 'date' }
  - { name: 'title', label: 'Title' }
  - { name: "featuredImage", label: "Featured Image", widget: "image", required: false}
  - { name: 'body', label: 'Body', widget: 'markdown' }
```

Problém ale nastal u obrázků. **Netlify CMS totiž používá absolutní cestu a s ní má zase problém GraphQL**,
 který v případě, že byla absolutni cesta v `frontmatter` (hlavička v .md souboru) tvrdošině hlásil, že to není String.
 
```text
#hlavička .md souboru
---
date: 2018-10-05T10:02:41.620Z
title: Test
featuredImage: /images/featured.jpg
---
Lorem ipsum (zkráceně lipsum) ......
```

```bash
GraphQLError: Field "featuredImage" must not have a selection since type "String" has no subfields.
```

Jenže co s tím? \
Vygooglil jsem hodně issue a komentářů. např:
- [https://github.com/netlify/netlify-cms/issues/843](https://github.com/netlify/netlify-cms/issues/843)
- [https://github.com/gatsbyjs/gatsby/issues/8195](https://github.com/gatsbyjs/gatsby/issues/8195)
- [https://github.com/gatsbyjs/gatsby/issues/5298](https://github.com/gatsbyjs/gatsby/issues/5298)

V issues jsem našel i odkazy na nějaké pluginy, které to údajně řeší: 
- [gatsby-remark-relative-images](https://www.gatsbyjs.org/packages/gatsby-remark-relative-images) 
- [gatsby-remark-relative-images-v2](https://www.npmjs.com/package/gatsby-remark-relative-images-v2) 
- [gatsby-plugin-netlify-cms-paths](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify-cms-paths/?=image)

Funkční řešení ale nikde :( a buildy stále padají.


### Řešení problému s cestou k obrázkům pro Netlify CMS a Gatsby.js

Finální řešení, pro obrázky které se ukládají v mém případě do `static/images` jsem nakonec poskládal takto: 

V první fázi je třeba upravit `gastby-config.js` a přidat tam definici pro `gatsby-source-filesystem` kde má obrázky hledat.
 **JE NUTNÉ** aby byla před `gatsby-transformer-remark`
```js
// gastby-config.js
// ...
 plugins: [
    //..
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/static/images`,
                name: 'images',
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
        },
//...
]
```

Super, tím jsme vyřešili obrázky v body markdownu. \
Teď ještě obrázek z `frontmatter`. Tohle řešení je ale trochu hardcoded protože s obecným řešením jsem nakonec už nechtěl ztrácet čas.
 V podstě při vytváření `node` tam natvrdo nahradím absolutní cestu za relativní. 
 (o to samé se snažili uvedené pluginy, ale nějak jim to nešlo/nefungovalo.)

Vytvořil jsem si tedy metodu *makeRelative(value)*, která pokud je to absolutní cesta, z ní udělá cestu relativní a vrátí novou hodnotu. 
```js
// gastby-node.js
const makeRelative = function makeRelative(value) {
    let newValue = value;
    if (typeof value === 'string' && path.isAbsolute(value)) {
        // path is hardcoded
        newValue = path.join('../../static', value);
    }

    return newValue;
};
```

Následně je třeba ji zavolat v `onCreateNode` pro každou hodnotu z hlavičky
```js
// gastby-node.js
exports.onCreateNode = ({node, boundActionCreators, getNode}) => {

//...
    if (node.internal.type === `MarkdownRemark`) {
        deepMap(node.frontmatter, makeRelative, {
            inPlace: true,
        });
       // ...
    }
};
```

## Odstranění linků z excerpt
Při psaní toho článku jsem jestě při kontrole narazil na to, že pokud jsou odkazy v *excerpt* části, nevím jak to nazvat česky správně (výnětek, úvod, ukázka),
Tak na výpise zůstanou v textovám formátu. tj:
```text
Na zářijové [Poslední sobotě](https://www.posobota.cz/) nám [Ladislav Prskavec](https://www.prskavec.net/) představoval JAMstack. 
Během jeho přenášky, jsem si řekl, že je to možná řešení mého problému. 
Již dlouho jsem chtěl svůj blog, ale nebyl čas na jeho přípravu a vůbec ty věci okolo... 
```

Během pár minut jsem nanašel nějaké řešení přimo od Gatsby.js, takže jsem sáhnul k vlastnímu.
```js
// src/utils/stripLinksFromExcerpt.jsx
const stripLinkFromExcerpts = (excerpt) => {
    return  excerpt.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1');
};

export default stripLinksFromExcerpt;

```

a následně úprava kompomenty co excerpt vypisuju

```js
// src/components/Summary/index.jsx
//...
import stripLinksFromExcerpt from '../../utils/stripLinksFromExcerpt';
// ...
    <P>{stripLinksFromExcerpt(excerpt)}</P>
// ...
```

a výsledkem je:

```text
Na zářijové Poslední sobotě nám Ladislav Prskavec představoval JAMstack. Během jeho přenášky,
jsem si řekl, že je to možná řešení mého problému. Již dlouho jsem chtěl svůj blog,
ale nebyl čas na jeho přípravu a vůbec ty věci okolo...
```

## Gatsby.js
Gatsby má pěknou dokumentaci a tuny pluginů. Z čeho mě ale běhá mráz po zádech je [oficiání repo](https://github.com/gatsbyjs/gatsby),
ve kterém jsou i všechny oficiální pluginy a dohledat například poslední release pro gatsby nebo plugin (4,891 releases) je fakt voser. Uniká mě důvod proč core 
a každý plugin nemají svoje vlastní repo. 
Je ale pozitivní, že je tam obrovská aktivita a na projektu se pilně pracuje.

## Závěrem
Rozchození nebylo až tak rychlé, jak jsem si představoval ale dost možná, za to může mnou zvolená šablona. 
Výsledkem je tenhle blog :) \
Celé repo najdete na [GitHub](https://github.com/ondraondra81/votava.blog)u 

Do budoucna bych chtěl ještě přidat tagy a odkazy na relevantní články,
 tak uvidíme jak si v tomto směru Gatsby.js povede.
Ještě předtím ale vyzkouším (Hugo)[https://gohugo.io] abych měl srovnání (a možná i další blog :D )


 

