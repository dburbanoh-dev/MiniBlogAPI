# MiniBlog API 🚀

REST API para la plataforma **MiniBlog** de DevSpark. Gestiona usuarios y publicaciones con persistencia en PostgreSQL.

---

## Descripción del proyecto

MiniBlog API es el backend inicial del servicio de contenidos de DevSpark. Expone endpoints CRUD para **usuarios** y **posts**, con validaciones, manejo de errores y documentación OpenAPI lista para ser consumida por el equipo frontend o integrada en pipelines de CI/CD.

**Stack:**

| Tecnología | Rol |
| Node.js 18+ | Runtime |
| Express 4 | Framework HTTP |
| PostgreSQL | Base de datos |
| pg | Driver SQL directo |
| express-validator | Validaciones |
| Jest + Supertest | Testing |

---

## Estructura del proyecto

miniblog/

├── src/

│   ├── app.js

│   ├── index.js

│   ├── db/index.js

│   ├── controllers/

│   │   ├── userController.js

│   │   └── postController.js

│   ├── services/

│   │   ├── userService.js

│   │   └── postService.js

│   ├── routes/

│   │   ├── users.js

│   │   └── posts.js

│   └── middleware/

│       └── errorHandler.js

├── tests/

│   ├── userService.test.js

│   ├── postService.test.js

│   └── controllers.test.js

├── sql/

│   ├── seed.sql

│   ├── setup.js

│   └── seed.js

├── .env

├── .gitignore

└── README.md

## Ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/dburbanoh-dev/MiniBlogAPI.git
cd MiniBlogAPI
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear la base de datos (si no existe)

```bash
psql -U postgres -c "CREATE DATABASE miniblog;"
```

### 4. Ejecutar el schema SQL

```bash
npm run db:setup
```

### 5. (Opcional) Cargar datos de prueba

```bash
npm run db:seed
```

### 6. Iniciar el servidor

```bash
# Modo desarrollo (hot-reload)
npm run dev

# Modo producción
npm start
```

La API queda disponible en `http://localhost:5000`.  
Comprobación rápida: `curl http://localhost:5000/health` → `{"status":"ok"}`

---

## Endpoints disponibles

| Método | Ruta | Descripción |

| GET | /health | Health check |

| GET | /api/users | Listar usuarios |

| POST | /api/users | Crear usuario |

| GET | /api/users/:id | Obtener usuario |

| PATCH | /api/users/:id | Actualizar usuario |

| DELETE | /api/users/:id | Eliminar usuario |

| GET | /api/posts | Listar posts (`?user_id=1` opcional) |

| POST | /api/posts | Crear post |

| GET | /api/posts/:id | Obtener post |

| PATCH | /api/posts/:id | Actualizar post |

| DELETE | /api/posts/:id | Eliminar post |

---

## Cómo ejecutar los tests

Los tests son unitarios y no requieren base de datos (el pool de pg está mockeado).

```bash
# Ejecutar todos los tests
npm test

# Con reporte de cobertura
npm run test:coverage
```

---

## Guía de deployment en Railway

### Pasos

1. **Crear cuenta** en [railway.app](https://railway.app)

2. **Nuevo proyecto** → "Deploy from GitHub repo" → selecciona este repositorio

3. **Agregar PostgreSQL**: dentro del proyecto Railway → "New" → "Database" → "PostgreSQL"

4. **Variables de entorno**: en el servicio Node.js, Railway inyecta `DATABASE` automáticamente cuando conectas el plugin de Postgres. Agrega manualmente:

5. **Start command**: Railway detecta el `package.json` y usa `npm start`. Si no lo hace, ve a Settings → Start Command → `node src/index.js`

6. **Inicializar el schema** una vez desplegado: en el shell de Railway (o desde tu máquina apuntando al `DATABASE_URL` de Railway):

7. **URLs**:
   - **Internal URL** (entre servicios dentro de Railway): `miniblog-api.railway.internal`
   - **Public URL**: visible en el panel de Railway → tu servicio → "Settings" → "Public Networking"

> ⚠️ Nunca subas el archivo `.env` a Git. Usa `.env.example` como plantilla y configura los valores reales en el panel de Railway.

---

## Esquema de base de datos

```sql
users
  id          SERIAL PRIMARY KEY
  username    VARCHAR(50)  UNIQUE NOT NULL
  email       VARCHAR(255) UNIQUE NOT NULL
  created_at  TIMESTAMPTZ DEFAULT NOW()

posts
  id          SERIAL PRIMARY KEY
  title       VARCHAR(255) NOT NULL
  body        TEXT NOT NULL
  published   BOOLEAN DEFAULT FALSE
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
  created_at  TIMESTAMPTZ DEFAULT NOW()
  updated_at  TIMESTAMPTZ DEFAULT NOW()
```

---

## Registro de uso de IA

Este proyecto fue desarrollado con asistencia de **Claude (Anthropic)** como herramienta de apoyo al desarrollo.

| Área | Uso de IA |

| Arquitectura | Validación de estructura de carpetas (controllers / services / routes) y separación de responsabilidades |

| Tests | Generación de mocks para pg y estructura de los test suites con Jest |

| OpenAPI | Generación del borrador YAML y revisión de schemas |

Todo el código fue revisado, ajustado y validado por el equipo de desarrollo. La IA actuó como asistente, no como autor final.
