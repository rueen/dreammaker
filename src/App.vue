<template>
  <router-view/>
</template>

<style>
@import url(./assets/iconfont/iconfont.css);
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.fadeIn{
  animation: fadeIn .3s linear forwards;
}
.fadeOut{
  animation: fadeOut .3s linear forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
