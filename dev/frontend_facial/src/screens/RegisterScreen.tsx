import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, StyleSheet, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AppButton, commonStyles } from '../components/common';
import { SERVER_URL } from '../config';
import { selectImage } from '../utils/imagePicker';
import { ScreenName } from '../types'; // <-- CORREGIDO: Importamos desde el nuevo archivo

const RegisterScreen = ({ navigate }: { navigate: (s: ScreenName) => void }) => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [formData, setFormData] = useState({ nombre: '', apellidos: '', codigo_estudiante: '', correo: '' });
    const [isRequisitoriado, setIsRequisitoriado] = useState(false);

    const handleRegister = async () => {
        if (!image || !formData.nombre || !formData.codigo_estudiante) { Alert.alert("Campos incompletos", "Nombre, Código y Foto son obligatorios."); return; }
        
        const data = new FormData();
        const filename = image.uri.split('/').pop() || 'photo.jpg';
        const uniqueFilename = `${Date.now()}-${filename}`;
        data.append('photo', { uri: image.uri, type: 'image/jpeg', name: uniqueFilename } as any);
        Object.keys(formData).forEach(key => data.append(key, formData[key as keyof typeof formData]));
        data.append('requisitoriado', String(isRequisitoriado));
        
        try {
            const response = await fetch(`${SERVER_URL}/register`, { method: 'POST', body: data });
            const result = await response.json();
            if (response.ok) {
                Alert.alert("Éxito", `Perfil para ${result.data.nombre} registrado.`);
                navigate('ProfileList');
            } else { Alert.alert("Error de Registro", result.error || "Ocurrió un error."); }
        } catch (e) { Alert.alert("Error del Servidor", `No se pudo conectar: ${(e as Error).message}`); } 
    };

    return (
        <ScrollView contentContainerStyle={commonStyles.screenContent}>
            <Text style={commonStyles.screenTitle}>Registrar Nuevo Perfil</Text>
             <TouchableOpacity onPress={() => selectImage(setImage)}>
                <Image source={image ? { uri: image.uri } : { uri: 'https://placehold.co/180x180/E0E0E0/CCCCCC?text=Toca' }} style={commonStyles.imagePreview} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Nombre(s)" value={formData.nombre} onChangeText={text => setFormData({...formData, nombre: text})} />
            <TextInput style={styles.input} placeholder="Apellidos" value={formData.apellidos} onChangeText={text => setFormData({...formData, apellidos: text})} />
            <TextInput style={styles.input} placeholder="Código de Estudiante" value={formData.codigo_estudiante} onChangeText={text => setFormData({...formData, codigo_estudiante: text})} />
            <TextInput style={styles.input} placeholder="Correo Electrónico" value={formData.correo} keyboardType="email-address" autoCapitalize="none" onChangeText={text => setFormData({...formData, correo: text})} />
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>¿Está requisitoriado?</Text>
                <Switch trackColor={{ false: "#767577", true: "#f5dd4b" }} thumbColor={isRequisitoriado ? "#f4a261" : "#f4f3f4"} onValueChange={setIsRequisitoriado} value={isRequisitoriado} />
            </View>
            <AppButton title="Registrar Perfil" onPress={handleRegister} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    input: { height: 50, borderColor: '#C6C6C8', borderWidth: 1, borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, width: '100%', backgroundColor: 'white', fontSize: 16 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20, paddingVertical: 10 },
    switchLabel: { fontSize: 16, color: '#333' },
});

export default RegisterScreen;