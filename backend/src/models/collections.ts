const Models = {
    Recipes: "Recipes",
    Users: "Users",
};
export { Models as ModelRefs };


type SchemaFields<T> = {
    [K in keyof T]: any;
};

export { SchemaFields };