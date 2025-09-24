<script lang="ts" setup>
import { category } from "../api/entity";
import { emptyRule } from "./rules";
</script>

<template>
    <v-text-field
        v-model="category.name"
        label="Nome"
        :rules="[emptyRule]"
        required
        variant="outlined"
    ></v-text-field>
    <v-text-field
        label="Descrição"
        v-model="category.description"
        required
        variant="outlined"
    ></v-text-field>
</template>
