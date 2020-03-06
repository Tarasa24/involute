<template>
  <div class="sponsors">
    <a href="https://zowie.benq.com/" target="_blank" rel="noopener noreferrer">
      <img src="../assets/img/sponsors/zowie.png" alt="Zowie logo" />
    </a>
    <a
      href="https://steelseries.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="../assets/img/sponsors/steelseries.png"
        alt="Steelseries logo"
      />
    </a>
    <a
      href="https://ultimateguard.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="../assets/img/sponsors/ultimate-guard.png"
        alt="Ultimate Guard logo"
      />
    </a>
    <a
      href="https://www.fantomprint.cz/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="../assets/img/sponsors/fantomprint.png"
        alt="Fantomprint logo"
      />
    </a>
    <a href="http://www.gigabyte.cz/" target="_blank" rel="noopener noreferrer">
      <img src="../assets/img/sponsors/gigabyte.png" alt="Gigabyte logo" />
    </a>
    <a href="https://www.aorus.com/" target="_blank" rel="noopener noreferrer">
      <img src="../assets/img/sponsors/aorus.png" alt="Aorus logo" />
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.sponsors
  background-color: black
  display: grid
  grid-template-columns: repeat(6, 1fr)
  column-gap: 4vw
  align-items: center
  padding: 0 20vw
  @include large-device
    padding: 0 1%
  @include small-device-portrait
    grid-template-columns: repeat(3, 1fr)
    padding: 0 10%
  img
    padding: 5px 0
    object-fit: cover
    width: 100%
    filter: brightness(75%)
    @include transition(filter)
    &:hover
      filter: brightness(100%)
</style>
