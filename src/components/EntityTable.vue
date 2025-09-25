<script setup lang="ts">
import { ref, nextTick, type Ref } from "vue";
import type { DataTableHeader } from "vuetify";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { Entities } from "./Main.vue";
import { type Service } from "@/api/service";
import BaseForm from "./BaseForm.vue";

const props = defineProps<{
    title: string;
    headers: DataTableHeader[];
    editedEntity: Ref<Entities>;
    defaultEntity: Entities;
    entities: Ref<Entities[]>;
    service: Service<Entities>;
    customCells?: string[];
}>();

const search = ref("");
const valid = ref(true);
const form = ref();

const refs = { form, valid };

const show = ref(false);
const message = ref("");
const messageColor = ref("");
const loading = ref(false);
const pageSize = ref(5);
const currentPage = ref(1);
const sort = ref<SortItem[]>([{ key: "id" }]);
const editDialog = ref(false);
const deleteDialog = ref(false);
const listLength = ref(0);

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
        const res = await props.service.fetch(
            itemsPerPage,
            page,
            search.value,
            sort.value
        );
        props.entities.value = res.data.content;
        listLength.value = res.data.totalElements;
        currentPage.value = page;
        pageSize.value = itemsPerPage;
        loading.value = false;
    } catch (error) {
        show.value = true;
        messageColor.value = "red";
        message.value = "Erro ao carregar os dados.";
        loading.value = false;
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
    const { valid } = await form.value.validate();
    if (!valid) {
        return;
    }
    const edit = props.editedEntity.value.id !== null;
    try {
        await props.service.save(props.editedEntity.value, edit);
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
};

const deleteEntityConfirm = async () => {
    try {
        await props.service.delete(entityToDelete?.value?.id ?? 0);
        await initialize({
            page: currentPage.value,
            itemsPerPage: pageSize.value,
        });
        closeDeleteEntity();
        messageColor.value = "green";
        show.value = true;
        message.value = "A entidade foi deletada com sucesso";
    } catch (error: any) {
        messageColor.value = "red";
        show.value = true;
        message.value =
            "Erro ao deletar a entidade. " +
            (error?.response?.data?.message ?? "");
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
            :items="props.entities.value"
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
                            <BaseForm
                                :refs="refs"
                                :title="`${entityFormTitle} ${title}`"
                            >
                                <template #actions="{}">
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
                                </template>
                                <template #fields="{}">
                                    <slot> </slot>
                                </template>
                            </BaseForm>
                        </v-dialog>
                        <v-text-field
                            v-model="search"
                            density="compact"
                            variant="outlined"
                            class="search"
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            placeholder="Pesquisar por nome"
                            :oninput="initialize"
                        ></v-text-field>
                    </div>
                    <v-dialog v-model="deleteDialog" max-width="500px">
                        <BaseForm :title="`Deletar ${title}`">
                            <template #fields>
                                <v-card-text
                                    style="
                                        place-self: center;
                                        padding: 0;
                                        padding-bottom: 20px;
                                    "
                                >
                                    Tem certeza que deseja deletar
                                    {{ title.toLowerCase() }} '{{
                                        entityToDelete?.name
                                    }}'?
                                </v-card-text>
                            </template>
                            <template #actions>
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
                            </template>
                        </BaseForm>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-for="item in customCells" #[`item.${item}`]="{ value }">
                <slot :name="item" :value="value"></slot>
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

<style>
.search * {
    border: none !important;
}
.search > :first-child {
    border: 1px solid white !important;
    border-radius: 4px;
}
</style>
