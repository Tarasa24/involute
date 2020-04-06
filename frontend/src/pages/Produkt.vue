<template>
  <div class="produkt">
    <Basket ref="basket" />
    <main>
      <a :href="produkt.img">
        <zoom-on-hover
          :img-normal="produkt.img"
          :alt="produkt.sub"
          :scale="1.5"
        />
      </a>
      <div>
        <h1>{{ produkt.name }}</h1>
        <h2>{{ produkt.sub }}</h2>
        <br />
        <p>
          {{ produkt.text }}
        </p>

        <div class="price">
          <strong>{{ Intl.NumberFormat().format(produkt.price) }} Kč</strong>
          <p>ID: {{ produkt._id }}</p>
        </div>

        <div class="sharing">
          <a
            :href="
              'https://twitter.com/intent/tweet?text=' +
              `${produkt.name}%20(${produkt.sub})%20v%20@iNvolute.GG%20eshopu%0A%23iNvolute%20%23merch%20%23gaming%20%23esport%20%23czech%20%23cz%20%23cz/sk%0A${location}`
            "
            target="popup"
            rel="noopener noreferrer"
          >
            <i class="fab fa-twitter-square" />
          </a>

          <a
            :href="
              'https://www.facebook.com/sharer/sharer.php?u=' +
              encodeURI(location)
            "
            target="popup"
            rel="noopener noreferrer"
          >
            <i class="fab fa-facebook-square" />
          </a>
        </div>

        <div class="bottom">
          <strong
            >{{ Intl.NumberFormat().format(produkt.stock) }} kusů
            skladem</strong
          >
          <br />
          <button :disabled="produkt.stock <= 0" @click="handleClick">
            <span class="fas fa-shopping-basket" /> Do košíku
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Basket from '../components/eshop/Basket';
import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Basket },
  data() {
    return {
      produkt: {},
      location: window.location.href,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  async created() {
    this.$Progress.start();
    this.produkt = await getData('/produkt', {
      code: true,
      params: [this.$route.params.id],
    });

    if (this.produkt === 400) {
      this.$router.push('/eshop');
      this.$Progress.fail();
    } else {
      this.$Progress.finish();
    }
  },
  methods: {
    handleClick() {
      let el = document.getElementsByClassName('basket')[0];

      el.classList.add('animation');
      setTimeout(() => {
        el.classList.remove('animation');
      }, 1250);

      this.$refs.basket.add(this.produkt);
    },
  },
};
</script>

<style lang="sass" scoped>
.produkt
  background-color: $bgGray
  display: grid
  justify-items: center
  @include small-device-portrait
    padding-bottom: 5%

main
  padding: 2% 0
  display: grid
  column-gap: 5%
  grid-template-columns: ($baselineWidth / 3) (2 * $baselineWidth / 3)
  @include large-device
    grid-template-columns: ($baselineWidth / 3) auto
  @include small-device-portrait
    grid-template-columns: auto
    row-gap: 5%
    padding: 5%
  @include small-device-landscape
    grid-template-columns: ($baselineWidth / 4) auto

  a
    align-self: center
    .zoom-on-hover
      background-color: white
      box-shadow: 10px 10px 10px -8px rgba(0,0,0,0.75)
      &:hover
        cursor: zoom-in
  div
    text-align: left
    h1
      color: $purple
      font-size: 3rem
    p
      margin-bottom: 7.5%
    .price
      strong
        font-size: 2rem
      p
        margin: 10px 0
    .sharing
      a
        font-size: 2.5rem
        margin-right: 10px
        @include transition(filter)
        &:nth-of-type(1)
          color: #1DA1F2
        &:nth-of-type(2)
          color: #3b5998
        &:hover
          filter: brightness(.7)

    .bottom
      margin: 5vh 0
      button
        margin-top: 10px
        @include btn(#2ecc71, #27ae60)
        &:disabled
          filter: brightness(.7)
          background-color: dimgray
          cursor: unset
          &:hover
            background-color: dimgray
</style>
