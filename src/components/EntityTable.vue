<script setup lang="ts">
import { ref, nextTick, type Ref } from "vue";
import type { DataTableHeader } from "vuetify";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { Entities } from "./Main.vue";
import { api } from "@/api";

const props = defineProps<{
    routeName: string;
    title: string;
    headers: DataTableHeader[];
    editedEntity: Ref<Entities>;
    defaultEntity: Entities;
    cellFallback: (value: any, item: Entities, key: string) => string;
}>();

const search = ref("");
const valid = ref(true);
const form = ref();
const show = ref(false);
const message = ref("hamina hamin");
const messageColor = ref("");
const loading = ref(false);
const pageSize = ref(5);
const currentPage = ref(1);
const sort = ref<SortItem[]>([{ key: "id" }]);
const editDialog = ref(false);
const deleteDialog = ref(false);
const listLength = ref(0);
const entities: Ref<Entities[]> = ref([]);

const entityToDelete = ref<any>(null);

const entityFormTitle = ref("");
const setEntityFormTitle = () => {
    entityFormTitle.value = props.editedEntity.value.id
        ? "Editar"
        : "Adicionar";
};

const initialize = async ({
    page = currentPage.value,
    itemsPerPage = pageSize.value,
}: {
    page: number;
    itemsPerPage: number;
}) => {
    try {
        loading.value = true;
        const sortBy = sort.value
            .map((x) => `${x.key},${x.order ?? "asc"}`)
            .join("&sort=");
        const catRes = (
            await api.get(
                `/${props.routeName}?page=${
                    page - 1
                }&size=${itemsPerPage}&sort=${sortBy}&name=${search.value}`
            )
        ).data;
        entities.value =
            props.routeName == "produtos"
                ? catRes.data.content.map((x: any) => ({
                      ...x,
                      categoryId: x.category?.id,
                  }))
                : catRes.data.content;
        listLength.value = catRes.data.totalElements;
        currentPage.value = page;
        pageSize.value = itemsPerPage;
        loading.value = false;
    } catch (error) {
        // console.error("Error loading data:", error);
    }
};

const editEntity = (item: Entities | null) => {
    if (item === null) {
        Object.assign(props.editedEntity.value, props.defaultEntity);
    } else {
        Object.assign(props.editedEntity.value, item);
    }
    setEntityFormTitle();
    editDialog.value = true;
};

const deleteEntity = (item: any) => {
    entityToDelete.value = item;
    deleteDialog.value = true;
};

const closeEntity = () => {
    editDialog.value = false;
    nextTick(() => {
        Object.assign(props.editedEntity.value, props.defaultEntity);
    });
};

const closeDeleteEntity = () => {
    deleteDialog.value = false;
    nextTick(() => {
        entityToDelete.value = null;
    });
};

const saveEntity = async () => {
    try {
        const { valid } = await form.value.validate();
        if (!valid) {
            return;
        }
        const edit = props.editedEntity.value.id !== null;
        try {
            if (edit) {
                await api.put(
                    `/${props.routeName}/${props.editedEntity.value.id}`,
                    props.editedEntity.value
                );
            } else {
                const cat = props.editedEntity.value;
                await api.post(`/${props.routeName}`, cat);
            }
        } catch (e: any) {
            messageColor.value = "red";
            show.value = true;
            message.value =
                e.response.data.message +
                ". " +
                e.response.data.errors.join(". ") +
                ".";

            return;
        }
        messageColor.value = "green";
        show.value = true;
        message.value = edit
            ? "A entidade foi atualizada com sucesso"
            : "A entidade foi criada com sucesso";
        await initialize({
            page: currentPage.value,
            itemsPerPage: pageSize.value,
        });
        closeEntity();
    } catch (error) {
        console.error("Error saving entity:", error);
    }
};

const deleteEntityConfirm = async () => {
    try {
        await api.delete(
            `/${props.routeName}/${entityToDelete?.value?.id ?? 0}`
        );
        await initialize({
            page: currentPage.value,
            itemsPerPage: pageSize.value,
        });
        closeDeleteEntity();
    } catch (error) {
        console.error("Error deleting entity:", error);
    }
};

defineExpose({ initialize });
</script>

