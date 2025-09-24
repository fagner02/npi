<script setup lang="ts">
import { ref, watch, type Component, type ComputedRef, type Ref } from "vue";
import EntityTable from "./EntityTable.vue";
import type { DataTableHeader } from "vuetify";
import { categories, category, product, products } from "./Entity.vue";
import CategoryForm from "./CategoryForm.vue";
import ProductForm from "./ProductForm.vue";
import { CategoryService, ProductService, type Service } from "@/api";

const activeTab = ref(0);

export type Product = {
    name: string;
    id: number | null;
    description: string | null;
    quantity: number;
    price: number | null;
    categoryId: number | null;
};
export type Category = {
    name: string;
    id: number | null;
    description?: string;
};

export type Entities = Category | Product;

const tabs: {
    editedEntity: Ref<Entities>;
    defaultEntity: Entities;
    title: string;
    headers: DataTableHeader[];
    comp: Component;
    table: Ref<any>;
    service: Service<any>;
    entities: Ref<Entities[]>;
}[] = [
    {
        editedEntity: category,
        defaultEntity: {
            id: null,
            name: "",
            description: "",
        },
        service: new CategoryService(),
        entities: categories,
        title: "Categoria",
        headers: [
            { title: "Id", key: "id", sortable: true },
            {
                title: "Nome",
                key: "name",
                sortable: true,
                maxWidth: "150px",
                nowrap: true,
            },
            {
                title: "Descrição",
                key: "description",
                sortable: true,
                maxWidth: "150px",
                nowrap: true,
            },
            { title: "Ações", key: "actions", align: "end", sortable: false },
        ],
        table: ref(),
        comp: CategoryForm,
    },
    {
        editedEntity: product,
        defaultEntity: {
            id: null,
            name: "",
            price: null,
            quantity: 0,
            categoryId: null,
            description: "",
        },
        service: new ProductService(),
        entities: products,
        headers: [
            { title: "Id", key: "id", sortable: true },
            {
                title: "Nome",
                key: "name",
                sortable: true,
                nowrap: true,
                maxWidth: "150px",
            },
            { title: "Preço", key: "price", sortable: true },
            {
                title: "Descrição",
                key: "description",
                sortable: true,
                maxWidth: "150px",
                nowrap: true,
            },
            { title: "Quantidade", key: "quantity", sortable: true },
            { title: "Categoria", key: "category.name", sortable: true },
            { title: "Ações", key: "actions", align: "end", sortable: false },
        ],
        table: ref(),
        title: "Produto",
        comp: ProductForm,
    },
];

function fallback(value: any, item: Entities, key: string) {
    return value ?? "!";
}

watch(activeTab, () => {
    tabs[activeTab.value].table.value?.initialize({});
});
</script>

<template>
    <v-app style="">
        <Header title="Product API">
            <v-tabs v-model="activeTab">
                <v-tab v-for="(item, i) in tabs" :value="i">{{
                    item.title
                }}</v-tab>
            </v-tabs>
        </Header>

        <v-tabs-window v-model="activeTab">
            <v-tabs-window-item v-for="(tab, index) in tabs" :key="index">
                <EntityTable
                    :service="tab.service"
                    :entities="tab.entities"
                    :editedEntity="tab.editedEntity"
                    :defaultEntity="tab.defaultEntity"
                    :headers="tab.headers"
                    :title="tab.title"
                    :ref="
                        (el) => {
                            if (tab.table) tab.table.value = el;
                        }
                    "
                >
                    <component :is="tab.comp" />
                </EntityTable>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-app>
</template>

<style>
.bg {
    --bg-color: hsl(210, 100%, 30%);
    background: url("/image.png") !important;
    background-size: 800px !important;
    background-color: var(--bg-color) !important;
    background-blend-mode: color-dodge;
}
</style>
