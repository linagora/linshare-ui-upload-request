<template>
  <footer class="footer">
    <div v-html="$t('FOOTER.CONTENT')" />
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style lang="scss">
  .footer {
    background-color: #E5E5E5;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    font-size: 12px;
    line-height: 15px;
    color: #A9A9A9;

    a {
      margin-left: 4px;
    }
  }
</style>