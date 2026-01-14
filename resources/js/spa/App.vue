<!--resources/js/spa/App.vue-->
<template>
    <router-view />
    <ConfirmBox />
</template>

<script setup>
import ConfirmBox from "@/Components/ConfirmBox.vue";

</script>

<style>
body {
    font-family: system-ui, sans-serif;
    margin: 0;
}
</style>
