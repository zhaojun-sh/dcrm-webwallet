<template>
  <div class="boxConntent1 navBox">
    <nav class="navLeft_box">
      <ul>
        <li>
          <router-link to="/MyAssets" class="item flex-ai-c">
            <div class="icon">
              <img src="@/assets/image/MyAssets.svg">
            </div>
            <p>My Assets</p>
          </router-link>
        </li>
        <li>
          <router-link to="/Transfer" class="item flex-ai-c">
            <div class="icon">
              <img src="@/assets/image/Transfer.svg">
            </div>
            <p>Transfer</p>
          </router-link>
        </li>
        <li>
          <router-link to="/LILO" class="item flex-ai-c">
            <div class="icon">
              <img src="@/assets/image/LILO.svg">
            </div>
            <p>LILO</p>
          </router-link>
        </li>
        <li>
          <router-link to="/DAPP" class="item flex-ai-c">
            <div class="icon">
              <img src="@/assets/image/DAPP.svg">
            </div>
            <p>DAPP</p>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="navContent_box">
      <div class="bgLoading flex-c">
        <div style="text-align: center;">
          <div class="rotateLoad">
            <img src="static/img/wait.svg">
          </div>
          <p
            style="margin-top:15px;font-size:16px;font-weight:bold;color:#333;padding-left:12px;"
          >Loading…</p>
        </div>
      </div>
      <div
        style="width:100%;height:100%;position:absolute;top:0;left:0;overflow:auto;overflow-x:hidden;"
      >
        <div style="width:100%;height:100%;position:relative;">
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

