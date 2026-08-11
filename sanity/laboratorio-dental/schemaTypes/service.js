// schemas/service.js
export default {
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nombre del servicio",
      type: "string",
      validation: (Rule) => Rule.required()
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
