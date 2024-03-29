<template>
  <main>
    <div class="mugshot" @click="handleClick">
      <img :src="player.img" :alt="player.name" />
      <span
        :style="
          newPlayer || this.player.img == undefined
            ? 'color: gray; opacity: 1; visibility: visible'
            : ''
        "
      >
        <b>Změnit portrét</b>
      </span>
    </div>
    <form @submit="handleSubmit">
      <input
        type="text"
        class="name"
        v-model="player.name"
        placeholder="Jméno"
        required
      />
      <input
        type="text"
        class="role"
        v-model="player.role"
        placeholder="Role v týmu"
      />

      <h2>About</h2>
      <table>
        <tr v-for="(a, q) in player.about" :key="q">
          <td>{{ q }}</td>
          <td>
            <input type="text" v-model="player.about[q]" />
          </td>
        </tr>
      </table>

      <h2>Sestava</h2>
      <table>
        <tr v-for="(a, q) in player.sestava" :key="q">
          <td>{{ q }}</td>
          <td>
            <input type="text" v-model="player.sestava[q]" />
          </td>
        </tr>
      </table>

      <h2>Odkazy</h2>
      <table>
        <tbody>
          <tr>
            <td><i class="fab fa-facebook" /> Facebook</td>
            <td>
              <input
                type="url"
                v-model="player.links.facebook"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-instagram" /> Instagram</td>
            <td>
              <input
                type="url"
                v-model="player.links.instagram"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-twitch" /> Twitch</td>
            <td>
              <input
                type="url"
                v-model="player.links.twitch"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-twitter" /> Twitter</td>
            <td>
              <input
                type="url"
                v-model="player.links.twitter"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fas fa-link" /> Web</td>
            <td>
              <input
                type="url"
                v-model="player.links.web"
                placeholder="https://"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!newPlayer">
        <button type="submit">Uložit</button>
        <button type="button" @click="handleDelete">Odstranit</button>
      </div>
      <div v-else>
        <button type="submit">Vytvořit</button>
      </div>
    </form>
    <FileUpload ref="FileUpload" v-model="player.img" />
  </main>
</template>

<script>
import FileUpload from '../components/FileUpload';
import {
  getData,
  postData,
  putData,
  deleteData,
} from '../assets/js/dataFetcher';

export default {
  props: { newPlayer: { type: Boolean } },
  components: { FileUpload },
  data() {
    return {
      player: {
        about: {},
        sestava: {},
        links: {},
      },
    };
  },
  async created() {
    if (!this.newPlayer) {
      this.$Progress.start();
      this.player = await getData('/hrac/' + this.$route.params.name);
      this.$Progress.finish();
    }

    const about = {
      Věk: '',
      'Co rád dělám?': '',
      'Proč právě má hra?': '',
      'Co mě přitahuje k esportu?': '',
    };
    if (this.player.about)
      for (const q of Object.keys(this.player.about)) {
        if (Object.keys(about).includes(q)) about[q] = this.player.about[q];
      }
    this.player.about = about;

    const sestava = {
      'Základní deska': '',
      Procesor: '',
      'Grafická Karta': '',
      Monitor: '',
      Klávesnice: '',
      Myš: '',
      Sluchátka: '',
    };
    if (this.player.sestava)
      for (const q of Object.keys(this.player.sestava)) {
        if (Object.keys(sestava).includes(q))
          sestava[q] = this.player.sestava[q];
      }
    this.player.sestava = sestava;
  },
  methods: {
    handleClick() {
      this.$refs.FileUpload.open();
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName].length === 0) {
          delete obj[propName];
        }
      }
    },
    async handleSubmit(event) {
      event.preventDefault();

      this.$Progress.start();
      let result;
      if (this.newPlayer)
        result = await putData('/hrac', JSON.stringify(this.player));
      else {
        const player = Object.assign({}, this.player);
        delete player._id;

        this.clean(player.about);
        this.clean(player.sestava);
        this.clean(player.links);

        result = await postData(
          '/hrac/' + this.player._id,
          JSON.stringify(player)
        );
      }

      if (result.status == 202) {
        this.$Progress.finish();
        this.$router.push('/hraci');
      } else {
        this.$Progress.fail();
        alert('Vyskytla se chyba');
      }
    },
    async handleDelete() {
      if (confirm(`Opravdu chcete hráče "${this.player.name}" odstranit?`)) {
        this.$Progress.start();
        const result = await deleteData('/hrac/' + this.player._id);
        if (result.status == 202) {
          this.$Progress.finish();
          this.$router.push('/hraci');
        } else {
          this.$Progress.fail();
          alert('Vyskytla se chyba');
        }
      }
    },
  },
};
</script>

<style lang="sass" scoped>
main
  display: grid
  grid-template-columns: 30% auto
  @include small-device
    grid-template-columns: 100%

input
  text-align: center
  border: 0
  padding: 5px
  width: calc( 90% - 10px )
  &:focus
    outline: 1px solid $grayOutline
  &.name
    font-size: 2rem
  &.role
    font-size: 1.2rem

h2
  margin: 0

table
  text-align: left
  margin: 20px auto
  width: 90%
  border: 1px solid $grayOutline
  tr
    &:nth-of-type(odd)
      background-color: $lighterGray
    &:nth-of-type(even)
      background-color: $darkerGray
  td
    padding: 0 5px
  input
    text-align: left
    font-size: 1rem
    width: calc( 100% - 10px )
    background-color: transparent
    &:focus
      outline: 0
  .fab, .fas
    @include small-device-portrait
      display: none

.mugshot
  display: grid
  position: relative
  text-align: center
  color: white
  margin: 10px auto
  width: 90%
  img
    align-self: center
    justify-self: center
    width: 100%
    @include small-device
      width: auto
      max-width: 100%
      max-height: 60vh
    @include transition(filter)
  span
    visibility: hidden
    opacity: 0
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    @include transition(opacity)
  &:hover
    cursor: pointer
    img
      filter: brightness(.9)
    span
      visibility: visible
      opacity: 1

button
  margin: 10px
  &:nth-of-type(1)
    @include btn($acceptGreen)
  &:nth-of-type(2)
    @include btn($deleteRed)
</style>
