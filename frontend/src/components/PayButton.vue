<template>
  <form action="/process-payment" method="POST">
    <stripe-checkout
      stripe-key="pk_test_sKOXnj2eO5fgsWHkx4EfCfN100g8R3V9xM"
      :product="product"
    >
    </stripe-checkout>
  </form>
</template>

<script>
import { StripeCheckout } from 'vue-stripe';

export default {
  components: {
    'stripe-checkout': StripeCheckout,
  },
  data() {
    return {
      product: {
        name: 'Test',
        description: 'Test',
        amount: 10000,
      },
    };
  },
};
</script>

<style lang="sass">
button
  @include btn($purple, #7a43a1)
  margin-top: 5%
  font-size: 2rem
  text-transform: uppercase
  padding: 20px
</style>
