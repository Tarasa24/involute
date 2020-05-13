<template>
  <main>
    <div>
      <h1>Zásady pro používání souborů cookie</h1>
      <h2>Co jsou cookies?</h2>
      <p>
        Cookie je malý soubor tvořený písmeny a číslicemi, který počítač s
        webovou stránkou prostřednictvím prohlížeče odesílá do vašeho počítače
        nebo mobilního telefonu (dále označovaných jako „zařízení“) a ukládá na
        pevném disku vašeho zařízení. Soubory cookie nám umožňují rozlišit vás
        od ostatních uživatelů našich webových stránek. Díky nim vám můžeme
        nabídnout lepší zážitky při prohlížení našich webových stránek a
        neustále zlepšovat své služby.
      </p>
      <p>
        Každá webová stránka může do vašeho prohlížeče odesílat své vlastní
        soubory cookie, pokud to umožňuje nastavení vašeho prohlížeče. Váš
        prohlížeč však (v zájmu ochrany vašeho soukromí) umožňuje webovým
        stránkám přístup pouze k těm souborům cookie, které tyto stránky do
        vašeho zařízení samy odeslaly, nikoli k souborům cookie odeslaných
        jinými webovými stránkami. Mnohé webové stránky to dělají vždy, když je
        uživatel navštíví. Mohou tak lépe sledovat on-line provoz.
      </p>
      <h2>Soubory cookie třetích stran</h2>
      <p>
        V některých případech používáme reklamní soubory cookie třetích stran,
        které nám umožňují pochopit a zlepšit účinnost dané reklamy. Tyto
        soubory cookie se někdy používají pro personalizaci, změnu zacílení a
        optimalizaci on-line reklamy.
      </p>
      <p>
        Tato stránka používá službu Google Analytics, poskytovanou společností
        Google, Inc. (dále jen Google). Služba Google Analytics používá souborů
        cookie, které jsou textovými soubory ukládanými do vašeho počítače
        umožňující analýzu způsobu užívání této stránky jejími uživateli.
        Informace vygenerované souborem cookie o užívání stránky (včetně vaší IP
        adresy) bude společností Google přenesen a uložen na jejich serverech.
        Google bude užívat těchto informací pro účely vyhodnocování užívání
        stránky a vytváření zpráv o její aktivitě, určených pro její
        provozovatele, a pro poskytování dalších služeb týkajících se činností
        na stránce a užívání internetu vůbec. Google může také poskytnout tyto
        informace třetím osobám, bude-li to požadováno zákonem nebo budu-li
        takovéto třetí osoby zpracovávat tyto informace pro Google. Google
        nebude spojovat vaší IP adresu s jakýmikoli jinými daty, která má k
        dispozici. Můžete odmítnout používání daných souborů cookie volbou v
        příslušném nastavení, avšak uvědomte si, že jestliže tak učiníte, tak
        nebudete schopni plně využívat veškeré funkce této stránky. Povolením
        užívání statistických cookie souhlasíte se zpracováváním údajů o vás
        společností Google, a to způsobem a k účelu shora uvedeným.
      </p>
      <h2>Jak odmítnout soubory cookie?</h2>
      <p>
        Používáním našich webových stránek vyjadřujete svůj souhlas s používáním
        zde popsaných souborů cookie.<br />
        Všechny moderní prohlížeče vám nicméně umožňují změnit nastavení souborů
        cookie. Svá zařízení si můžete nastavit tak, aby přijímala všechny
        soubory cookie, aby vás upozornila na vydání souboru cookie, nebo aby
        nikdy nepřijímala soubory cookie. Pokud zvolíte poslední možnost,
        znamená to, že vám nemohou být nabídnuty určité personalizované funkce,
        a proto nebudete moci plně využít všech funkcí příslušných webových
        stránek. Každý prohlížeč je jiný, projděte si proto ve svém prohlížeči
        nabídku Nápověda, Možnosti nebo Předvolby, kde se dozvíte, jak změnit
        nastavení souborů cookie.
      </p>
      <p>
        Doporučujeme vám, abyste při navštěvování našich webových stránek
        soubory cookie nevypínali.
      </p>
    </div>
  </main>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray

div
  margin: auto
  padding: 20px 0
  text-align: left
  width: $baselineWidth
  max-width: $maxWidth
  @include medium-device
    width: 90%
  h2
    padding-top: 5px
  h1
    color: $purple
    font-size: 2.2rem
    padding-bottom: 5px
    border-bottom: 2px solid $textGray
    @include medium-device
      font-size: 1.9rem
</style>
