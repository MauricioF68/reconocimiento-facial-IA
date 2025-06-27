# app.py
# Importamos las bibliotecas necesarias
import firebase_admin
from firebase_admin import credentials, firestore, storage
import face_recognition
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

# --- CONFIGURACIÓN INICIAL ---

# Inicializa la aplicación Flask
app = Flask(__name__)

# Configuración para subida de archivos temporales
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- CONFIGURACIÓN DE FIREBASE ---
# Usa el archivo de credenciales que ya tienes en tu carpeta
try:
    cred = credentials.Certificate("firebase_credentials.json")
    # ¡¡IMPORTANTE!! DEBES REEMPLAZAR LA LÍNEA DE ABAJO
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'vision-computacional-myd.firebasestorage.app' 
    })
    db = firestore.client()
    bucket = storage.bucket()
    print("Conexión con Firebase establecida correctamente.")
except Exception as e:
    print(f"Error al conectar con Firebase: {e}")
    db = None
    bucket = None

# Colección en Firestore donde guardaremos los perfiles
PROFILES_COLLECTION = 'profiles'


# --- FUNCIONES AUXILIARES ---

def get_face_encoding(image_stream):
    """
    Recibe un stream de imagen, la carga y devuelve su "encoding" facial.
    Devuelve None si no se encuentra un rostro.
    """
    try:
        image = face_recognition.load_image_file(image_stream)
        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) > 0:
            # Devuelve el encoding del primer rostro encontrado
            return face_encodings[0]
        else:
            return None
    except Exception as e:
        print(f"Error procesando la imagen: {e}")
        return None

# --- RUTAS DE LA API (ENDPOINTS) ---

@app.route('/')
def index():
    return "Servidor de Reconocimiento Facial Activo."

@app.route('/register', methods=['POST'])
def register_profile():
    """
    Registra un nuevo perfil.
    Recibe datos de formulario: nombre, apellidos, codigo_estudiante, correo, requisitoriado
    y un archivo de imagen llamado 'photo'.
    """
    if db is None or bucket is None:
        return jsonify({"error": "No hay conexión con Firebase."}), 500

    if 'photo' not in request.files:
        return jsonify({"error": "No se ha proporcionado ninguna foto."}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({"error": "Nombre de archivo inválido."}), 400

    # Guarda el archivo temporalmente para procesarlo
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Extrae el encoding facial de la imagen
    face_encoding = get_face_encoding(filepath)

    if face_encoding is None:
        os.remove(filepath) # Limpia el archivo temporal
        return jsonify({"error": "No se pudo detectar un rostro en la imagen proporcionada."}), 400

    # Sube la imagen a Firebase Storage
    blob = bucket.blob(f"profile_images/{filename}")
    blob.upload_from_filename(filepath)
    blob.make_public()
    image_url = blob.public_url

    os.remove(filepath) # Limpia el archivo temporal

    # Guarda los datos del perfil en Firestore
    try:
        profile_data = {
            'nombre': request.form.get('nombre'),
            'apellidos': request.form.get('apellidos'),
            'codigo_estudiante': request.form.get('codigo_estudiante'),
            'correo': request.form.get('correo'),
            'requisitoriado': request.form.get('requisitoriado', 'false').lower() in ['true', '1', 't'],
            'photo_url': image_url,
            'face_encoding': face_encoding.tolist() # Se convierte a lista para guardarlo en JSON/Firestore
        }
        
        # Añade el documento a la colección 'profiles'
        doc_ref = db.collection(PROFILES_COLLECTION).add(profile_data)
        
        # Devuelve una respuesta de éxito con el ID del nuevo documento
        return jsonify({"success": True, "id": doc_ref[1].id, "data": profile_data}), 201

    except Exception as e:
        return jsonify({"error": f"Error al guardar en Firestore: {e}"}), 500


@app.route('/analyze', methods=['POST'])
def analyze_image():
    """
    Analiza una imagen y la compara con los perfiles en la base de datos.
    """
    if db is None:
        return jsonify({"error": "No hay conexión con Firebase."}), 500

    if 'photo' not in request.files:
        return jsonify({"error": "No se ha proporcionado ninguna foto para analizar."}), 400

    file = request.files['photo']
    
    # Obtiene el encoding de la imagen a analizar
    unknown_encoding = get_face_encoding(file.stream)
    
    if unknown_encoding is None:
        return jsonify({"match": False, "reason": "No se detectó un rostro en la imagen enviada."})

    # Obtiene todos los perfiles de Firestore
    profiles_ref = db.collection(PROFILES_COLLECTION).stream()
    
    known_encodings = []
    known_profiles_data = []

    for profile in profiles_ref:
        profile_dict = profile.to_dict()
        if 'face_encoding' in profile_dict:
            known_encodings.append(np.array(profile_dict['face_encoding']))
            profile_dict['id'] = profile.id
            known_profiles_data.append(profile_dict)

    if not known_profiles_data:
        return jsonify({"match": False, "reason": "No hay perfiles registrados en la base de datos."})

    # Compara el rostro desconocido con todos los rostros conocidos
    # Un valor de tolerancia más bajo (ej. 0.5) es más estricto.
    matches = face_recognition.compare_faces(known_encodings, unknown_encoding, tolerance=0.5)
    
    try:
        # Busca el índice de la primera coincidencia
        match_index = matches.index(True)
        matched_profile = known_profiles_data[match_index]
        return jsonify({"match": True, "profile": matched_profile})
    except ValueError:
        # Se produce un ValueError si no hay ningún 'True' en la lista
        return jsonify({"match": False, "reason": "No se encontró ninguna coincidencia."})


@app.route('/profiles', methods=['GET'])
def get_all_profiles():
    """Obtiene todos los perfiles registrados."""
    if db is None: return jsonify({"error": "No hay conexión con Firebase."}), 500
    
    try:
        profiles = []
        docs = db.collection(PROFILES_COLLECTION).stream()
        for doc in docs:
            profile_data = doc.to_dict()
            profile_data['id'] = doc.id
            if 'face_encoding' in profile_data:
                del profile_data['face_encoding'] # No enviamos el encoding en la lista general para aligerar la respuesta
            profiles.append(profile_data)
        return jsonify(profiles), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener perfiles: {e}"}), 500

@app.route('/profiles/<string:profile_id>', methods=['PUT', 'DELETE'])
def manage_profile(profile_id):
    """Edita o elimina un perfil por su ID."""
    if db is None: return jsonify({"error": "No hay conexión con Firebase."}), 500

    profile_ref = db.collection(PROFILES_COLLECTION).document(profile_id)

    if request.method == 'PUT':
        # Actualiza los datos del perfil
        data_to_update = request.get_json()
        if not data_to_update:
            return jsonify({"error": "No se proporcionaron datos para actualizar."}), 400
        profile_ref.update(data_to_update)
        return jsonify({"success": True, "message": f"Perfil {profile_id} actualizado."}), 200

    if request.method == 'DELETE':
        # Elimina el perfil de Firestore.
        # En una versión más avanzada, también borraríamos su foto de Firebase Storage.
        profile_ref.delete()
        return jsonify({"success": True, "message": f"Perfil {profile_id} eliminado."}), 200


if __name__ == '__main__':
    # Usamos host='0.0.0.0' para que el servidor sea accesible desde tu red local (necesario para que el móvil se conecte)
    # y el puerto 5000 que es el estándar para Flask.
    app.run(host='0.0.0.0', port=5000, debug=True)