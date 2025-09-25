<script setup lang="ts">
import { ref, watch, type Ref, type StyleValue } from "vue";

const props = withDefaults(
    defineProps<{
        title: string;
        refs?: { valid: Ref<boolean>; form: Ref<any> };
        style?: StyleValue;
        class?: string;
        elevation?: string;
    }>(),
    { refs: () => ({ valid: ref(true), form: ref() }) }
);

const form = ref();
watch(form, (newForm) => {
    props.refs.form.value = newForm;
});
</script>

<template>
    <v-card :elevation="elevation" rounded="lg" :style="style" :class="class">
        <v-card
            class="bg"
            style="
                margin-bottom: 20px;
                --bg-color: hsl(200, 100%, 20%);
                background-position-y: 100px;
                background-position-x: -50px;
                padding: 10px;
            "
            rounded="lg"
        >
            <v-card-title>{{ title }} </v-card-title>
        </v-card>
        <v-form
            style="margin: 0px 20px"
            ref="form"
            v-model="props.refs.valid.value"
            :key="'form' + title"
        >
            <div style="display: flex; flex-direction: column; gap: 10px">
                <slot name="fields"> </slot>
            </div>
        </v-form>
        <v-card-actions
            style="
                padding: 15px;
                outline: 1px solid hsl(0, 0%, 0%);
                background: hsl(0, 0%, 10%);
                border-radius: 10px;
            "
        >
            <slot name="actions"></slot>
        </v-card-actions>
    </v-card>
</template>

<style></style>
