<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
    <v-app-bar
        :floating="true"
        class="bg"
        rounded="lg"
        style="
            margin: 10px;
            margin-bottom: 0px;
            border-radius: 5px;
            justify-content: space-between;
            overflow: hidden;
        "
    >
        <v-toolbar-title> {{ props.title }} </v-toolbar-title>
        <slot></slot>
    </v-app-bar>
</template>

<style>
header {
    width: auto !important;
    position: sticky !important;
}
</style>
