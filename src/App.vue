<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { initMockData } from './utils/mockData';

onLaunch(() => {
  console.log("App Launch");
  initMockData();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* 全局手账风格样式 */
@import './styles/global.scss';
</style>
