<template>
  <div class="boxConntent1" style="padding-left:230px;">
    <nav class="navLeft_box">
      <ul>
        <li><router-link to="/MyAssets" class="item flex-ai-c"><div class="icon"><img src="../../../assets/image/MyAssets.svg"></div>My Assets</router-link></li>
        <li><router-link to="/Transfer" class="item flex-ai-c"><div class="icon"><img src="../../../assets/image/Transfer.svg"></div>Transfer</router-link></li>
        <li><router-link to="/LILO" class="item flex-ai-c"><div class="icon"><img src="../../../assets/image/LILO.svg"></div>LILO</router-link></li>
        <li><router-link to="/DAPP" class="item flex-ai-c"><div class="icon"><img src="../../../assets/image/DAPP.svg"></div>DAPP</router-link></li>
      </ul>
    </nav>
    <div class="navContent_box">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
