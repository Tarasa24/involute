<template>
  <main>
    <div class="mugshot" @click="handleClick">
      <img :src="staff.img" :alt="staff.name" />
      <span
        :style="
          newStaff || this.staff.img == undefined
            ? 'color: gray; opacity: 1; visibility: visible'
            : ''
        "
      >
        <b>Změnit portrét</b>
      </span>
    </div>
    <form @submit="handleSubmit">
      <input type="text" v-model="staff.name" placeholder="Jméno" required />
      <input type="text" v-model="staff.role" placeholder="Role" required />
      <br />
      <input
        type="radio"
        v-model="staff.category"
        name="category"
        value="Management"
        id="Management"
        required
      />
      <label for="Management">Management</label>
      <input
        type="radio"
        v-model="staff.category"
        name="category"
        value="Creators"
        id="Creators"
      />
      <label for="Creators">Creators</label>

      <h2>About</h2>
      <table>
        <tr v-for="(a, q) in staff.about" :key="q">
          <td>{{ q }}</td>
          <td><input type="text" v-model="staff.about[q]" /></td>
        </tr>
        <tr>
          <td>Připojený účet</td>
          <td>
            <select v-model="staff.linkedUser">
              <option value=""></option>
              <option v-for="user in users" :key="user._id" :value="user._id">
                {{ user.name }}
              </option>
            </select>
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
                v-model="staff.links.facebook"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-instagram" /> Instagram</td>
            <td>
              <input
                type="url"
                v-model="staff.links.instagram"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-discord" /> Discord</td>
            <td>
              <input
                type="text"
                v-model="staff.links.discord"
                placeholder="Nick#0000"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-twitch" /> Twitch</td>
            <td>
              <input
                type="url"
                v-model="staff.links.twitch"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-youtube" /> Youtube</td>
            <td>
              <input
                type="url"
                v-model="staff.links.youtube"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-twitter" /> Twitter</td>
            <td>
              <input
                type="url"
                v-model="staff.links.twitter"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fas fa-link" /> Web</td>
            <td>
              <input
                type="url"
                v-model="staff.links.web"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-linkedin" /> LinkedIn</td>
            <td>
              <input
                type="url"
                v-model="staff.links.linkedin"
                placeholder="https://"
              />
            </td>
          </tr>
          <tr>
            <td><i class="fab fa-github" /> Github</td>
            <td>
              <input
                type="url"
                v-model="staff.links.github"
                placeholder="https://"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!newStaff">
        <button type="submit">Uložit</button>
        <button type="button" @click="handleDelete">Odstranit</button>
      </div>
      <div v-else>
        <button type="submit">Vytvořit</button>
      </div>
    </form>
    <FileUpload ref="FileUpload" v-model="staff.img" />
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
  props: { newStaff: { type: Boolean } },
  components: { FileUpload },
  data() {
    return {
      staff: {
        links: {},
      },
      users: [],
    };
  },
  async created() {
    if (!this.newStaff) {
      this.$Progress.start();
      this.staff = await getData('/staff/' + this.$route.params.name);
      this.$Progress.finish();
    }
    this.users = await getData('/uzivatele');
    var about = {
      Nick: '',
      Věk: '',
      'Co rád dělám?': '',
      'Na čem hraju?': '',
      'Proč se věnuji esportu?': '',
      'Co je mým úkolem v týmu?': '',
    };
    if (this.staff.about)
      for (const q of Object.keys(this.staff.about)) {
        about[q] = this.staff.about[q];
      }
    this.staff.about = about;
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
      if (this.newStaff) {
        const staff = Object.assign({}, this.staff);
        this.clean(staff.about);
        this.clean(staff.links);
        if (staff.linkedUser === '') delete staff.linkedUser;

        result = await putData('/staff', JSON.stringify(staff));
      } else {
        const staff = Object.assign({}, this.staff);
        delete staff._id;
        this.clean(staff.about);
        this.clean(staff.links);
        if (staff.linkedUser === '') delete staff.linkedUser;

        result = await postData(
          '/staff/' + this.staff._id,
          JSON.stringify(staff)
        );
      }

      if (result.status == 202) {
        this.$Progress.finish();
        this.$router.push('/staff');
      } else {
        this.$Progress.fail();
        alert('Vyskytla se chyba');
      }
    },
    async handleDelete() {
      if (confirm(`Opravdu chcete staff "${this.staff.name}" odstranit?`)) {
        this.$Progress.start();
        const result = await deleteData('/staff/' + this.staff._id);
        if (result.status == 202) {
          this.$Progress.finish();
          this.$router.push('/staff');
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
  font-size: 2rem
  &:focus
    outline: 1px solid $grayOutline
  &:nth-of-type(2)
    font-size: 1.5rem
  &[type="radio"]
    margin-top: 10px
    width: auto
label:first-of-type
  margin-right: 10px

h2
  margin: 20px 0 0 0

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
  input, select
    text-align: left
    font-size: 1rem
    width: calc( 100% - 10px )
    background-color: transparent
    &:focus
      outline: 0
  select
    border: 0
    padding: 5px 5px 5px 0
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
