<template>
  <tr>
    <td class="add" colspan="2">
      <select @change="handleChange">
        <option>Přidat</option>
        <option
          v-for="(player, index) in players"
          :key="player._id"
          :value="index"
          >{{ player.name }}</option
        >
      </select>
    </td>
  </tr>
</template>

<script>
import { postData } from '../assets/js/dataFetcher';

export default {
  props: ['gameId', 'players', 'playersPointer'],
  methods: {
    async handleChange(event) {
      const player = this.players[event.target.value];

      if (this.gameId !== undefined) {
        const result = await postData(
          `/hra/${this.gameId}/soupiska`,
          JSON.stringify({ playerId: player._id })
        );

        if (result.status === 202) this.playersPointer.push(player);
        else alert('Vyskytla se chyba');
      } else this.playersPointer.push(player);
    },
  },
};
</script>

<style lang="sass" scoped>
.add
  cursor: pointer
  select
    width: 100%
    padding: 7.5px 5px
    background-color: rgba(white, .8 )
    border: 0
    &:focus
      outline: 0
</style>
