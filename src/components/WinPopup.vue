<script setup lang="ts">
const emit = defineEmits(['close-popup']);

function closePopup() {
  emit('close-popup');
}
</script>
<template>
  <div
    class="chess-win-popup popup"
    id="chess-win-popup"
    style="display: block; opacity: 1"
  >
    <div class="chess-win-popup__wrapper popup-wrapper">
      <div class="chess-win-popup__bg popup-bg popup-close"></div>
      <div class="chess-win-popup__body popup-body">
        <div class="chess-win-popup__container popup-container">
          <button
            type="button"
            class="popup-close-btn popup-close"
            title="Закрыть"
            @click="closePopup"
          >
            <svg
              viewBox="0 0 19 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.7886 4.23486L4.59619 12.7049"
                stroke="#F9F1DF"
              ></path>
              <path
                d="M4.59619 4.23486L13.7886 12.7049"
                stroke="#F9F1DF"
              ></path>
            </svg>
          </button>
          <h2
            class="chess-win-popup__title popup-title section-title _decor-none"
          >
            Мат!
          </h2>
          <div class="chess-win-popup__text popup-text _left">
            Поздравляем! Вы выиграли
            <br />
            <br />
            <br />
          </div>
          <a
            @click="closePopup"
            href="#"
            class="chess-win-popup__btn btn popup-btn popup-close _green"
          >
            Ок
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
