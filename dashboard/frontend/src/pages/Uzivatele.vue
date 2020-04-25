<template>
  <main>
    <h1>Uživatelé</h1>
    <div class="uzivatele">
      <router-link v-if="admin" to="/uzivatel/pridat" class="uzivatel">
        <h1 class="fas fa-user-plus" />
        <h2>Přidat</h2>
      </router-link>

      <router-link
        :to="'uzivatel/' + uzivatel.name"
        class="uzivatel"
        v-for="uzivatel in uzivatele"
        :key="uzivatel._id"
      >
        <h1
          class="fas fa-user"
          :style="uzivatel.admin ? 'color: #ffd500' : ''"
          :title="uzivatel.admin ? 'Admin' : ''"
        />
        <h2>{{ uzivatel.name }}</h2>
      </router-link>
    </div>
  </main>
</template>

<script>
import { getData, getTokenPayload } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      uzivatele: [],
      admin: false,
    };
  },
  async created() {
    this.$Progress.start();
    this.uzivatele = await getData('/uzivatele');
    const { admin } = await getTokenPayload();
    this.admin = admin;
    this.$Progress.finish();
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
    .fa-user
      color: $purple
    h2
      font-weight: bold
      margin-top: 0
    @include transition(transform)
    &:hover
      transform: scale(.95)
</style>
