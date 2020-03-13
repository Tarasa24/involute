<template>
  <main>
    <BasketList ref="basket" />
    <div class="header">
      <h1>Doprava a platba</h1>
    </div>

    <div class="wrapper">
      <div class="doprava">
        <form @change="handleChange">
          <span v-for="(value, index) in delivery" :key="index">
            <input
              :checked="Object.keys(delivery).indexOf(index) === 0"
              type="radio"
              name="delivery"
              :id="index"
              :value="index"
            />
            <label :for="index">{{ index }} ({{ value.cost }} Kč)</label>
            <br />
          </span>
        </form>
      </div>

      <div class="platba">
        <form @change="handleChange">
          <span v-for="(value, index) in payment" :key="index">
            <input
              :checked="Object.keys(payment).indexOf(index) === 0"
              type="radio"
              name="payment"
              :id="value.id"
              :value="index"
            />
            <label :for="value.id">{{ index }} ({{ value.cost }} Kč)</label>
            <br />
          </span>
        </form>
      </div>
    </div>
    <br />
    <div class="recap">
      <table>
        <tbody>
          <tr>
            <td>
              <img :src="delivery[data.delivery].img" :alt="data.delivery" />
            </td>
            <td>
              <div>
                <h4>
                  {{ data.delivery }} - {{ data.payment }} -
                  {{ Intl.NumberFormat().format(totalDeliveryCost()) }} Kč
                </h4>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="adresa">
      <h1>Dodací adresa:</h1>
      <form class="wrapper" @submit="handleSubmit">
        <div>
          <div class="jmeno_prijmeni">
            <label>Jméno *</label>
            <label>Příjmení *</label>
            <input required type="text" name="Jmeno" />
            <input required type="text" name="Příjmení" />
          </div>
          <label>Ulice a číslo popisné *</label>
          <input required type="text" name="Ulice" />
          <label>Město *</label>
          <input required type="text" name="Město" />
          <label>PSČ *</label>
          <input required type="text" name="PSČ" />
        </div>
        <div>
          <label>Email *</label>
          <input required type="email" name="Email" />
          <label>Telefonní číslo *</label>
          <input required type="tel" name="Phone" />
          <label>Slevový kupón</label>
          <input type="text" name="Slevový kupón" />
        </div>

        <div class="fakturacni">
          <input type="checkbox" id="fakturacni" @change="fakturaHandle" />
          <label for="fakturacni">Fakturační adresa je jiná než dodací</label>
        </div>

        <div v-if="fakturacni">
          <label>Jméno a příjmení nebo Firma *</label>
          <input
            required
            type="text"
            name="Fakturační Jméno a příjmení nebo Firma"
          />
          <label>Ulice a číslo popisné *</label>
          <input required type="text" name="Fakturační Ulice a číslo popisné" />
          <label>Město *</label>
          <input required type="text" name="Fakturační Město" />
          <label>PSČ *</label>
          <input required type="text" name="Fakturační PSČ" />
          <label>IČ *</label>
          <input required type="text" name="Fakturační IČ" />
          <label>DIČ *</label>
          <input required type="text" name="Fakturační DIČ" />
        </div>

        <div class="objednat">
          <strong>
            Objednáním souhlasíte s
            <a href="/podminky" target="_blank" rel="noopener noreferrer">
              obchodními podmínkami
            </a>
          </strong>

          <h1>
            <b>Cena celkem: </b>
            {{ Intl.NumberFormat().format(total()) }} Kč
          </h1>

          <input
            v-if="data.payment != 'Online kartou'"
            type="submit"
            value="Objednat"
          />
          <PayButton v-else />
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import BasketList from '../components/BasketList';
import PayButton from '../components/PayButton';

import { postData } from '../assets/js/dataFetcher';

