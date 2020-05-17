<template>
  <main>
    <Header>
      <h1>Kontakt</h1>
      <h2>Neváhejte se na nás obrátit</h2>
    </Header>

    <div class="wrapper">
      <div class="history">
        <h2>Naše historie a krédo</h2>
        <p>
          iNvolute, založen 1. března 2016, je e-sportová organizace řadící se
          do nejmladších profesionálních týmů na české a slovenské herní scéně.
          Již od samého začátku podporujeme nejhranější herní tituly jako League
          of Legends či Hearthstone. Naším posláním je přinášení novinek ze
          světa e-sportu a vytvoření semknuté herní komunity.
        </p>
      </div>
      <div class="contact">
        <h2>Kontakt</h2>
        <p>
          Máte otázku, opravdu jakoukoliv? Napište nám na email, nebo na naše
          sociální sítě. Rádi Vám odpovíme co nejdříve.
        </p>
        <br />
        <span>
          <span class="fas fa-envelope" />
          <a href="mailto:info@teaminvolute.eu">info@teaminvolute.eu</a>
        </span>
        <br />
        <span>
          <span class="fas fa-phone" />
          <a href="tel:+420534534614">+420 534 534 614</a>
        </span>

        <h2>Provozovatel</h2>
        <p>
          iNvolute s.r.o.,<br />
          Primátorská 296/38,<br />
          Praha 8, Libeň,<br />
          180 00,<br />
          IČ: 06180167
        </p>

        <h2>Reklamace a obchodní podmínky</h2>
        <span>
          <span class="fas fa-file-alt" />
          <a href="#">Ochodní podmínky</a>
        </span>
      </div>
    </div>
  </main>
</template>

<script>
import Header from '../../components/misc/Header';

export default {
  components: { Header },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  display: grid
  justify-items: center
  padding-bottom: 5%

.wrapper
  display: grid
  width: $baselineWidth
  grid-template-columns: repeat(2, 1fr)
  @include large-device
    width: 100%
    grid-template-columns: auto

  .history
    padding-right: 2.5%
    @include large-device
      padding-left: 2.5%
  .contact
    padding-left: 2.5%

  img
    max-width: 90%
    justify-self: center
  div
    text-align: left
    h2
      margin: 10px 0
      color: $purple
    p
      margin: 0
    span
      padding-left: 10px
      margin-bottom: 10px
      .fas
        color: $pink
        padding: 0 2% 0 0
      a
        text-decoration: none
        color: black
        @include transition(letter-spacing)
        &:hover
          letter-spacing: .1em
</style>
