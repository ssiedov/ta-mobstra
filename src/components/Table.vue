<script setup>
import { toRef } from "vue";
import store from "@/store";
import text from "@/assets/text.json";

const data = toRef(store.getters, "getFilteredData");

const setActiveSortIcon = (sortBy) => {
  store.dispatch("setSortBy", sortBy);
};
</script>

<template>
  <div class="table__wrapper">
    <table>
      <thead>
        <tr>
          <th
            v-for="(value, key, i) of data[0]"
            :key="key + '_' + i"
            :colspan="Object.keys(value).length"
          >
            {{ text[key] }}
          </th>
        </tr>
        <tr>
          <template v-for="(value, parrentKey, idx) of data[0]">
            <td
              v-for="(_, key, i) of value"
              :key="key + '_' + i"
              @click="setActiveSortIcon(key)"
              :class="{
                sortIcon: parrentKey !== 'traffic',
                active: key === store.state.sortBy,
                anotherBg: idx === 0,
              }"
              :data-sort-id="key"
            >
              {{ text[key] }}
            </td>
          </template>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <!-- v-if="data[0].group_by" -->
          <td :colspan="Object.keys(data[0].group_by ?? {}).length" class="text-left">
            {{ text.total }}
          </td>
          <template v-for="group of store.state.total">
            <template v-for="(item, key, i) of group">
              <td v-if="store.getters.getActiveColumns.includes(key)" :key="item + '_' + i">
                {{ item }}
              </td>
            </template>
          </template>
        </tr>
      </tfoot>
      <tbody>
        <tr v-for="(items, idx) of data" :key="'row_' + idx">
          <template v-for="group of items">
            <td v-for="(value, key) of group" :key="'row_' + idx + key">
              {{ value }}
            </td>
          </template>
        </tr>
      </tbody>
      <colgroup>
        <template v-for="(value, _, idx) in data[0]">
          <col
            v-for="(_, i) in Object.keys(value)"
            :key="`col_${idx}_${i}`"
            span="1"
            :style="{
              borderRight: Object.keys(value).length - 1 === i ? '1px solid #414761' : null,
              background: idx === 0 ? '#182e55' : '#191F37',
            }"
          />
        </template>
      </colgroup>
    </table>
  </div>
</template>

<style lang="scss">
.table__wrapper {
  overflow: auto;

  &.calculated-height {
    height: calc(100% - 24px);
  }
}

table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;

  th,
  td {
    padding: 8px;
  }

  tr {
    border-bottom: 1px solid $border-color;
  }
  td {
    white-space: nowrap;
  }

  thead,
  tfoot {
    tr {
      border-bottom: none;
    }
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 1;

    tr {
      box-shadow: inset 0px -1px 1px 0px $border-color;

      background: $bg-primary;
      &:first-child {
        background: $bg-secondary;
        th:first-child {
          background: $bg-blue;
          box-shadow: inset 0px -1px 1px 0px $border-color;
        }
      }
      td {
        position: relative;
        padding-right: 20px;
        cursor: pointer;
        &.anotherBg {
          background: $bg-blue;
          box-shadow: inset 0px -1px 1px 0px $border-color;
        }

        &.sortIcon {
          &::after,
          &::before {
            position: absolute;
            display: block;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.2);
          }

          &::after {
            content: "\203A";

            bottom: 10%;
            right: 8px;
            transform: rotate(90deg);
          }
          &::before {
            content: "\2039";

            bottom: 30%;
            right: 8px;
            transform: rotate(90deg);
          }
          &.active {
            &::after {
              color: #fff;
            }
          }
        }
      }
    }
  }

  tfoot {
    position: sticky;
    bottom: 0;
    z-index: 1;
    background: $bg-light;

    .text-left {
      text-align: left;
    }
  }
}
</style>
