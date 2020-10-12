<template>
  <div class="footer">
    {{ $t('FOOTER.CONTENT') }}
  </div>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style lang="scss" scoped>
  .footer {
    background-color: #E5E5E5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-size: 12px;
    line-height: 12px;
    color: #A9A9A9;
  }
</style>