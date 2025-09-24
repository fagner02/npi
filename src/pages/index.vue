<template>
    <Main></Main>
</template>

<script lang="ts" setup>
import Main from "@/components/Main.vue";
import { username } from "@/api/api";

if (localStorage.getItem("username")) {
    username.value = localStorage.getItem("username") || "";
}
//
</script>
