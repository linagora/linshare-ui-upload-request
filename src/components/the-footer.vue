<template>
  <footer class="the-footer">
    <div>
      <i18n path="FOOTER.CONTENT">
        <template #linshare>
          <a
            href="https://linshare.org"
            target="_blank"
          >LinShare™</a>
        </template>
        <template #linagora>
          <a
            href="https://linagora.com"
            target="_blank"
          >Linagora ©</a>
        </template>
      </i18n>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter'
};
</script>

<style lang="scss">
  .the-footer {
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