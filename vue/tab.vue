<template>
  <div class="tab-navbar">
    <input type="radio" name="tab" id="tab1" checked />
    <input type="radio" name="tab" id="tab2" />
    <input type="radio" name="tab" id="tab3" />
    <input type="radio" name="tab" id="tab4" />
    <nav>
      <label for="tab1">首页</label>
      <label for="tab2">列表</label>
      <label for="tab3">其他</label>
      <label for="tab4">我的</label>
    </nav>
    <main>
      <ul>
        <li>首页</li>
        <li>列表</li>
        <li>其他</li>
        <li>我的</li>
      </ul>
    </main>
  </div>
</template>

<script>
export default {
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.active {
  background-color: #00b7a3;
  color: #fff;
}
.tab-navbar {
  display: flex;
  overflow: hidden;
  flex-direction: column-reverse;
  border-radius: 10px;
  width: 300px;
  height: 400px;
  margin: 100px auto;
  input {
    display: none;
    &:nth-child(1):checked {
      & ~ nav label:nth-child(1) {
        @extend .active;
      }
      & ~ main ul {
        background-color: #f13f84;
        transform: translate3d(0, 0, 0);
      }
    }
    &:nth-child(2):checked {
      & ~ nav label:nth-child(2) {
        @extend .active;
      }
      & ~ main ul {
        background-color: #44bb44;
        transform: translate3d(-25%, 0, 0);
      }
    }
    &:nth-child(3):checked {
      & ~ nav label:nth-child(3) {
        @extend .active;
      }
      & ~ main ul {
        background-color: #ff7632;
        transform: translate3d(-50%, 0, 0);
      }
    }
    &:nth-child(4):checked {
      & ~ nav label:nth-child(4) {
        @extend .active;
      }
      & ~ main ul {
        background-color: #00bbdd;
        transform: translate3d(-75%, 0, 0);
      }
    }
  }
  nav {
    display: flex;
    height: 40px;
    background-color: #f0f0f0;
    line-height: 40px;
    text-align: center;
    label {
      flex: 1;
      cursor: pointer;
      transition: all 300ms;
    }
  }
  main {
    flex: 1;
    ul {
      display: flex;
      flex-wrap: nowrap;
      width: 400%;
      height: 100%;
      transition: all 300ms;
    }
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-weight: bold;
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>

