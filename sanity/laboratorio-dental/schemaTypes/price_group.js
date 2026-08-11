// schemaTypes/priceGroup.js
export default {
  name: "priceGroup",
  title: "Grupo de precios",
  type: "document",
  fields: [
    { name: "groupName", title: "Nombre del material/grupo", type: "string" }, // ej. "Zirconia"
    { name: "tag", title: "Etiqueta corta", type: "string" }, // ej. "ZrO₂"
    { name: "order", title: "Orden", type: "number" },
    { name: "active", title: "Visible en el sitio", type: "boolean", initialValue: true },
    {
      name: "items",
      title: "Productos",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "product", title: "Producto", type: "string" }, // ej. "Corona (1 a 3 unidades)"
          { name: "deliveryTime", title: "Tiempo de entrega", type: "string" }, // ej. "8 días hábiles"
          { name: "price", title: "Precio", type: "number" }, // ej. 1350
          { name: "priceNote", title: "Nota (opcional)", type: "string" } // ej. "(unidad)"
        ]
      }]
    }
  ]
};