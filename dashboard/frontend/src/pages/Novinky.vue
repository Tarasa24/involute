<template>
  <main>
    <h1>Novinky</h1>
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
          <select @change="handleChange">
            <option value="Koncepty">Koncepty</option>
            <option value="Připnuté">Připnuté</option>
            <option value="Titulek">Titulek</option>
            <option value="Hra">Hra</option>
            <option value="ID">ID</option>
          </select>
          <input
            type="text"
            placeholder="Řetězec, nebo /regex/"
            value="true"
            disabled
          />
          <button type="submit">Hledat</button>
        </form>
      </div>
    </div>

    <div class="row" v-for="(novinka, index) in novinky" :key="novinka.id">
      <div>
        <a
          class="title"
          :href="'/novinka/' + novinka._id"
          :disabled="novinka.draft"
          >{{ novinka.title }}
        </a>
        <span
          v-if="!novinka.draft"
          @click="handlePinClick(index)"
          :disabled="!novinka.pinned"
          class="fas fa-thumbtack"
        />
        <span v-else title="Koncept" class="fas fa-pencil-ruler" />
      </div>
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
import { getData, putData, deleteData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      novinky: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.novinky = await getData('/novinky/?Koncepty=true');
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
    async handlePinClick(index) {
      var el = this.novinky[index];

      if (!el.pinned)
        if (this.novinky[0].pinned && this.novinky[1].pinned)
          alert(
            'Maximálně 2 články mohou být připnuty naráz!' +
              '\nProsim odeberte špendlík z jednoho z připnutých příspěvků.'
          );
        else {
          const response = await putData('/novinky/pinned/' + el._id);

          if (response.status == 202) {
            el.pinned = true;
            this.sort();
          } else alert('Něco se pokazilo');
        }
      else {
        if (confirm('Opravdu chcete odepnout?')) {
          const response = await deleteData('/novinky/pinned/' + el._id);

          if (response.status == 202) {
            el.pinned = false;
            this.sort();
          } else alert('Něco se pokazilo');
        }
      }
    },
    handleChange(event) {
      if (['Koncepty', 'Připnuté'].includes(event.target.value)) {
        event.target.parentNode.children[1].value = true;
        event.target.parentNode.children[1].disabled = true;
      } else {
        event.target.parentNode.children[1].value = '';
        event.target.parentNode.children[1].disabled = false;
      }
    },
    sort() {
      this.novinky.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        if (a.created > b.created) return -1;
        if (a.created < b.created) return 1;
      });
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
  @include small-device
    margin-top: 10%

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
    @include small-device
      width: 95%
    @include small-device-portrait
      grid-template-columns: 75px auto 70px
      button
        font-size: .9rem

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
  align-items: center
  &:nth-of-type(odd)
    background-color: $lighterGray
  &:nth-of-type(even)
    background-color: $darkerGray
  &:last-of-type
    border-bottom-width: 2px

  .title
    &:hover
      font-weight: bold
    &[disabled]
      pointer-events: none

  .fas
    justify-self: center
    color: $purple
  @include small-device
    width: calc(95% - 20px)
    grid-template-columns: auto 0 0 20px
    i, span
      font-size: 0

  .fa-edit
    position: relative
    &::before
      position: absolute
      top: 50%
      left: 0
      transform: translate(-50%, -50%)

  .fa-thumbtack
    font-size: inherit !important
    margin-left: 5px
    padding: 5px
    transform: rotate(45deg)
    cursor: pointer
    @include transition(color)
    &:hover
      color: $grayOutline
    &[disabled]
      color: $grayOutline
      &:hover
        color: $purple
  .fa-pencil-ruler
    font-size: inherit !important
    margin-left: 5px
    padding: 5px
</style>
