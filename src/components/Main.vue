<script setup lang="ts">
import { ref, watch, type Component, type Ref } from "vue";
import EntityTable from "./EntityTable.vue";
import type { DataTableHeader } from "vuetify";
import { categories, category, product, products } from "../api/entity";
import CategoryForm from "./CategoryForm.vue";
import ProductForm from "./ProductForm.vue";
import CategoryCustomCell from "./CategoryCustomCell.vue";
import { categoryService, productService, type Service } from "@/api/service";
import { logout, username } from "@/api/api";

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
    customCells?: { name: string; comp: Component }[];
}[] = [
    {
        editedEntity: category,
        defaultEntity: {
            id: null,
            name: "",
            description: "",
        },
        service: categoryService,
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
        service: productService,
        entities: products,
        headers: [
            {
                title: "Id",
                key: "id",
                sortable: true,
            },
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

        customCells: [{ name: "category.name", comp: CategoryCustomCell }],
        table: ref(),
        title: "Produto",
        comp: ProductForm,
    },
];

watch(activeTab, () => {
    tabs[activeTab.value].table.value?.initialize({});
});
</script>

<template>
    <v-app>
        <Header title="Product API">
            <v-tabs v-model="activeTab">
                <v-tab v-for="(item, i) in tabs" :value="i">{{
                    item.title
                }}</v-tab>
            </v-tabs>
            <v-divider
                color="white"
                opacity="0.3"
                vertical
                style="margin: 10px 0; margin-right: 20px"
            ></v-divider>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        density="default"
                        size="small"
                        icon="mdi-account"
                        elevation="3"
                        rounded="lg"
                        class="bg"
                        style="
                            --bg-color: hsl(200, 100%, 30%);
                            padding: 5px;
                            margin-right: 20px;
                        "
                    ></v-btn>
                </template>

                <v-list
                    density="compact"
                    class="bg"
                    rounded="lg"
                    style="--bg-color: hsl(200, 100%, 30%)"
                >
                    <p style="margin: 0 15px; color: white">
                        Olá {{ username }}
                    </p>
                    <v-list-item
                        @click="logout"
                        style="
                            margin: 0 10px;
                            background-color: hsl(0, 0%, 100%, 10%);
                            border-radius: 10px !important;
                        "
                        elevation="2"
                        rounded="lg"
                    >
                        <v-list-item-title>Sair</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
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
                    :customCells="tab.customCells?.map((x) => x.name)"
                    :ref="
                        (el) => {
                            if (tab.table) tab.table.value = el;
                        }
                    "
                >
                    <component :is="tab.comp" />
                    <template
                        v-for="item in tab.customCells"
                        #[`${item.name}`]="{ value }"
                    >
                        <component :is="item.comp" :value="value" />
                    </template>
                </EntityTable>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-app>
</template>
