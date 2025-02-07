<script setup lang="ts">
import { BoardApi } from '@/classes/BoardApi';
import { deepCopy, deepDiffConfig } from '@/helper/Board';
import type { BoardConfig } from '@/typings/BoardConfig';
import type { BoardState, Emits, Props } from '@/typings/Chessboard';
import { onMounted, reactive, ref, watch } from 'vue';
import PromotionDialog from './PromotionDialog.vue';

const props = withDefaults(defineProps<Props>(), {
  boardConfig: () => ({}),
  reactiveConfig: false,
});
const emit = defineEmits<Emits>();

const boardElement = ref<HTMLElement | null>(null);
const boardState: BoardState = reactive({
  showThreats: false,
  promotionDialogState: { isEnabled: false },
  historyViewerState: { isEnabled: false },
});

onMounted(() => {
  if (boardElement.value == null) {
    throw new Error('vue3-chessboard: Failed to mount board.');
  }

  const boardAPI = new BoardApi(boardElement.value, boardState, props, emit);
  emit('boardCreated', boardAPI);

  if (props.reactiveConfig) {
    let oldConfig: BoardConfig = deepCopy(props.boardConfig);
    watch(reactive(props.boardConfig), (newConfig: BoardConfig) => {
      boardAPI.setConfig(deepDiffConfig(oldConfig, newConfig));
      oldConfig = deepCopy(newConfig);
    });
  }
});
</script>

<template>
  <section
    class="main-wrap"
    :class="{
      disabledBoard: boardState.promotionDialogState.isEnabled,
      viewingHistory: boardState.historyViewerState.isEnabled,
    }"
  >
    <div class="main-board">
      <PromotionDialog
        v-if="boardState.promotionDialogState.isEnabled"
        :state="boardState.promotionDialogState"
        @promotion-selected="
          boardState.promotionDialogState = { isEnabled: false }
        "
      />
      <div class="testing">
        <div ref="boardElement"></div>
      </div>
    </div>
  </section>
</template>

<style>
.testing {
  height: 58vh;
}
cg-container {
  background-image: url(/img/chess/table-mob.webp);
  position: relative;
  background-position: center center;
  background-size: 108%;
  background-repeat: no-repeat;
  overflow: visible;
}
.orientation-white {
}
.cg-wrap {
  width: 700px;
  height: 700px;
}

.main-board {
  position: relative;
  display: block;
  height: 0;
  padding-bottom: 100%;
  width: 100%;
  cursor: pointer;
}

.cg-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

cg-board square {
  width: 12.5%;
  height: 12.5%;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out;
  border: 1px solid transparent;
  z-index: 2;
}

cg-board,
cg-board square {
  position: absolute;
  top: 0;
  left: 0;
}

cg-board,
.main-board .cg-wrap {
  position: absolute;
  width: 74%;
  height: 74.5%;
  top: 81px;
  left: 76px;
}

cg-board square.move-dest {
  background: rgba(97, 200, 174, 0.4);
}

cg-board square.premove-dest {
  background: radial-gradient(
    rgba(20, 30, 85, 0.5) 22%,
    #203085 0,
    rgba(0, 0, 0, 0.3) 0,
    rgba(0, 0, 0, 0) 0
  );
}

cg-board square.oc.move-dest {
  border: 1px solid #000;
}

cg-board square.oc.premove-dest {
  background: radial-gradient(
    transparent 0%,
    transparent 80%,
    rgba(20, 30, 85, 0.2) 80%
  );
}

cg-board .cg-square.move-dest.drag-over,
cg-board .cg-square.premove-dest.drag-over {
  box-shadow: inset 0 0 10px 2px rgba(216, 85, 0, 0.9);
}

cg-board square.last-move {
  will-change: transform;
  background-color: rgba(178, 206, 77, 0.41);
}

cg-board square.selected {
  border: 1px solid #000;
}

cg-board square.check {
  background: #d93c44;
  border: 1px solid #c93112;
}

cg-board square.current-premove {
  background-color: rgba(20, 30, 85, 0.5);
}