<template>
    <v-snackbar v-model="show" variant="elevated" :color="messageColor">
        {{ message
        }}<template v-slot:actions>
            <v-icon
                icon="mdi-close"
                size="small"
                @click="show = false"
            ></v-icon>
        </template>
    </v-snackbar>
    <v-card style="margin: 10px">
        <v-data-table-server
            items-per-page-text="Itens por página"
            :items-per-page="pageSize"
            :items="entities"
            :items-length="listLength"
            :items-per-page-options="[5, 10, 15, 20]"
            :page="currentPage"
            :multi-sort="true"
            :headers="props.headers"
            :loading="loading"
            v-model:sort-by="sort"
            @update:options="initialize"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                    class="bg"
                    style="
                        margin-bottom: 0px;
                        --bg-color: hsl(200, 100%, 20%);
                        background-position: -50px 100px !important;
                        border-radius: 5px;
                    "
                >
                    <div
                        style="
                            display: flex;
                            padding: 0 15px;
                            align-items: stretch;
                            gap: 5px;
                            flex: 1;
                        "
                    >
                        <v-dialog v-model="editDialog" max-width="500px">
                            <template v-slot:activator="{}">
                                <v-btn
                                    color="white"
                                    style="
                                        height: auto;
                                        --color: hsl(200, 100%, 20%);
                                        padding: 0 10px;
                                    "
                                    dark
                                    variant="outlined"
                                    @click="editEntity(null)"
                                >
                                    <v-icon
                                        icon="mdi-plus"
                                        size="large"
                                    ></v-icon>
                                    Adicionar
                                    {{ title }}
                                </v-btn>
                            </template>
                            <v-card rounded="lg">
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
                                    <v-card-title
                                        >{{ entityFormTitle }} {{ title }}
                                    </v-card-title>
                                </v-card>
                                <v-form
                                    style="margin: 0px 20px"
                                    ref="form"
                                    v-model="valid"
                                    :key="'form' + routeName"
                                >
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: column;
                                            gap: 10px;
                                        "
                                    >
                                        <slot> </slot>
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
                                    <v-btn
                                        color="blue darken-1"
                                        variant="outlined"
                                        @click="closeEntity"
                                    >
                                        Cancelar
                                    </v-btn>
                                    <v-btn
                                        :disabled="!valid"
                                        color="blue darken-1"
                                        variant="outlined"
                                        @click="saveEntity"
                                    >
                                        Salvar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-text-field
                            v-model="search"
                            density="compact"
                            variant="outlined"
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            placeholder="Pesquisar por nome"
                            :oninput="initialize"
                        ></v-text-field>
                    </div>
                    <v-dialog v-model="deleteDialog" max-width="500px">
                        <v-card
                            rounded="lg"
                            style="border-radius: 10px; overflow: hidden"
                        >
                            <v-card
                                style="
                                    background: url(/image.png);
                                    background-size: 800px;
                                    background-color: hsl(200, 100%, 20%);
                                    background-blend-mode: color-dodge;
                                    background-position-y: 100px;
                                    background-position-x: -50px;
                                    padding: 10px;
                                "
                                rounded="lg"
                            >
                                <v-card-title>
                                    Deletar {{ title }}?
                                </v-card-title>
                            </v-card>
                            <v-card-text>
                                Tem certeza que deseja deletar
                                {{ title.toLowerCase() }} '{{
                                    entityToDelete?.name
                                }}'?
                            </v-card-text>
                            <v-card-actions
                                style="
                                    padding: 15px;
                                    background: hsl(0, 0%, 10%);
                                    border-radius: 10px;
                                    outline: 1px solid hsl(0, 0%, 0%);
                                "
                            >
                                <v-btn
                                    color="blue darken-1"
                                    variant="outlined"
                                    @click="closeDeleteEntity"
                                >
                                    Cancelar
                                </v-btn>
                                <v-btn
                                    color="blue darken-1"
                                    variant="outlined"
                                    @click="deleteEntityConfirm"
                                >
                                    Deletar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item.category.name="{ item }">
                <span v-if="(item as any).category?.name">
                    {{ (item as any).category?.name }}
                </span>
                <span v-else style="color: orange"> Sem categoria </span>
            </template>
            <template v-slot:item.actions="{ item }">
                <div style="display: flex; justify-content: end; gap: 5px">
                    <v-icon
                        size="small"
                        icon="mdi-pencil"
                        @click="editEntity(item)"
                    >
                    </v-icon>
                    <v-icon
                        size="small"
                        icon="mdi-delete"
                        @click="deleteEntity(item)"
                    >
                    </v-icon>
                </div>
            </template>
        </v-data-table-server>
    </v-card>
</template>
