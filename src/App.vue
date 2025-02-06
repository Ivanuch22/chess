<script setup lang="ts">
import {
  TheChessboard,
  type BoardApi,
  type BoardConfig,
  type PieceColor,
} from '@/index';
import WinPopup from '@/components/WinPopup.vue';

import '../public/css/style.min.css';
import { ref } from 'vue';
import Layout from './components/Layout.vue';

let boardAPI: BoardApi | undefined;
const showWinPopup = ref(false);
const boardConfig: BoardConfig = {
  coordinates: true,
};
function handleCheckmate(isMated: PieceColor) {
  showWinPopup.value = true;
}
function closeWinPopup() {
  showWinPopup.value = false;
}

const playerColor: 'white' | 'black' | 'both' | undefined = undefined;
</script>

<template>
  <Layout>
    <WinPopup v-if="showWinPopup" @close-popup="closeWinPopup" />
    <TheChessboard
      :board-config="boardConfig"
      :player-color="playerColor"
      @board-created="(api) => (boardAPI = api)"
      @checkmate="handleCheckmate"
    />
  </Layout>
</template>

<style>
body {
  background-color: #222;
}
</style>
