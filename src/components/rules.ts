export const emptyRule = (value: string) =>
    value ? true : "Esse campo é obrigatório";
export const priceRule = (value: string) =>
    parseFloat(value) > 0 ? true : "Preço deve ser maior que 0";
export const catIdRule = (value: string) =>
    parseFloat(value) > 0
        ? true
        : "Id da categoria deve ser um inteiro positivo";
export const quantityRule = (value: string) =>
    parseInt(value) >= 0 ? true : "Quantidade deve ser um inteiro não negativo";
