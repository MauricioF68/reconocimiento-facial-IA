# 👨‍🔬 Reconocimiento de Rostros con IA (Backend Flask + Frontend React Native)

## ✨ Descripción General

Este proyecto integral de **reconocimiento y análisis facial** permite identificar individuos en imágenes o a través de la cámara, contrastándolos con una base de datos de rostros registrados. Su funcionalidad principal radica en la capacidad de registrar rostros junto con datos personales como **nombres, apellidos, correos electrónicos y códigos de estudiante**, incluyendo una distinción crucial de si la persona está **"requisitoriada" o "no requisitoriada"**.

Mediante avanzadas técnicas de visión por computadora, el sistema puede tomar una nueva imagen (ya sea de la cámara o de una galería) y realizar un reconocimiento facial para **recuperar y mostrar instantáneamente todos los datos asociados al individuo, incluyendo su estado de requisitoria**. Es una herramienta potente y versátil, ideal para aplicaciones de seguridad, control de acceso, o gestión de identidad en entornos educativos y de vigilancia.

## 🚀 Tecnologías Clave

Este proyecto se ha desarrollado utilizando una pila de tecnologías modernas y eficientes:

**Backend (Análisis Facial y API):**
* **Python:** Lenguaje principal de desarrollo.
* **Flask:** Microframework ligero para la creación de la API REST.
* **`face_recognition`:** Librería robusta para la detección y reconocimiento facial, basada en `dlib`.
* **`numpy`:** Esencial para el manejo eficiente de datos numéricos, especialmente en el procesamiento de encodings faciales.
* **`firebase_admin`:** Para la integración con los servicios de Google Firebase:
    * **Firestore:** Base de datos NoSQL para almacenar los datos personales y el estado de requisitoria.
    * **Cloud Storage:** Para el almacenamiento seguro de las imágenes de los rostros registrados.
* **`werkzeug.utils` y `os`:** Utilidades para la gestión de archivos y rutas.

**Frontend (Aplicación Móvil):**
* **React Native:** Framework para construir la interfaz de usuario de la aplicación móvil, permitiendo un desarrollo multiplataforma.
* **Expo:** Un marco de trabajo y plataforma que simplifica el desarrollo y despliegue de aplicaciones React Native.

## 📂 Estructura del Proyecto

El proyecto se organiza modularmente para mantener una clara separación entre el servidor y la aplicación cliente:

.
├── dev/
│   ├── backend_facial/    # Contiene toda la lógica del servidor Flask y la IA.
│   └── frontend_facial/   # Contiene el código de la aplicación móvil React Native.
├── .gitignore             # Archivos y carpetas ignorados por Git.
├── README.md              # Este documento.
└── (otros archivos globales)


## 🛠️ Requisitos Previos

Antes de configurar el proyecto, asegúrate de tener instalados los siguientes programas:

