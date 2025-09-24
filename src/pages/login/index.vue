<script setup lang="ts">
import { api } from "@/api/api";
import { ref } from "vue";
import { useRouter } from "vue-router";
const user = ref({ username: null, email: null, password: null });

const router = useRouter();
function login() {
    api.post(`/users/login`, user.value).then((res) => {
        localStorage.setItem("authToken", res.data.token);
        router.push("/");
    });
}
</script>

<template>
    <v-app
        class="bg app"
        style="
            --bg-color: hsl(0, 0%, 10%);
            background-position: 150px 50px !important;
            background-blend-mode: screen;
        "
    >
        <Header title="Product API">
            <v-btn
                style="
                    margin: 0px;
                    margin-right: 20px;
                    background-color: hsl(0, 0%, 100%, 40%);
                "
                variant="outlined"
                @click="() => router.push('/login')"
                >Login
            </v-btn>
            <v-btn
                style="margin: 0px; margin-right: 20px"
                variant="outlined"
                @click="() => router.push('/register')"
                >Registrar
            </v-btn>
        </Header>

        <v-card
            max-width="600"
            width="500px"
            rounded="lg"
            style="margin: auto; padding: 20px"
            class="bg login-card"
        >
            <v-card-title
                style="
                    text-align: center;
                    padding: 0;
                    margin-bottom: 20px;
                    color: hsl(0, 0%, 100%);
                "
                >Formulário de Login</v-card-title
            >
            <v-form
                style="
                    display: flex;
                    flex-direction: column;
                    justify-items: center;
                "
            >
                <v-text-field
                    label="Email"
                    v-model="user.email"
                    type="email"
                    variant="outlined"
                    density="compact"
                    bg-color="hsl(0, 0%, 100%, 20%)"
                />
                <v-text-field
                    label="Senha"
                    v-model="user.password"
                    type="password"
                    variant="outlined"
                    density="compact"
                    bg-color="hsl(0, 0%, 100%, 20%)"
                />
                <v-btn
                    style="margin: 0px; margin-left: auto"
                    variant="outlined"
                    @click="login"
                    >Login</v-btn
                >
            </v-form>
        </v-card>
    </v-app>
</template>

<style>
@media (max-width: 600px) {
    .login-card {
        width: auto !important;
        margin: auto 10px !important;
    }
}
</style>
