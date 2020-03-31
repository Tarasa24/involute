<template>
  <main>
    <div>
      <div class="header">
        <h2>Přidat nový článek</h2>
        <router-link to="/novinka/pridat" class="fas fa-plus-circle" />
      </div>
      <div class="nebo">
        <hr />
        <span>nebo</span>
      </div>

      <div class="vyhledat">
        <h2>Vyhledat</h2>
        <form class="wrapper" @submit="handleSubmit">
          <select>
            <option value="Titulek">Titulek</option>
            <option value="Hra">Hra</option>
            <option value="Datum">Datum</option>
            <option value="ID">ID</option>
          </select>
          <input type="text" placeholder="Řetězec, /regex/ nebo nic" />
          <button type="submit">Hledat</button>
        </form>
      </div>
    </div>

    <div class="row" v-for="novinka in novinky" :key="novinka.id">
      <a class="title" :href="'/novinka/' + novinka._id">{{ novinka.title }}</a>
      <i>{{ novinka.game }}</i>
      <span>{{
        new Date(novinka.date * 1000).toLocaleDateString('cs', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }}</span>
      <router-link :to="'/novinka/' + novinka._id" class="fas fa-edit" />
    </div>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      novinky: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.novinky = await getData(`/novinky`);
    this.$Progress.finish();
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();
      const formElements = event.target.elements;
      const key = formElements[0].value;
      const value = formElements[1].value;

      this.$Progress.start();
      this.novinky = await getData(`/novinky?${key}=${value}`);
      this.$Progress.finish();
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  h2
    color: gray
  a
    font-size: 4.5rem
    color: $purple

.nebo
  margin-top: 2.5%
  hr
    border-top: 1px $darkerGray solid
    width: 80%
  span
    position: relative
    bottom: 20px
    color: $darkerGray
    background-color: white
    font-weight: bold
    display: block
    margin: 0 auto
    width: 80px

.vyhledat
  h2
    margin-bottom: 10px
  .wrapper
    width: 80%
    margin: 0 auto 5% auto
    display: grid
    grid-template-columns: 150px auto 95px
    *
      width: 100%
      &:focus
        outline: 0
    input
      border: 2px $grayOutline solid
      width: calc( 100% - 23px )
      padding: 10px
      font-size: 1rem
      &::placeholder
        color: $grayOutline
    select
      border: 2px $grayOutline solid
      border-right: 0
      background-color: $darkerGray
    button
      @include btn($purple)
      box-shadow: 0

.row
  display: grid
  text-align: left
  width: calc(80% - 20px)
  margin: 0 auto
  padding: 10px
  grid-template-columns: 250px auto 120px 20px
  border: 2px $grayOutline solid
  border-bottom-width: 0
  border-radius: 2px
  &:nth-of-type(odd)
    background-color: $lighterGray
  &:nth-of-type(even)
    background-color: $darkerGray
  &:last-of-type
    border-bottom-width: 2px

  .title
    &:hover
      font-weight: bold

  .fas
    justify-self: center
    color: $purple
</style>