* **Git:** Para clonar el repositorio. [Descargar Git](https://git-scm.com/downloads)
* **Python 3.x:** Para ejecutar el backend. [Descargar Python](https://www.python.org/downloads/)
* **pip:** Gestor de paquetes de Python (incluido con Python 3.4+).
* **Node.js y npm:** Para el desarrollo de la aplicación React Native. [Descargar Node.js (incluye npm)](https://nodejs.org/es/download/)
* **Expo CLI:** Herramienta de línea de comandos para Expo. Instálala globalmente:
    ```bash
    npm install -g expo-cli
    ```

## ⬇️ Pasos de Configuración e Instalación

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

### 1. Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/MauricioF68/reconocimiento-facial-IA.git
cd reconocimiento-facial-IA
2. Configuración del Backend
Navega a la carpeta del backend, crea un entorno virtual (altamente recomendado) e instala las dependencias.

Bash

cd dev/backend_facial

# Crear y activar un entorno virtual
python -m venv venv
# En Windows:
.\venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias de Python
# Asegúrate de tener un archivo requirements.txt con todas las librerías listadas.
# Si no lo tienes, puedes instalar las principales manualmente:
pip install Flask firebase-admin face_recognition numpy werkzeug
# O si ya tienes un requirements.txt (recomendado):
# pip install -r requirements.txt
Configuración de Credenciales de Firebase:

Para que el backend se comunique con Firestore y Cloud Storage:

Accede a tu Consola de Firebase.

Ve a "Configuración del proyecto" (Project settings) > "Cuentas de servicio" (Service accounts).

Haz clic en "Generar nueva clave privada" (Generate new private key) para descargar un archivo JSON (ej. tu-proyecto-firebase-adminsdk-xxxxx.json).

Coloca este archivo JSON dentro de la carpeta dev/backend_facial y asegúrate de que tu código Flask lo referencie correctamente.

3. Configuración del Frontend
Abre una nueva terminal o pestaña y navega a la carpeta del frontend:

Bash

cd C:\proyecto_analisis_rostros\dev\frontend_facial
Instala las dependencias de Node.js:

Bash

npm install
Configuración de la Conexión con el Backend:

Tu aplicación React Native necesita saber la URL de tu API de Flask.

Durante el desarrollo local, si pruebas en un dispositivo físico, no uses localhost. Deberás usar la dirección IP de tu computadora en la red local.

Ubica el archivo en tu frontend donde se definen las URLs de la API (ej. src/config.js o similar). Modifica la URL base para apuntar a tu backend.

JavaScript

// Ejemplo (ajusta el archivo según la estructura de tu proyecto React Native)
// Por ejemplo, en un archivo como src/config.js
export const API_BASE_URL = 'http://[TU_IP_LOCAL]:5000'; // EJ: http://192.168.1.100:5000
// ¡Asegúrate de reemplazar [TU_IP_LOCAL] con la IP de tu PC y 5000 con el puerto de tu backend!
🏃 Cómo Ejecutar el Proyecto (Local)
Con ambas partes configuradas, puedes iniciar la aplicación:

1. Iniciar el Backend
Desde la terminal en dev/backend_facial (con el entorno virtual activado):

Bash

python app.py
# O si tu aplicación Flask se ejecuta con el comando 'flask run':
# flask run
El backend se iniciará y te indicará el puerto donde está escuchando (comúnmente http://127.0.0.1:5000).

2. Iniciar el Frontend (con Expo)
Desde la terminal en dev/frontend_facial:

Bash

expo start
Esto abrirá las Expo Dev Tools en tu navegador y mostrará un código QR en la terminal.

Para ejecutar en tu teléfono: Descarga la aplicación Expo Go (disponible en Google Play Store y App Store). Escanea el código QR desde la app Expo Go o directamente con la cámara de tu teléfono (en iOS).

Para ejecutar en un emulador/simulador: Utiliza las opciones "Run on Android emulator" o "Run on iOS simulator" desde las Expo Dev Tools en tu navegador.

🤝 Flujo de Comunicación
Frontend ↔ Backend: La aplicación React Native (Frontend) se comunica con el servidor Flask (Backend) mediante peticiones HTTP a la API RESTful. Las imágenes y datos son enviados para registro o reconocimiento, y los resultados son recibidos y mostrados en la interfaz.

Backend ↔ Firebase: El servidor Flask interactúa con Firebase Firestore para gestionar los datos de los usuarios (nombres, estados de requisitoria) y con Firebase Cloud Storage para almacenar las imágenes de los rostros. La librería face_recognition se encarga de procesar las imágenes y generar los "encodings" faciales que son almacenados junto a los datos en Firestore, facilitando el proceso de búsqueda y comparación.

🚀 Despliegue del Proyecto
Este README.md se centra en la configuración y ejecución local del proyecto.

Para un despliegue en producción de tu aplicación, los pasos son más avanzados:

Backend (Flask): Requerirá ser alojado en un servidor web (como Nginx o Apache) junto con un servidor WSGI (como Gunicorn o uWSGI), y ser desplegado en una plataforma cloud (ej. Heroku, AWS, Google Cloud, Azure).

Frontend (React Native): Podrás generar un build de producción (.apk para Android o .ipa para iOS) utilizando los comandos de Expo, como expo build:android o expo build:ios, para su distribución en tiendas de aplicaciones.

📝 Autor
MauricioF68 - https://github.com/MauricioF68


