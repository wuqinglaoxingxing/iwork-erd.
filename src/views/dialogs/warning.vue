<template>
  <div class="warning">
    <h2 v-dragdrop>
      {{data[2]}}
      <span @click="$store.commit('closeDialog')">X</span>
    </h2>
    <div>
      <div class='content' v-html="data[1]"></div>
      <div class='btlist'>
        <input type="button" class='yes' :value="data[3]" @click="$store.commit('closeDialog','yes')" v-focus>
        <input type="button" class='no' :value="data[4]" @click="$store.commit('closeDialog','no')" v-if='data[0]=="confirm"'>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"]
};
</script>
<style lang="scss" scoped>
.warning {
  width: 4.2rem;
  margin: auto;

  & > h2 {
    background-color: var(--dialog-warning-title-bg);
    line-height: 0.38rem;
    padding-left: 0.2rem;
    color: var(--dialog-warning-title-color);
    border-radius: 0.05rem 0.05rem 0 0;
    font-size: 0.12rem;
    position: relative;
    & > span {
      position: absolute;
      right: 0.2rem;
      font-size: 0.2rem;
      cursor: pointer;
    }
  }
  & > div {
    background-color: var(--is-white);
    border-radius: 0 0 0.05rem 0.05rem;
    line-height: 0.2rem;
    & > div {
      padding: 0.15rem;
      &.content {
        color: #777;
        font-size: 0.12rem;
        max-height: 2rem;
        overflow: auto;
      }
      &.btlist {
        padding-top: 0;
        text-align: right;
        margin-top: .1rem;
        & > input {
          width: 0.9rem;
          height: 0.24rem;
          line-height: 0.24rem;
          text-align: center;
          color: var(--is-white);
          border: 0;
          cursor: pointer;
          margin-left: 0.1rem;
          &.no {
            background: var(--normal-btn-reset-bg);
          }
          &.yes {
            background: var(--normal-btn-bg);
          }
        }
      }
    }
  }
}
</style>
