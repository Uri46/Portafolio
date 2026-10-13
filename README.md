# Portafolio Web — Hector Uriel Taño Fernandez

Sitio web de mi portafolio personal donde presento mi perfil como estudiante de Análisis de Sistemas y Desarrollador Python / Django Jr, mis proyectos de programación, mi experiencia y mis certificaciones.

🌐 **Sitio publicado:** [https://uri46.github.io/Portaforio/](https://uri46.github.io/Portaforio/)

## Características

- **Diseño responsive:** Adaptable a dispositivos móviles y escritorio, con menú de navegación desplegable.
- **Animación en Canvas:** Fondo interactivo en la sección principal con red de partículas animadas en 2D (`#heroCanvas`).
- **Interactividad sin librerías externas:** Animaciones de aparición al hacer scroll y contadores numéricos implementados con `IntersectionObserver`, además de grilla y carrusel accesible (`scroll-snap`) para visualizar certificaciones.
- **Secciones incluidas:** Perfil profesional, Habilidades técnicas, Proyectos, Certificaciones, Experiencia y formación, y Contacto.

## Tecnologías utilizadas

- **HTML5**
- **CSS3** (Variables CSS, Flexbox, CSS Grid, CSS Scroll Snap y diseño responsive)
- **JavaScript Vanilla** (Canvas 2D API, IntersectionObserver API y manipulación del DOM)

## Estructura del proyecto

```text
Portaforio/
├── img/
│   ├── proyectos/        # Capturas de los proyectos mostrados en las tarjetas
│   └── titulos/          # Certificados en formato PDF y vistas previas en PNG (previews/)
├── index.html            # Estructura principal del portafolio
├── styles.css            # Estilos, layout y diseño responsive
├── script.js             # Lógica de partículas en Canvas, carrusel y animaciones
└── README.md
```

## Ejecución local

Al ser un sitio estático sin dependencias externas, podés abrir directamente el archivo `index.html` en cualquier navegador o levantarlo con un servidor local simple:

```bash
git clone https://github.com/Uri46/Portaforio.git
cd Portaforio
python -m http.server 8000
```

Luego abrí `http://localhost:8000` en el navegador.
