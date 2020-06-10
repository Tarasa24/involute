<template>
  <main>
    <div class="container">
      <Header>
        <h1>{{ staff.name }}</h1>
        <h2>{{ staff.role }}</h2>

        <div class="links" v-if="staff.links">
          <a
            v-if="staff.links.facebook"
            class="fab fa-facebook-f"
            :href="staff.links.facebook"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.instagram"
            class="fab fa-instagram"
            :href="staff.links.instagram"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.discord"
            class="fab fa-discord"
            :href="`javascript:alert('${staff.links.discord}')`"
          />
          <a
            v-if="staff.links.twitch"
            class="fab fa-twitch"
            :href="staff.links.twitch"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.youtube"
            class="fab fa-youtube"
            :href="staff.links.youtube"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.twitter"
            class="fab fa-twitter"
            :href="staff.links.twitter"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.web"
            class="fas fa-link"
            :href="staff.links.web"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.linkedin"
            class="fab fa-linkedin"
            :href="staff.links.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          />
          <a
            v-if="staff.links.github"
            class="fab fa-github"
            :href="staff.links.github"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </Header>

      <div class="about">
        <img
          class="portrait"
          :src="staff.img ? staff.img : 'https://via.placeholder.com/280x320'"
          alt="Portrét"
        />
        <table v-if="staff.about">
          <tr v-for="(a, q) in staff.about" :key="q">
            <td>{{ q }}</td>
            <td>{{ a }}</td>
          </tr>
        </table>

        <div v-else>Nedoplněný profil</div>
      </div>

      <div v-if="staff.articles">
        <h3>Publikované články</h3>
        <div class="table">
          <router-link
            :to="'/novinka/' + article._id"
            v-for="(article, index) in staff.articles"
            :key="article._id"
            class="tr"
          >
            <div class="td">{{ staff.articles.length - index }}.</div>
            <div class="td">{{ article.title }}</div>
            <div class="td">{{ article.sub }}</div>
            <div class="td">
              {{
                new Date(article.date * 1000).toLocaleDateString('cs', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              }}
            </div>
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
    this.staff = await getData('/staff/' + this.$route.params.name, {
      code: true,
    });
    if (this.staff == 404) {
      this.$Progress.fail();
      this.$router.replace('/staff');
    } else {
      this.$Progress.finish();
      document.title = `iNvolute | Staff - ${this.staff.name}`;
    }
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
  @include medium-device
    font-size: 1.5rem

.links
  a
    text-decoration: none
    padding: 5px
    margin: 2px
    font-size: 1.25rem
    color: black

.about
  display: grid
  grid-template-columns: 400px 1fr
  margin: 20px 20px 50px 20px
  gap: 10px
  @include large-device
    grid-template-columns: 100%
  justify-items: center
  align-items: center
  .portrait
    max-width: 100%
    min-width: 40%
    max-height: 425px
    @include large-device
      max-height: 40vh
  table
    width: 100%
    border-collapse: collapse
    td
      border: 1px dashed $textGray
      padding: 5px 0
      width: 60%
      &:nth-of-type(1)
        font-weight: bold
        font-size: 1.1rem
        width: 40%
        @include medium-device
          font-size: 1rem

.table
  margin: auto
  margin-top: 20px
  width: 80%
  display: table
  @include medium-device
    width: 97.5%
    margin-top: 10px
  .tr
    display: table-row
    text-align: left
    text-decoration: none
    color: black
    @include transition(color)
    &:hover
      color: $purple
  .td
    display: table-cell
    padding: 5px
    &:nth-of-type(2)
      font-weight: bold
</style>
