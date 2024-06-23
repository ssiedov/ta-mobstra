<script setup>
import { ref, onMounted } from "vue";
import store from "@/store";
import Table from "@/components/Table.vue";
import FilterColumns from "@/components/FilterColumns.vue";
import Loader from "@/components/Loader.vue";

const loading = ref(true);

onMounted(async () => {
  try {
    await store.dispatch("fetchData");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div id="app">
    <Loader v-if="loading" />
    <div v-else class="container">
      <FilterColumns class="flex-end" />
      <Table class="calculated-height" />
    </div>
  </div>
</template>

<style lang="scss">
// Specific classes for components inside of components
.container {
  height: 100%;
}
</style>
