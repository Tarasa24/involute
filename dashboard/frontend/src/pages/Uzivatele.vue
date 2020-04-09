<template>
  <main>
    <h1>Uživatelé</h1>
    <div class="uzivatele">
      <router-link to="/uzivatel/pridat" class="uzivatel">
        <h1 class="fas fa-user-plus" />
        <h2>Přidat</h2>
        <p></p>
      </router-link>

      <router-link
        :to="'uzivatel/' + uzivatel.name"
        class="uzivatel"
        v-for="uzivatel in uzivatele"
        :key="uzivatel._id"
      >
        <h1 class="fas fa-user" :style="'color:' + tierColors[uzivatel.tier]" />
        <h2>{{ uzivatel.name }}</h2>
        <p>
          Tier: <b>{{ uzivatel.tier }}</b>
        </p>
      </router-link>
    </div>

    <table>
      <tr>
        <th colspan="2">
          Tabulka privilegií
        </th>
      </tr>
      <tr>
        <td>
          <i class="fas fa-circle" :style="'color:' + tierColors[1]" /> Tier 1
        </td>
        <td>
          Může upravovat a vytvářet články
        </td>
      </tr>
      <tr>
        <td>
          <i class="fas fa-circle" :style="'color:' + tierColors[2]" /> Tier 2
        </td>
        <td>
          Může upravovat eshop a vyřizovat objednávky
        </td>
      </tr>
      <tr>
        <td>
          <i class="fas fa-circle" :style="'color:' + tierColors[3]" /> Tier 3
        </td>
        <td>
          Může manipulovat se všemi položkami databáze, vytvářet nové a
          upravovat stávající uživatele
        </td>
      </tr>
      <tr>
        <td><i class="fas fa-circle" style="color: gray;" /> Kdokoliv</td>
        <td>
          Může měnit vlastní profil, monitorovat traffic a databázi
        </td>
      </tr>
    </table>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      uzivatele: null,
      tierColors: {
        1: '#4b68cc',
        2: '#9f05b8',
        3: '#e3c00c',
      },
    };
  },
  async created() {
    this.uzivatele = await getData('/uzivatele');
  },
};
</script>

<style lang="sass" scoped>
.uzivatele
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))
  width: 80%
  column-gap: 5%
  margin: 0 auto 5% auto
  .uzivatel
    display: grid
    box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.1)
    cursor: pointer
    margin-top: 5%
    h1
      margin-bottom: 0
    h2
      font-weight: bold
      margin: 0
    @include transition(transform)
    &:hover
      transform: scale(.95)

table
  margin: 0 auto
  border: 1px $grayOutline solid
  th
    border-bottom: 1px $grayOutline solid
    background-color: $lighterGray
  td
    text-align: left
    &:nth-of-type(1)
      font-weight: bold
      padding-right: 5%
      white-space: nowrap
  th, td
    padding: 5px
  @include small-device-portrait
    td:nth-of-type(1)
      font-size: 0
      i
        font-size: 1rem
</style>
