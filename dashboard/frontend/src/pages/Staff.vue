<template>
  <main>
    <h1>Staff</h1>
    <div>
      <router-link to="/staff/pridat" class="staff add">
        <a class="fas fa-plus" />
      </router-link>

      <router-link
        :to="'/staff/' + staff.name"
        class="staff"
        v-for="staff in staff"
        :key="staff._id"
        :style="`background: url(${staff.img}), white`"
      >
        <span>
          <a>{{ `${staff.name} (${staff.role})` }}</a>
        </span>
      </router-link>
    </div>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      staff: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.staff = await getData('/staff');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
div
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr))
  grid-gap: 10px
  .staff
    display: flex
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: top center !important
    text-decoration: none
    height: 390px
    max-height: 70vh
    border-radius: 2px
    @include transition(transform)
    span
      align-self: flex-end
      display: block
      text-align: left
      padding: 10px 0 10px 10px
      width: calc( 100% - 10px)
      color: white
      background-color: rgba(black, 0.7)
      a
        font-size: 1.25rem
        @include transition(color)
    &:hover
      transform: scale(.96)
      a
        color: $purple
  .add
    display: grid
    border: 1px solid $grayOutline
    border-radius: 2px
    .fas
      @include transition(color)
      align-self: center
      font-size: 3rem
</style>
