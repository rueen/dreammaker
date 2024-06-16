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
.scaleUp{
  animation: scaleUp .1s linear forwards;
}
@keyframes scaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
    z-index: 10;
  }
}
.fadeInDownBig {
  animation: fadeInDownBig 1s linear forwards;
}
@-webkit-keyframes fadeInDownBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -2000px, 0);
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInDownBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -2000px, 0);
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

</style>
