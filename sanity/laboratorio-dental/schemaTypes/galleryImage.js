// schemaTypes/galleryImage.js
export default {
  name: "galleryImage",
  title: "Imagen de galería",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Imagen",
      type: "image",
      options: { hotspot: true }, // permite elegir el punto de recorte
      validation: (Rule) => Rule.required()
    },
    {
      name: "caption",
      title: "Descripción breve (opcional)",
      type: "string"
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
  ],
  preview: {
    select: { title: "caption", media: "image" }
  }
};
