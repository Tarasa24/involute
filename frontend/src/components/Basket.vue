<template>
  <div>
    <router-link to="/eshop/kosik" class="basket">
      <span class="fas fa-shopping-basket" /> Košík
    </router-link>

    <span class="tooltip">
      <table>
        <tbody>
          <tr v-for="polozka in basket" :key="polozka._id">
            <td>{{ polozka.name }}</td>
            <td>{{ polozka.amount }}x</td>
          </tr>
        </tbody>
      </table>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basket: [],
    };
  },
  created() {
    this.basket = JSON.parse(localStorage.getItem('basket')) || [];
  },
  methods: {
    add(produkt) {
      let basket = [];

      if (localStorage.getItem('basket') === null) {
        localStorage.setItem('basket', JSON.stringify(basket));
      }

      basket = JSON.parse(localStorage.getItem('basket'));

      var found = false;
      basket.forEach((element, index) => {
        if (element._id === produkt._id) {
          found = true;
          basket[index] = {
            _id: produkt._id,
            name: produkt.name,
            price: produkt.price,
            amount: element.amount + 1,
          };
        }
      });

      if (!found) {
        basket.push({
          _id: produkt._id,
          name: produkt.name,
          price: produkt.price,
          amount: 1,
        });
      }

      localStorage.setItem('basket', JSON.stringify(basket));

      this.basket = basket;
    },
  },
};
</script>

<style lang="sass" scoped>
@keyframes shake
  10%, 90%
    transform: translate3d(-1px, 0, 0)

  20%, 80%
    transform: translate3d(2px, 0, 0)

  30%, 70%
    transform: translate3d(-4px, 0, 0)

  50%
    transform: translate3d(-4px, 0, 0)
    opacity: .8

  40%, 60%
    transform: translate3d(4px, 0, 0)

.basket
  @include btn(white, white)
  position: fixed
  top: 2%
  right: 2%
  z-index: 9

  color: black
  text-decoration: none
  padding: 10px
  width: 40px
  opacity: .4
  @include transition(opacity)
  @include large-device
    top: unset
    bottom: 2%
  &:hover
    opacity: 1
    & ~ .tooltip
      opacity: 1
  &.animation
    animation: shake 1.25s linear

.tooltip
  text-align: left
  opacity: 0
  position: fixed
  top: 2%
  right: 7%
  z-index: 9
  color: white
  @include transition(opacity)
  background-color: rgba(0, 0, 0, .5)
  @include large-device
    top: unset
    bottom: 10%
    right: 2%
</style>