cg-board piece {
  position: absolute;
  top: 0;
  left: 0;
  width: 12.5%;
  height: 12.5%;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  will-change: transform;
}

cg-board piece.dragging {
  cursor: move;
  z-index: 9;
}

cg-board piece.anim {
  z-index: 8;
}

cg-board piece.fading {
  z-index: 1;
  opacity: 0.5;
}

.cg-wrap div.over {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(20, 85, 30, 0.3);
}

.cg-wrap piece.ghost {
  opacity: 0.3;
}

cg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  top: 0;
  right: 0;
}

cg-board {
  -webkit-user-select: none;
  user-select: none;
  line-height: 0;
}

cg-container .cg-shapes {
  opacity: 0.6;
  z-index: 2;
  overflow: hidden;
}

cg-container .cg-custom-svgs {
  z-index: 4;
}

cg-container .cg-shapes,
cg-container .cg-custom-svgs,
cg-auto-pieces {
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

coords {
  position: absolute;
  display: flex;
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
  color: #fff;
  font-weight: bold;
}

.coords-no coords {
  display: none;
}

coords {
  font-size: 8px;
}

@media (min-width: 320px) {
  coords {
    font-size: calc(8px + 4 * ((100vw - 320px) / 880));
  }
}

@media (min-width: 1200px) {
  coords {
    font-size: 12px;
  }
}

coords.ranks {
  flex-flow: column-reverse;
  top: 1px;
  right: 0;
  height: 100%;
  width: 0.8em;
  display: none;
}

coords.ranks.black {
  flex-flow: column;
}

coords.files {
  bottom: 0;
  left: -0.12em;
  text-align: left;
  flex-flow: row;
  width: 100%;
  display: none;
  height: 1.2em;
}

coords.files.black {
  flex-flow: row-reverse;
}

coords.files coord {
  padding-left: 4px;
}

coords coord {
  flex: 1 1 auto;
}

.orientation-white .files coord:nth-child(2n + 1),
.orientation-white .ranks coord:nth-child(2n),
.orientation-black .files coord:nth-child(2n),
.orientation-black .ranks coord:nth-child(2n + 1) {
  color: #f0d9b5;
}

.orientation-white .files coord:nth-child(2n),
.orientation-white .ranks coord:nth-child(2n + 1),
.orientation-black .files coord:nth-child(2n + 1),
.orientation-black .ranks coord:nth-child(2n) {
  color: #946f51;
}

piece.ghost {
  opacity: 0.3;
}

piece {
  position: absolute;
  top: 0;
  left: 0;
  width: 12.5%;
  height: 12.5%;
  background-size: cover;
  z-index: 2;
  will-change: transform;
}

cg-board .pawn.white {
  background-image: url(/img/chess/figures/white-6.svg);
}

cg-board .bishop.white,
.promotion-dialog .bishop.white {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/white-3.svg);
}

cg-board .knight.white,
.promotion-dialog .knight.white {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/white-2.svg);
}

cg-board .rook.white,
.promotion-dialog .rook.white {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/white-1.svg);
}

cg-board .queen.white,
.promotion-dialog .queen.white {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/white-4.svg);
}

cg-board .king.white {
  background-image: url(/img/chess/figures/white-5.svg);
}

cg-board .pawn.black {
  background-image: url(/img/chess/figures/black-6.svg);
}

cg-board .bishop.black,
.promotion-dialog .bishop.black {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/black-3.svg);
}

cg-board .knight.black,
.promotion-dialog .knight.black {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/black-2.svg);
}

cg-board .rook.black,
.promotion-dialog .rook.black {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/black-1.svg);
}

cg-board .queen.black,
.promotion-dialog .queen.black {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(/img/chess/figures/black-5.svg);
}

cg-board .king.black {
  background-image: url(/img/chess/figures/black-4.svg);
}

.disabledBoard {
  pointer-events: none;
}

.viewingHistory {
  filter: saturate(60%);
  transition: 0.25s filter linear;
}

@media (orientation: landscape) {
  .main-wrap {
    width: 90vh;
    margin-inline: auto;
    max-width: 770px;
  }
}
</style>
