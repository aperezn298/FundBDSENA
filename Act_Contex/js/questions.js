const QUESTIONS = [
  {
    "topic": "HTML",
    "type": "single",
    "prompt": "¿Qué significa HTML?",
    "options": [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlink Text Manager"
    ],
    "answer": 0,
    "explain": "HTML es un lenguaje de marcado."
  },
  {
    "topic": "HTML",
    "type": "tf",
    "prompt": "HTML es un lenguaje de programación.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 1,
    "explain": "HTML estructura contenido; no es un lenguaje de programación."
  },
  {
    "topic": "HTML",
    "type": "single",
    "prompt": "¿Qué etiqueta representa un enlace?",
    "options": [
      "<link>",
      "<a>",
      "<href>"
    ],
    "answer": 1,
    "explain": "La etiqueta <a> crea hipervínculos."
  },
  {
    "topic": "HTML",
    "type": "fill",
    "prompt": "Complete la etiqueta semántica para el contenido principal: <____>.",
    "options": [],
    "answer": [
      "main",
      "<main>"
    ],
    "explain": "main representa el contenido principal."
  },
  {
    "topic": "HTML",
    "type": "multi",
    "prompt": "Seleccione etiquetas semánticas de HTML5.",
    "options": [
      "<header>",
      "<section>",
      "<div>",
      "<footer>"
    ],
    "answer": [
      0,
      1,
      3
    ],
    "explain": "header, section y footer expresan significado estructural."
  },
  {
    "topic": "HTML",
    "type": "match",
    "prompt": "Relacione las etiquetas con su función.",
    "options": [
      "<img>",
      "<ul>",
      "<form>"
    ],
    "answer": [
      1,
      2,
      0
    ],
    "explain": "img: imagen; ul: lista; form: formulario.",
    "matchLabels": [
      "Formulario",
      "Imagen",
      "Lista sin orden"
    ]
  },
  {
    "topic": "HTML",
    "type": "tf",
    "prompt": "El atributo alt proporciona texto alternativo a una imagen.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 0,
    "explain": "alt describe una imagen cuando no se muestra y mejora accesibilidad."
  },
  {
    "topic": "HTML",
    "type": "single",
    "prompt": "¿Qué atributo identifica un elemento de forma única?",
    "options": [
      "class",
      "id",
      "style"
    ],
    "answer": 1,
    "explain": "id debe ser único en el documento."
  },
  {
    "topic": "HTML",
    "type": "fill",
    "prompt": "Complete el atributo de un campo obligatorio: <input ____>.",
    "options": [],
    "answer": [
      "required",
      "required=\"required\"",
      "required='required'"
    ],
    "explain": "required exige diligenciar el campo antes de enviar el formulario."
  },
  {
    "topic": "HTML",
    "type": "single",
    "prompt": "¿Cuál es la etiqueta para un encabezado de nivel 1?",
    "options": [
      "<h1>",
      "<head>",
      "<title>"
    ],
    "answer": 0,
    "explain": "h1 es el encabezado principal."
  },
  {
    "topic": "CSS",
    "type": "single",
    "prompt": "¿Qué propiedad cambia el color del texto?",
    "options": [
      "background",
      "color",
      "font-style"
    ],
    "answer": 1,
    "explain": "color define el color del texto."
  },
  {
    "topic": "CSS",
    "type": "tf",
    "prompt": "CSS permite separar la presentación del contenido HTML.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 0,
    "explain": "CSS controla estilos visuales."
  },
  {
    "topic": "CSS",
    "type": "fill",
    "prompt": "Complete la propiedad CSS para el tamaño del texto: font-____.",
    "options": [],
    "answer": [
      "size"
    ],
    "explain": "font-size determina el tamaño de fuente."
  },
  {
    "topic": "CSS",
    "type": "multi",
    "prompt": "¿Cuáles son propiedades del modelo de caja?",
    "options": [
      "margin",
      "padding",
      "border",
      "font-family"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "Margin, padding y border forman parte del modelo de caja."
  },
  {
    "topic": "CSS",
    "type": "match",
    "prompt": "Relacione selector y significado.",
    "options": [
      "#menu",
      ".tarjeta",
      "p"
    ],
    "answer": [
      2,
      1,
      0
    ],
    "explain": "# es ID; . es clase; p es etiqueta.",
    "matchLabels": [
      "Etiqueta p",
      "Clase tarjeta",
      "ID menu"
    ]
  },
  {
    "topic": "CSS",
    "type": "single",
    "prompt": "¿Qué declaración activa Flexbox?",
    "options": [
      "display: grid",
      "display: flex",
      "position: flex"
    ],
    "answer": 1,
    "explain": "display: flex activa el modelo flexible."
  },
  {
    "topic": "CSS",
    "type": "tf",
    "prompt": "padding define el espacio exterior al borde.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 1,
    "explain": "padding es interior; margin es exterior."
  },
  {
    "topic": "CSS",
    "type": "single",
    "prompt": "¿Qué regla permite estilos según ancho de pantalla?",
    "options": [
      "@media",
      "@import",
      "@font-face"
    ],
    "answer": 0,
    "explain": "@media define consultas de medios."
  },
  {
    "topic": "CSS",
    "type": "fill",
    "prompt": "Complete la propiedad para el color de fondo: background-____.",
    "options": [],
    "answer": [
      "color"
    ],
    "explain": "background-color cambia el fondo."
  },
  {
    "topic": "CSS",
    "type": "single",
    "prompt": "¿Qué selector tiene mayor especificidad entre estos?",
    "options": [
      "p",
      ".texto",
      "#titulo"
    ],
    "answer": 2,
    "explain": "Un selector de ID supera a clase y tipo en especificidad."
  },
  {
    "topic": "Bootstrap",
    "type": "single",
    "prompt": "¿Qué clase crea un contenedor de ancho adaptable con puntos de ruptura?",
    "options": [
      "container",
      "row",
      "col"
    ],
    "answer": 0,
    "explain": "container tiene anchos máximos por breakpoint."
  },
  {
    "topic": "Bootstrap",
    "type": "tf",
    "prompt": "Bootstrap incluye un sistema de cuadrícula de 12 columnas.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 0,
    "explain": "Su grid se basa en 12 columnas."
  },
  {
    "topic": "Bootstrap",
    "type": "fill",
    "prompt": "Complete la clase de botón principal: btn btn-____.",
    "options": [],
    "answer": [
      "primary"
    ],
    "explain": "btn-primary aplica la variante principal."
  },
  {
    "topic": "Bootstrap",
    "type": "multi",
    "prompt": "Seleccione clases de utilidad de Bootstrap 5.",
    "options": [
      "mt-3",
      "text-center",
      "d-flex",
      "font-size-18"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "Las tres primeras son utilidades incorporadas."
  },
  {
    "topic": "Bootstrap",
    "type": "match",
    "prompt": "Relacione clase y utilidad.",
    "options": [
      "p-3",
      "d-none",
      "text-end"
    ],
    "answer": [
      2,
      0,
      1
    ],
    "explain": "p es padding; d-none oculta; text-end alinea.",
    "matchLabels": [
      "Ocultar elemento",
      "Alinear texto al final",
      "Padding en todos los lados"
    ]
  },
  {
    "topic": "Bootstrap",
    "type": "single",
    "prompt": "¿Qué clase representa una fila de la cuadrícula?",
    "options": [
      "grid",
      "row",
      "container-fluid"
    ],
    "answer": 1,
    "explain": "row agrupa columnas."
  },
  {
    "topic": "Bootstrap",
    "type": "tf",
    "prompt": "La clase col-md-6 ocupa seis columnas desde el breakpoint md.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 0,
    "explain": "Seis de doce columnas desde md."
  },
  {
    "topic": "Bootstrap",
    "type": "single",
    "prompt": "¿Cuál es la clase de una alerta de éxito?",
    "options": [
      "alert alert-success",
      "success-alert",
      "bg-alert"
    ],
    "answer": 0,
    "explain": "Bootstrap usa alert y su variante."
  },
  {
    "topic": "Bootstrap",
    "type": "fill",
    "prompt": "Complete la clase para ocultar un elemento: d-____.",
    "options": [],
    "answer": [
      "none"
    ],
    "explain": "d-none aplica display:none."
  },
  {
    "topic": "Bootstrap",
    "type": "single",
    "prompt": "¿Qué clase crea un contenedor de ancho completo?",
    "options": [
      "container-fluid",
      "container-fixed",
      "full-container"
    ],
    "answer": 0,
    "explain": "container-fluid ocupa el 100% del ancho."
  },
  {
    "topic": "Git",
    "type": "single",
    "prompt": "¿Qué comando inicializa un repositorio?",
    "options": [
      "git start",
      "git init",
      "git create"
    ],
    "answer": 1,
    "explain": "git init inicializa un repositorio."
  },
  {
    "topic": "Git",
    "type": "tf",
    "prompt": "Git y GitHub son exactamente la misma herramienta.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 1,
    "explain": "Git es control de versiones; GitHub aloja repositorios y colaboración."
  },
  {
    "topic": "Git",
    "type": "fill",
    "prompt": "Complete el comando para ver el estado: git ____.",
    "options": [],
    "answer": [
      "status"
    ],
    "explain": "git status muestra cambios y staging."
  },
  {
    "topic": "Git",
    "type": "multi",
    "prompt": "Seleccione comandos válidos de Git.",
    "options": [
      "git add",
      "git commit",
      "git push",
      "git upload"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "upload no es un subcomando estándar."
  },
  {
    "topic": "Git",
    "type": "match",
    "prompt": "Relacione comando y función.",
    "options": [
      "git clone",
      "git pull",
      "git log"
    ],
    "answer": [
      1,
      2,
      0
    ],
    "explain": "clone copia; pull obtiene e integra; log muestra historial.",
    "matchLabels": [
      "Ver historial",
      "Copiar repositorio",
      "Traer e integrar cambios"
    ]
  },
  {
    "topic": "Git",
    "type": "single",
    "prompt": "¿Qué comando prepara un archivo para commit?",
    "options": [
      "git add",
      "git commit",
      "git push"
    ],
    "answer": 0,
    "explain": "git add lleva cambios al staging area."
  },
  {
    "topic": "Git",
    "type": "tf",
    "prompt": "git commit registra una instantánea de cambios preparados.",
    "options": [
      "Verdadero",
      "Falso"
    ],
    "answer": 0,
    "explain": "commit registra cambios en el historial local."
  },
  {
    "topic": "Git",
    "type": "single",
    "prompt": "¿Qué archivo define exclusiones de seguimiento?",
    "options": [
      ".gitignore",
      ".gitconfig",
      "README.md"
    ],
    "answer": 0,
    "explain": ".gitignore define patrones de archivos ignorados."
  },
  {
    "topic": "Git",
    "type": "fill",
    "prompt": "Complete el comando para crear una rama llamada 'nueva-rama': git branch ____.",
    "options": [],
    "answer": [
      "nueva-rama",
      "nueva_rama",
      "nombre-rama",
      "nombre_rama",
      "rama",
      "nombre",
      "<nueva-rama>",
      "<nombre-rama>"
    ],
    "explain": "git branch seguido del nombre crea una rama local."
  },
  {
    "topic": "Git",
    "type": "single",
    "prompt": "¿Qué comando muestra el historial de commits?",
    "options": [
      "git status",
      "git log",
      "git diff"
    ],
    "answer": 1,
    "explain": "git log presenta el historial."
  }
];
