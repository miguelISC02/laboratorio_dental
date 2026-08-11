/* ===========================================================
   CONFIGURACIÓN — EDITA ESTOS VALORES
=========================================================== */
const SITE_CONFIG = {
  // Número de WhatsApp en formato internacional, SIN "+", SIN espacios.
  // Ejemplo México: 52 1 55 1234 5678  ->  "5215512345678"
  whatsappNumber: "5215528547022", // Atención WhatsApp Ortega Lab: 55 2854 7022

  // Mensaje base que se prellena en WhatsApp (se le agrega el servicio)
  whatsappMessageBase: "Hola, quiero cotizar",

  // --- Sanity (headless CMS) ---
  // Déjalo en useSanity: false mientras no tengas el proyecto de Sanity listo.
  // El sitio funciona perfecto solo con el HTML (contenido de respaldo).
  sanity: {
    useSanity: true,           // cámbialo a true cuando tengas tu proyecto Sanity
    projectId: "esn28sm4", // lo obtienes al crear el proyecto en sanity.io
    dataset: "production",
    apiVersion: "2024-01-01"
  }
};
