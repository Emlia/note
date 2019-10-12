<template>
  <div class="accordion">
    <input type="checkbox" id="collapse1" />
    <input type="checkbox" id="collapse2" />
    <input type="checkbox" id="collapse3" />
    <article>
      <label for="collapse1">web秀</label>
      <p>
        html
        <br />javascript
        <br />css
        <br />uni app
      </p>
    </article>
    <article>
      <label for="collapse2">今日头条</label>
      <p>
        新闻
        <br />图片
        <br />视频
        <br />养生
      </p>
    </article>
    <article>
      <label for="collapse3">阿里巴巴</label>
      <p>
        淘宝
        <br />阿里云
        <br />闲鱼
        <br />天猫
      </p>
    </article>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.accordion {
  width: 300px;
  article {
    margin-top: 5px;
    cursor: pointer;
    &:first-child {
      margin-top: 0;
    }
  }
  input {
    display: none;
    padding: 0;
    margin: 0;
    &:nth-child(1):checked ~ article:nth-of-type(1) p,
    &:nth-child(2):checked ~ article:nth-of-type(2) p,
    &:nth-child(3):checked ~ article:nth-of-type(3) p {
      border-bottom-width: 1px;
      max-height: 600px;
    }
  }
  label {
    display: block;
    padding: 0 20px;
    height: 40px;
    background-color: #00b7a3;
    cursor: pointer;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
  }
  p {
    overflow: hidden;
    padding: 0 20px;
    margin: 0;
    border: 1px solid #00b7a3;
    border-top: none;
    border-bottom-width: 0;
    max-height: 0;
    line-height: 30px;
    transition: all 500ms;
  }
}
</style>

