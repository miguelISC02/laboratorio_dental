// schemas/material.js
export default {
  name: "material",
  title: "Material",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nombre del material",
      type: "string",
      validation: (Rule) => Rule.required()
    },
    {
      name: "tag",
      title: "Etiqueta corta (ej. ZrO₂, e.max, PFM)",
      type: "string"
    },
    {
      name: "description",
      title: "Descripción corta",
      type: "text",
      rows: 3
    },
    {
      name: "order",
      title: "Orden (menor número = aparece primero)",
      type: "number",
      initialValue: 0
    },
    {
      name: "active",
      title: "Visible en el sitio",
      type: "boolean",
      initialValue: true
    }
  ]
};
