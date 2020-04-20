<template>
  <main>
    <h1>Seznam her</h1>

    <div
      v-for="(game, gameIndex) in games"
      :key="game._id"
      class="game"
      :id="game.name"
      :style="
        'background: linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.6)), url(' +
        game.bg +
        ')'
      "
    >
      <i
        class="far fa-edit edit"
        title="Přidat hlavní náhledový obrázek"
        @click="handleClick(game._id, 0)"
      />
      <i class="fas fa-times close" @click="handleDelete(gameIndex)" />
      <FileUpload
        :ref="game._id"
        v-model="game.bg"
        @input="handleUpload(game._id, 'bg')"
      />
      <br />
      <div class="title">
        <button
          class="icon"
          v-if="game.icon.length === 0"
          @click="handleClick(game._id, 1)"
        >
          Přidat ikonu
        </button>
        <img
          v-else
          :src="game.icon"
          alt="Icon"
          title="Změnit ikonu"
          @click="handleClick(game._id, 1)"
        />
        <FileUpload
          :ref="game._id"
          v-model="game.icon"
          @input="handleUpload(game._id, 'icon')"
        />

        <input
          type="text"
          placeholder="Název hry"
          v-model="game.name"
          required
          @change="event => handleChange(game._id, event)"
        />
      </div>

      <h2>Soupiska</h2>
      <table class="players">
        <tbody>
          <tr v-for="(player, playerIndex) in game.players" :key="player._id">
            <td>{{ player.name }}</td>
            <td @click="handlePlayerRemove(gameIndex, playerIndex)">
              <i class="fas fa-times" />
            </td>
          </tr>

          <tr class="spacer">
            <td colspan="2"></td>
          </tr>
          <PlayerList
            :gameId="game._id"
            :players="filterPlayers(allPlayers, game.players)"
            :playersPointer="game.players"
          />
        </tbody>
      </table>
    </div>

    <h1>Přidat hru</h1>

    <form
      class="game"
      id="new"
      :style="
        'background: linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.6)), url(' +
        newGame.bg +
        ')'
      "
      @submit="handleSubmit"
    >
      <i
        class="far fa-edit edit"
        title="Přidat hlavní náhledový obrázek"
        @click="handleClick('newGame1')"
      />
      <FileUpload ref="newGame1" v-model="newGame.bg" />
      <br />
      <div class="title">
        <button
          class="icon"
          v-if="newGame.icon.length === 0"
          type="button"
          @click="handleClick('newGame2')"
        >
          Přidat ikonu
        </button>
        <img
          v-else
          :src="newGame.icon"
          alt="Icon"
          title="Změnit ikonu"
          @click="handleClick('newGame2')"
        />
        <FileUpload ref="newGame2" v-model="newGame.icon" />

        <input
          type="text"
          placeholder="Název hry"
          v-model="newGame.name"
          required
        />
      </div>
      <button type="submit">Uložit</button>
    </form>
  </main>
</template>

<script>
import FileUpload from '../components/FileUpload';
import PlayerList from '../components/PlayerList';
import {
  getData,
  deleteData,
  postData,
  putData,
} from '../assets/js/dataFetcher';

export default {
  components: { FileUpload, PlayerList },
  data() {
    return {
      games: [],
      newGame: { icon: '', players: [] },
      allPlayers: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.games = await getData('/hry');
    this.allPlayers = await getData('/hraci?img=false');
    this.$Progress.finish();
  },
  methods: {
    filterPlayers(allPlayers, skip) {
      var players = [];
      for (let i = 0; i < allPlayers.length; i++) {
        var found = false;
        for (let e = 0; e < skip.length; e++) {
          if (allPlayers[i]._id === skip[e]._id) {
            found = true;
            break;
          }
        }
        if (!found) players.push(allPlayers[i]);
      }
      return players;
    },
    handleClick(id, index) {
      if (index !== undefined) this.$refs[id][index].open();
      else this.$refs[id].open();
    },
    async handlePlayerRemove(gameIndex, playerIndex) {
      const gameId = this.games[gameIndex]._id;
      const playerId = this.games[gameIndex].players[playerIndex]._id;

      const result = await deleteData(
        `/hra/${gameId}/soupiska`,
        JSON.stringify({ playerId: playerId })
      );

      if (result.status === 202)
        this.games[gameIndex].players.splice(playerIndex, 1);
      else alert('Vyskytla se chyba');
    },
    async handleUpload(gameId, key) {
      const result = await postData(
        `/hra/${gameId}/${key}`,
        JSON.stringify({ [key]: event.target.result })
      );
      if (result.status !== 202) alert('Vyskytla se chyba');
    },
    async handleSubmit(event) {
      event.preventDefault();

      const result = await putData('/hra', JSON.stringify(this.newGame));
      if (result.status === 202) {
        const { id } = await result.json();
        this.newGame._id = id;
        this.games.push(this.newGame);
        this.newGame = { icon: '', players: [] };
      } else alert('Vyskytla se chyba');
    },
    async handleDelete(gameIndex) {
      const gameId = this.games[gameIndex]._id;

      if (confirm('Opravdu chete tuto hru smazat?')) {
        const result = await deleteData(`/hra/${gameId}`);

        if (result.status === 202) this.games.splice(gameIndex, 1);
        else alert('Vyskytla se chyba');
      }
    },
    async handleChange(gameId, event) {
      const result = await postData(
        `/hra/${gameId}/name`,
        JSON.stringify({ name: event.target.value })
      );
      if (result.status !== 202) alert('Vyskytla se chyba');

      event.target.classList.add('flash');
      setTimeout(() => {
        event.target.classList.remove('flash');
      }, 1000);
    },
  },
};
</script>

<style lang="sass" scoped>
.game
  text-align: center
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  margin-bottom: 5%
  padding: 20px 0
  max-width: 100%
  position: relative
  .edit
    font-size: 2.5rem
    color: white
    margin: 2.5% auto
    cursor: pointer
    opacity: .2
    @include transition(opacity)
    &:hover
      opacity: 1
  .close
    position: absolute
    top: 10px
    right: 10px
    color: white
    padding: 10px
    font-size: 1.5rem
    cursor: pointer
    @include transition(color)
    &:hover
      color: $deleteRed

.title
  width: 90%
  margin: 7vh auto
  img, .icon
    width: 60px
    cursor: pointer
    justify-self: right
  .icon
    min-height: 55px
    color: white
    border: 1px solid white
    background-color: transparent
    &:focus
      outline: 0
    opacity: .3
    @include transition(opacity)
    &:hover
      opacity: 1
  input
    text-align: center
    color: white
    font-size: 2rem
    font-weight: bolder
    width: calc( 100% - 20px )
    padding: 10px
    border: 0
    background-color: transparent
    &::placeholder
      color: $darkerGray
    &:focus
      outline: 0
    @include small-device-portrait
      font-size: 1rem

h2
  color: white

.players
  margin: 0 auto 2.5% auto
  color: white
  border-collapse: collapse
  text-align: left
  width: 150px
  td:nth-of-type(2)
    cursor: pointer
    color: $deleteRed
    text-align: center
  tr
    &:nth-of-type(odd)
      background-color: rgba($lighterGray, .1 )
    &:nth-of-type(even)
      background-color: rgba($darkerGray, .2 )
    td
      padding: 7.5px 5px
  .spacer
    line-height: 1px
    td
      padding: 5px 0

button[type="submit"]
  @include btn($acceptGreen)
</style>

<style lang="sass" scoped>
.flash
  animation: flash 1s ease
@keyframes flash
  0%
    color: white
  45%, 55%
    color: $acceptGreen
  100%
    color: white
</style>