export default {
  components: { BasketList, PayButton },
  data() {
    return {
      basket: { total: [0, 0] },
      data: { delivery: 'Zásilkovna', payment: 'Bankovní převod' },
      delivery: {
        Zásilkovna: { img: '/img/delivery/zasilkovna.png', cost: 49 },
        'DPD kurýr': { img: '/img/delivery/dpd.png', cost: 79 },
        'Česká pošta': { img: '/img/delivery/cp.png', cost: 89 },
      },
      payment: {
        'Bankovní převod': { id: 'převod', cost: 0 },
        'Online kartou': { id: 'online', cost: 0 },
        Dobírkou: { id: 'dobírka', cost: 30 },
      },
      fakturacni: false,
    };
  },
  mounted() {
    this.basket = this.$refs.basket;
  },
  methods: {
    handleChange(event) {
      this.data[event.target.name] = event.target.value;
    },
    fakturaHandle(event) {
      this.fakturacni = event.target.checked;
    },
    async handleSubmit(event) {
      event.preventDefault();
      const formElements = event.target.elements;

      var adress = {};
      var fakturacni = {};
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (i === formElements.length - 1) break;
        else if (element.name === '') continue;

        if (!element.name.includes('Fakturační'))
          adress[element.name] = element.value;
        else
          fakturacni[element.name.replace('Fakturační ', '')] = element.value;
      }

      if (Object.keys(fakturacni).length !== 0) adress.Fakturační = fakturacni;

      const coupon = adress['Slevový kupón'];
      delete adress['Slevový kupón'];

      const toSend = {
        basket: this.$refs.basket.basket,
        adress: adress,
        delivery: this.data,
        coupon: coupon,
        totalPrice: this.total(),
      };

      const result = await postData('/objednat', JSON.stringify(toSend));

      if (result.status === 400) {
        alert(await result.text());
      } else if (result.ok) {
        this.$router.push('/eshop/platba');
      }
    },
    totalDeliveryCost() {
      const delCost = this.delivery[this.data.delivery].cost;
      const payCost = this.payment[this.data.payment].cost;

      return delCost + payCost;
    },
    total() {
      const basketTotal = this.basket.total[0];
      const deliveryTotal = this.totalDeliveryCost();

      return Math.round(basketTotal + deliveryTotal);
    },
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  color: black
  padding-bottom: 5vh
  display: grid
  justify-items: center

.header
  background-color: $bgGray
  padding: 30px 0
  h1
    font-size: 2rem
    letter-spacing: 3px
    text-transform: uppercase

.wrapper
  display: inline-flex
  text-align: left
  input,label
    cursor: pointer
  div
    margin: 0 4vw
  input[type=radio]
    border: 0px
    width: 1.5em
    height: 1.5em
  label
    position: relative
    bottom: 4px
.recap
  display: grid
  justify-items: center
  padding-top: 1%
  margin-bottom: 1%
  border-top: 1px solid black
  width: $baselineWidth / 2
  td
    padding: 0
  img
    object-fit: cover
    max-height: 50px
    width: auto
    padding-right: 5%
  div
    margin: 0

.adresa
  text-align: left
  h1
    font-weight: normal
  .wrapper
    display: grid
    width: $baselineWidth
    grid-template-columns: repeat(2, 50%)
    justify-items: start
    input,label
      cursor: auto
    div
      margin: 0
      padding: 10px
      label
        position: relative
        top: 0
        font-size: 1.25rem
      input[type="text"], input[type="email"], input[type="tel"]
        border-radius: .25rem
        border: 1px solid #ced4da
        padding: .5rem 0
        padding-left: 5px
        width: 100%
        margin-bottom: 10px
      .jmeno_prijmeni
        padding: 0
        display: grid
        grid-template-columns: repeat(2, 50%)
        *:nth-of-type(1)
          margin-right: 2.5%
          width: 97.5%
        *:nth-of-type(2)
          margin-left: 2.5%
          width: 97.5%
    .fakturacni
      input,label
        cursor: pointer
      label
        font-size: 1rem
    .objednat
      grid-row: 2 / span 3
      grid-column: 2
      input[type="submit"]
        @include btn($purple, #7a43a1)
        margin-top: 5%
        font-size: 2rem
        text-transform: uppercase
        padding: 20px
      h1
        font-weight: normal
</style>
