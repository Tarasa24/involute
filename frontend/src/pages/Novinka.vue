<template>
  <div>
    <div class="header" v-touch:swipe="swipeHandler">
      <span>
        <router-link
          v-if="soused.pervious != null"
          :to="'/novinka/' + soused.pervious"
          class="fas fa-chevron-left"
        />
        <a v-else disabled class="fas fa-chevron-left" />

        <router-link
          v-if="soused.next != null"
          :to="'/novinka/' + soused.next"
          class="fas fa-chevron-right"
        />
        <a v-else disabled class="fas fa-chevron-left" />
      </span>

      <h1>{{ novinka.title }}</h1>
      <p>{{ novinka.game }}</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
        sunt quas soluta, laboriosam dignissimos odio itaque? Ratione ducimus
        magnam perspiciatis maxime reiciendis?
      </p>
    </div>

    <main>
      <p>{{ novinka.text }}</p>
      <img src="/img/csgo.jpg" alt="csgo" />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum nulla
        officiis quo ipsum unde corporis mollitia odit fugiat perspiciatis,
        corrupti commodi modi accusamus officia nemo repudiandae amet blanditiis
        obcaecati molestiae! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Dolores nobis tempora voluptates voluptate hic. Sapiente ut, quas
        maiores reprehenderit ea, quia tempora pariatur eveniet quibusdam harum
        voluptatibus iste mollitia! Commodi. Lorem ipsum dolor, sit amet
        consectetur adipisicing elit. Minima saepe accusamus, repellendus
        aliquam incidunt molestiae labore ad velit mollitia veritatis corporis
        non qui ducimus? Praesentium quos aspernatur necessitatibus libero
        distinctio? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Doloremque ratione cum laudantium! Unde modi alias quod pariatur omnis
        consequatur doloribus accusantium neque dignissimos, hic illo nisi vitae
        cupiditate animi repellat! Lorem ipsum, dolor sit amet consectetur
        adipisicing elit. Sunt ab, odit accusantium iure vitae exercitationem
        perferendis. Earum illo vel ex accusantium veniam, a harum quaerat,
        adipisci, id dolor modi ipsum.
      </p>
    </main>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      novinka: {},
      soused: {},
    };
  },
  watch: {
    $route: 'load',
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.$Progress.start();
      this.novinka = await getData('/novinka', {
        code: true,
        params: [this.$route.params.id],
      });

      if (this.novinka === 400) {
        this.$router.push('/novinka');
        this.$Progress.fail();
      } else {
        this.soused = await getData('novinka', {
          params: [this.$route.params.id, '/neighbors'],
        });
        this.$Progress.finish();
      }
    },
    swipeHandler(direction) {
      if (direction === 'left' && this.soused.next != null)
        this.$router.push(`/novinka/${this.soused.next}`);
      else if (direction === 'right' && this.soused.pervious != null)
        this.$router.push(`/novinka/${this.soused.pervious}`);
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  color: #d9d9d9
  padding: 5.5vh calc(30% + 20px)
  text-align: left
  background-color: #02021f
  @include large-device
    padding: 5vh 15%
  @include small-device
    padding: 5%

  span
    display: grid
    grid-template-columns: 50% 50%
    grid-column-gap: 5px
    a
      align-self: center
      padding: 10px 20px
      color: white
      background-color: #A65BDA
      text-decoration: none
    a:first-child
      justify-self: right
    a:last-child
      justify-self: left
    a[disabled]
      background-color: gray
      color: black

  h1
    text-transform: uppercase
    margin-top: 5vh
    font-size: 3.5rem
    @include small-device
      font-size: 2.2rem
  p
    @include small-device
      font-size: 1rem

main
  background-color: white
  text-align: left
  padding: 5vh calc(30% + 20px)
  @include large-device
    padding: 5vh 15%
  @include small-device
    padding: 5%
  img
    max-width: 100%
    max-height: 100%
    display: block
</style>
