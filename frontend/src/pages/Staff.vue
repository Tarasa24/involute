<template>
  <main>
    <Header><h1>Staff</h1></Header>
    <div class="container">
      <div v-for="(categoryArr, category) in staff" :key="category">
        <h3>{{ category }}</h3>
        <div class="portraits">
          <router-link
            :to="'/staff/' + staffProfile.name"
            v-for="staffProfile in categoryArr"
            :key="staffProfile._id"
          >
            <img src="https://placekitten.com/400/505" alt="Portrét" /><br />
            <strong>
              {{ staffProfile.name }}
            </strong>
            <br />
            {{ staffProfile.role }}
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';
import Header from '../components/misc/Header';

export default {
  components: { Header },
  data() {
    return {
      staff: {},
    };
  },
  async created() {
    this.$Progress.start();
    this.staff = await getData('/staff', {
      code: true,
    });
    if (this.staff == 404) {
      this.$Progress.fail();
      this.$router.replace('/staff');
    } else this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  padding: 2% 0

.container
  width: $baselineWidth
  max-width: $maxWidth
  margin: auto
  @include medium-device
    width: 90%

h3
  text-transform: uppercase
  text-align: left
  color: $purple
  font-size: 2.2rem
  margin-bottom: 10px
  @include medium-device
    font-size: 1.5rem

.portraits
  display: flex
  justify-self: center
  align-items: baseline
  overflow: auto
  max-width: 100%
  margin: 0 20px
  @include scrollbar(5px, gray, transparent)
  @include large-device
    justify-self: start
  @include medium-device
    width: auto
  a
    text-decoration: none
    color: black
    margin: 0 10px 25px 0
    width: 210px
    img
      max-width: 190px
      max-height: 210px
</style>
