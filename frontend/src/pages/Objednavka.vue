<template>
  <main>
    <Header>
      <h1>Objenávka byla odeslána</h1>
      <h3>č. {{ id }}</h3>
    </Header>
    <div v-if="$route.params.type === 'převod'">
      <p>
        Vaši objednávku zpracujeme po obržení platby. <br />O jejím stavu Vás
        budeme informovat skrze email.
      </p>
      <table>
        <tbody>
          <tr>
            <td>Číslo účtu:</td>
            <td>35-3355550267/0100</td>
          </tr>
          <tr>
            <td>Variabilní symbol:</td>
            <td>{{ var_sym }}</td>
          </tr>
          <tr>
            <td>Částka:</td>
            <td>{{ Intl.NumberFormat().format(price) }} Kč</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="$route.params.type === 'online'">
      <p>
        Online platba byla úspšně vyřízena. <br />O stavu Vaší objednávky Vás
        budeme informovat skrze email.
      </p>
    </div>

    <div v-else-if="$route.params.type === 'dobírka'">
      <p>
        Vaši objednávku zpracováváme. O jejím stavu Vás budeme informovat skrze
        email.
      </p>
    </div>

    <h2>Děkujeme za Váš nákup ❤️</h2>
  </main>
</template>

<script>
import Header from '../components/misc/Header';

export default {
  components: { Header },
  data() {
    return {
      id: '',
      var_sym: '',
      price: 1000,
    };
  },
  mounted() {
    if (!['převod', 'online', 'dobírka'].includes(this.$route.params.type))
      this.$router.replace('/eshop');
  },
  created() {
    this.id = this.$route.query.id;

    const incremental = this.id.substring(this.id.length - 6, this.id.length);
    this.var_sym = parseInt(incremental, 16);
  },
};
</script>

<style lang="sass" scoped>
main
  display: grid
  background-color: $bgGray
  padding-bottom: 20px
  justify-items: center
  h2
    margin-top: 40px
  p
    font-size: 1.5rem
    @include small-device-portrait
      font-size: .95rem

table
  width: 330px
  margin: auto
  text-align: left
  td
    &:first-of-type
      font-weight: bold
</style>
