<script setup>
import { ref, watch, onMounted } from "vue";
import store from "@/store";
import text from "@/assets/text.json";

const isOpen = ref(false);

watch(
  store.state.columnsList,
  (value) => {
    store.dispatch("setColumnsList", value);
  },
  { deep: true }
);

const toggle = (event) => {
  if (!event.target.closest("div.filter")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", toggle);
});
</script>

<template>
  <div class="filter">
    <p class="filter__title" @click.stop="isOpen = !isOpen">
      {{ text.columnsSettings }}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99981 10.2191C8.26665 9.9527 8.68336 9.92933 8.9765 10.1484L9.06046 10.2214L11.999 13.1812L14.9395 10.2214C15.2052 9.95385 15.6218 9.92867 15.9159 10.1465L16.0002 10.2191C16.267 10.4856 16.2921 10.9034 16.0749 11.1983L16.0025 11.2828L12.5315 14.7786C12.265 15.047 11.8468 15.0714 11.5527 14.8518L11.4685 14.7786L7.99752 11.2828C7.70526 10.9884 7.70628 10.5122 7.99981 10.2191Z"
          fill="white"
          fill-opacity="0.9"
        />
      </svg>
    </p>
    <div class="filter__list__wrapper" @click.stop="" v-if="isOpen">
      <ul class="filter__list" :style="{ maxHeight: store.state.columnsList.length * 28 + 'px' }">
        <li
          class="filter__list__item"
          v-for="(item, i) of store.state.columnsList"
          :key="item.name"
        >
          <input
            type="checkbox"
            :checked="item.active"
            v-model="store.state.columnsList[i].active"
            :disabled="store.state.columnsList[i].name === 'date'"
          />
          <img src="../assets/img/check.svg" alt="check" />
          <p>{{ text[item.name] }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.filter {
  position: relative;

  &.flex-end {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
  }

  &__list {
    height: 80vh;
    overflow-y: scroll;

    list-style: none;
    cursor: pointer;

    &::-webkit-scrollbar {
      width: 0;
    }

    &__wrapper {
      position: absolute;
      z-index: 2;
      top: 34px;
      right: 0;
      padding: 16px;
      border: 1px solid #488dff;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.24);
      background: $bg-secondary;

      &::before {
        content: "";
        position: absolute;
        z-index: 3;
        top: -8px;
        right: 10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent $bg-secondary transparent;
      }
      &::after {
        content: "";
        position: absolute;
        z-index: 2;
        top: -9px;
        right: 10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent #488dff transparent;
      }
    }

    &__item {
      position: relative;
      min-width: 150px;

      display: flex;
      align-items: center;
      padding: 2px 0;

      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
      p {
        overflow: hidden;
        color: rgba(255, 255, 255, 0.4);
        text-overflow: ellipsis;
        white-space: nowrap;

        /* H6/Bold */
        font-size: 12px;
        font-weight: 700;
      }

      input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        cursor: pointer;

        &:checked {
          & ~ p {
            color: #1bc860;
          }
          & ~ img {
            opacity: 1;
          }
        }
      }

      img {
        opacity: 0;
        display: block;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
