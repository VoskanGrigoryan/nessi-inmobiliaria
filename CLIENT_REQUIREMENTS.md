# Requisitos del cliente

Pedidos recibidos para el sitio inmobiliario y en implementación en esta rama.

1. **Logo del encabezado:** reemplazar el texto “Rosana Nessi Negocios Inmobiliarios” por el logo incluido en el PDF de referencia.
2. **Tipos de propiedad:** sumar lote, depósito, local comercial, cochera y oficina a los tipos existentes. El pedido menciona “cochera [número]”; el número de cocheras también se especifica en el punto 13.
3. **Disposición:** agregar las opciones lateral e interno a las existentes.
4. **Características:** reemplazar la sección o etiqueta “Amenities” por “Características” y agregar el campo Laundry.
5. **Video:** permitir asociar a la propiedad un enlace de YouTube y mostrar el video junto con las imágenes. El video se carga en YouTube; el sitio guarda el enlace.
6. **Google Maps:** agregar un mapa a la propiedad. La configuración de ubicación y el pendiente técnico ya registrado están en [PENDING_TASKS.md](PENDING_TASKS.md).
7. **Acciones en propiedades publicadas:** ofrecer compartir y favoritos. Los favoritos se guardan en la base de datos por usuario; el listado de administración muestra cuáles están marcadas y permite filtrar favoritas y no favoritas.
8. **Compartir:** ofrecer correo electrónico, Facebook, WhatsApp y copiar enlace.
9. **Superficies:** agregar superficie descubierta y superficie semicubierta.
10. **Rampa para discapacitados:** agregar una opción sí/no.
11. **Antigüedad del edificio:** ofrecer en pozo, a estrenar, de 1 a 10 años, de 10 a 20 años y más de 20 años.
12. **Apto crédito:** agregar una opción sí/no.
13. **Cantidad de cocheras:** reemplazar la opción sí/no por un campo numérico editable que permita indicar cero o más cocheras.
14. **Página 13 del PDF:** incorporar al sitio la referencia incluida en la página 13 de `inmob-reference.pdf`.

## Revisar al comenzar la implementación

- Identificar en el PDF el logo y el contenido de la página 13 que se deben incorporar.
- Definir si el mapa muestra la ubicación exacta o aproximada y resolver el pendiente técnico indicado en `PENDING_TASKS.md`.
- Precisar cómo se relaciona el tipo de propiedad “cochera” con el campo de cantidad de cocheras.
