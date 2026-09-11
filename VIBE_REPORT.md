# Vibe Report — EcoTrack

## Cómo configuré las reglas del agente

Antes de pedir la interfaz, dejé por escrito las decisiones que normalmente
tomaría línea a línea. El archivo `.cursorrules` fija el rol (copiloto que
ejecuta, yo orquesto), el stack (Next.js App Router + TypeScript, CSS propio,
sin Tailwind), el estilo (módulos pequeños, tipado explícito, comentarios
solo para el “por qué”) y los límites del MVP: sin auth, sin base de datos,
sin microservicios. También copié esas reglas a `.cursor/rules/ecotrack.mdc`
para que Cursor las aplique en cada sesión. Con eso definido, el prompt de
arquitectura fue una intención, no un diseño técnico: una pantalla donde
alguien escribe “Hoy comí carne y viajé 20km en bus” y recibe un estimado
de CO2. El agente eligió parser por palabras clave en el cliente, factores
redondeados de fuentes públicas y un historial en memoria. Replit quedó
como el canal de despliegue rápido (`npm run dev` en el puerto 3000), no
como el lugar donde se diseña el producto.

## Dificultades al delegar

La fricción no fue la sintaxis. Fue calibrar cuánta inteligencia pedirle al
modelo. Una primera tentación es conectar GPT o Claude a cada cálculo. Lo
rechacé a propósito: el MVP tiene que ser determinístico, gratis de
ejecutar y fácil de verificar con el ejemplo del enunciado. Delegar bien
no es pedir la solución más sofisticada; es pedir la adecuada al momento
del producto. Otra fricción fue el entorno: había un prototipo Streamlit
previo. En vez de parchearlo a mano, replanteé la visión (Next.js, UI
propia, mismos factores) y dejé que el agente reescribiera el proyecto.
Cuando algo falla, el gesto correcto no es abrir el archivo y “arreglar el
punto y coma”: es pegar el log y describir el síntoma. El costo se mueve
del teclado a la claridad de las reglas. Si `.cursorrules` es vago, el
agente improvisa alcance (auth, bases de datos, librerías de más). Si es
concreto, cada iteración se parece al producto que imaginé.

Una dificultad no anticipada fue de infraestructura, no de diseño: a mitad
de la reescritura a Next.js, Cursor detuvo al agente con "You've hit your
usage limit" (`docs/cursor-usage-limit.png`), sin aviso previo de cuántas
peticiones quedaban disponibles. El ecosistema quedó incompleto por un
momento: recordatorio de que orquestar con IA también depende de una cuota
finita, no solo de la claridad de las reglas.

## De escribir código a orquestar una visión

Se siente menos como programar y más como dirigir. Ya no decido “aquí va
una expresión regular”; decido “quiero un resultado confiable sin API
externa” y dejo la implementación al ejecutor. La ansiedad no desaparece,
cambia de lugar: ya no me preocupa un import, me preocupa si las reglas
son lo bastante claras para que la siguiente sesión —mía o de otro
agente— conserve la misma vibe. Cursor es el taller; Replit es el escenario
público. El archivo de reglas termina siendo más importante que cualquier
commit individual: es la especificación viva del prototipo.
