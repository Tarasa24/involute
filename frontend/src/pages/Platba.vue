<template>
  <main>
    <Header>
      <h1>Platba online</h1>
      <h3>Prosím vyplňte údaje Vaší karty</h3>
    </Header>

    <form id="payment-form" @submit="handleSubmit">
      <div id="card-element" @change="handleChange" />
      <button id="submit">Odeslat</button>
    </form>
  </main>
</template>

<script>
import Header from '../components/misc/Header';

import { loadStripe } from '@stripe/stripe-js';

export default {
  components: { Header },
  data() {
    return {
      stripe: null,
      client_secret: '',
      card: null,
    };
  },
  async created() {
    this.client_secret = this.$route.query.client_secret;
    this.stripe = await loadStripe(
      'pk_test_sKOXnj2eO5fgsWHkx4EfCfN100g8R3V9xM'
    );

    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#303238',
        fontSize: '1.5rem',
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#CFD7DF',
        },
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238',
        },
      },
    };

    const card = elements.create('card', { style, hidePostalCode: true });
    card.mount('#card-element');
    this.card = card;
  },
  methods: {
    handleChange(event) {
      const error = event.error;
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    },
    async handleSubmit(event) {
      event.preventDefault();

      const result = await this.stripe.confirmCardPayment(this.client_secret, {
        payment_method: {
          card: this.card,
        },
      });

      if (result.error) {
        alert(
          `Stripe: "${result.error.message}"\nPokud se domníváte, že toto nemáte vidět, kontaktujte nás prosím`
        );
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          this.$router.replace({
            path: '/eshop/objednavka/online',
            query: { id: this.$route.query.id },
          });
        }
      }
    },
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  display: grid
  justify-items: center
  align-items: center

form
  padding: 5% 0
  width: 550px

button
  @include btn($purple, #7f0c91)
  margin-top: 10%
  font-size: 2rem
  text-transform: uppercase
  padding: 20px
</style>
