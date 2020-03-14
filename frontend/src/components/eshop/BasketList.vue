<template>
  <div class="basketlist">
    <div class="header">
      <h1 class="fas fa-shopping-basket"></h1>
      <h2>Košík</h2>
    </div>

    <div class="wrapper" v-if="basket.length !== 0">
      <table>
        <tbody>
          <tr v-for="(polozka, index) in basket" :key="polozka._id">
            <td>
              <router-link :to="`/eshop/produkt/${polozka._id}`"
                >{{ polozka.name }}
              </router-link>
            </td>
            <td>
              <b>{{ polozka.price }} Kč</b>
            </td>
            <td>
              <input
                type="number"
                @change="event => handleChange(event, index)"
                :value="polozka.amount"
              />
              <span class="fas fa-plus" @click="modify('+', index)" />
              <span class="fas fa-minus" @click="modify('-', index)" />
            </td>
            <td>
              <span class="fas fa-times" @click="modify('x', index)" />
            </td>
          </tr>
          <tr>
            <td><b>Součet</b></td>
            <td>{{ Intl.NumberFormat().format(total[0]) + ' Kč' }}</td>
            <td>{{ total[1] }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <h3>Tak prázdný <i class="far fa-frown" /></h3>
      <p>
        Co se takhle si prohlédnout náš produkt
        <router-link :to="`/eshop/produkt/${random._id}`">
          {{ random.name }} ({{ random.sub }})
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { getData } from '../../assets/js/dataFetcher';

export default {
  data() {
    return {
      basket: [],
      total: [],
      random: {},
    };
  },
  watch: {
    basket: 'randomProduct',
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  created() {
    this.basket = JSON.parse(localStorage.getItem('basket')) || [];
    this.total = this.totalHandle();
  },
  methods: {
    save() {
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.total = this.totalHandle();
    },
    modify(symbol, index) {
      if (symbol == '+') {
        this.basket[index].amount += 1;
        this.save();
      } else if (symbol == '-') {
        this.basket[index].amount -= 1;
        if (this.basket[index].amount <= 0) this.basket.splice(index, 1);
        this.save();
      } else if (symbol == 'x') {
        this.basket.splice(index, 1);
        this.save();
      }
    },
    handleChange(event, index) {
      this.basket[index].amount = Number(event.target.value);
      if (this.basket[index].amount <= 0) this.basket.splice(index, 1);

      this.save();
    },
    totalHandle() {
      var totPrice = 0;
      var totAmount = 0;
      this.basket.forEach(element => {
        totPrice += element.price * element.amount;
        totAmount += element.amount;
      });

      return [totPrice, totAmount];
    },
    async randomProduct() {
      if (this.basket.length === 0) {
        this.$Progress.start();
        const produkty = await getData('/produkty');
        this.$Progress.finish();

        this.random = produkty[Math.floor(Math.random() * produkty.length)];
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  background-color: $bgGray
  padding: 30px 0
  h1
    color: $purple
    font-size: 4rem

  h2
    font-size: 2rem
    letter-spacing: 3px
    text-transform: uppercase

.basketlist
  background-color: $bgGray
  display: grid
  justify-items: center

  table
    width: $baselineWidth / 1.5
    text-align: left
    border-collapse: collapse
    margin-bottom: 5%
    tr
      td
        padding: 10px 0
        width: 40%
        &:last-of-type
          span
            color: red
      a
        color: black
        text-decoration: none
        font-weight: bolder
        @include transition(color)
        &:hover
          color: $purple
      input
        width: 40px
      span
        margin: 0 5px
        cursor: pointer
      &:last-of-type
        border-top: 1px black solid
</style>
