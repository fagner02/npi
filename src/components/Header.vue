<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
    <v-app-bar
        :floating="true"
        class="bg"
        style="
            margin: 10px;
            margin-bottom: 0px;
            border-radius: 5px;
            justify-content: space-between;
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

.bg {
    --bg-color: hsl(210, 100%, 30%);
    background: url("/image.png") !important;
    background-size: 800px !important;
    background-color: var(--bg-color) !important;
    background-blend-mode: color-dodge;
}
</style>
