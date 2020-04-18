<template>
  <main>
    <div class="wrapper">
      <form class="row new" @submit="handleSave">
        <GameIcon v-model="newOceneni.game" :icons="icons" />
        <div class="award-info">
          <input
            type="text"
            placeholder="Turnaj"
            v-model="newOceneni.title"
            required
          />
          <input
            type="text"
            placeholder="Hráč(i)"
            v-model="newOceneni.player"
          />
        </div>
        <input
          class="award-place"
          type="text"
          placeholder="#."
          v-model="newOceneni.placement"
          required
        />
        <div class="controls">
          <button type="submit" class="fas fa-save" />
        </div>
      </form>

      <form
        class="row"
        v-for="oceneni in data"
        :key="oceneni._id"
        @submit="event => handleEdit(event, oceneni)"
      >
        <GameIcon v-model="oceneni.game" :icons="icons" />
        <div class="award-info">
          <input type="text" v-model="oceneni.title" required />
          <input type="text" v-model="oceneni.player" />
        </div>
        <input class="award-place" type="text" v-model="oceneni.placement" />
        <div class="controls">
          <button type="submit" class="fas fa-edit" />
          <button
            type="button"
            class="fas fa-trash-alt"
            @click="handleDelete(oceneni)"
          />
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import GameIcon from '../components/GameIcon';
import {
  getData,
  putData,
  postData,
  deleteData,
} from '../assets/js/dataFetcher';

export default {
  components: { GameIcon },
  data() {
    return {
      data: {},
      icons: [],
      newOceneni: {},
    };
  },
  async created() {
    this.$Progress.start();
    this.data = await getData('/oceneni');
    this.icons = await getData('/icons');
    this.$Progress.finish();
  },
  methods: {
    async handleSave(event) {
      event.preventDefault();

      const response = await putData(
        '/oceneni',
        JSON.stringify(this.newOceneni)
      );
      if (response.status == 202) this.$router.go();
      else alert('Vyskytla se chyba');
    },
    async handleEdit(event, oceneni) {
      event.preventDefault();

      const _id = oceneni._id;
      delete oceneni._id;

      for (let i = 0; i < this.icons.length; i++) {
        if (this.icons[i].name === oceneni.game) {
          oceneni.game = this.icons[i]._id;
          break;
        }
      }

      const response = await postData(
        '/oceneni/' + _id,
        JSON.stringify(oceneni)
      );
      if (response.status == 202) this.$router.go();
      else alert('Vyskytla se chyba');
    },
    async handleDelete(oceneni) {
      if (confirm('Opravdu chcete toto ocenění smazat?')) {
        const response = await deleteData('/oceneni/' + oceneni._id);
        if (response.status == 202) this.$router.go();
        else alert('Vyskytla se chyba');
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  display: grid
  justify-items: center
  padding-bottom: 5%
  .row
    width: 80%
    min-height: 60px
    display: grid
    grid-template-columns: 80px auto 80px 40px
    align-items: center
    padding: 0.5rem 0
    border-bottom: 1px solid $purple
    &:nth-of-type(odd)
      background-color: $darkerGray
    &:nth-of-type(even)
      background-color: $lighterGray
    @include large-device
      width: 100%
    @include small-device-portrait
      grid-template-columns: 45px auto 45px 30px
    .award-info
      text-align: left
    .award-place
      font-weight: bolder
      font-size: 1.3rem
      @include small-device-portrait
        font-size: 1rem
  .new
    background-color: $darkerGray !important

input
  width: 100%
  background-color: transparent
  border: 0
  font-family: Roboto
  font-weight: normal
  &:nth-of-type(1)
    font-size: 1.15rem
  &:nth-of-type(2)
    color: $purple
    font-size: 16px
  &:focus
    outline: 0
  &[class="award-place"]
    text-align: center
  @include small-device-portrait
    &:nth-of-type(1)
      font-size: 1rem
    &:nth-of-type(2)
      font-size: .9rem

.controls
  display: grid
  .fas
    background-color: transparent
    border: 0
    font-size: 1rem
    cursor: pointer
    margin: 5px auto
    &:nth-of-type(1)
      color: $acceptGreen
    &:nth-of-type(2)
      color: $deleteRed
</style>
