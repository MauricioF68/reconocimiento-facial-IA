import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, StyleSheet, Switch,TouchableOpacity } from 'react-native';

import { AppButton, commonStyles } from '../components/common';
import { SERVER_URL } from '../config';
import { Profile, ScreenName } from '../types';

const EditProfileScreen = ({ profile, navigate }: { profile: Profile, navigate: (s: ScreenName) => void }) => {
    // El formulario empieza con los datos del perfil que estamos editando
    const [formData, setFormData] = useState({
        nombre: profile.nombre,
        apellidos: profile.apellidos,
        codigo_estudiante: profile.codigo_estudiante,
        correo: profile.correo,
    });
    const [isRequisitoriado, setIsRequisitoriado] = useState(profile.requisitoriado);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/profiles/${profile.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, requisitoriado: isRequisitoriado }),
            });
            const result = await response.json();
            if (response.ok) {
                Alert.alert("Éxito", "Perfil actualizado correctamente.");
                navigate('ProfileList');
            } else {
                Alert.alert("Error", result.error || "No se pudo actualizar el perfil.");
            }
        } catch (e) {
            Alert.alert("Error del Servidor", `No se pudo conectar: ${(e as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={commonStyles.screenContent}>
            <Text style={commonStyles.screenTitle}>Editar Perfil</Text>
            <TextInput style={styles.input} placeholder="Nombre(s)" value={formData.nombre} onChangeText={text => setFormData({...formData, nombre: text})} />
            <TextInput style={styles.input} placeholder="Apellidos" value={formData.apellidos} onChangeText={text => setFormData({...formData, apellidos: text})} />
            <TextInput style={styles.input} placeholder="Código de Estudiante" value={formData.codigo_estudiante} onChangeText={text => setFormData({...formData, codigo_estudiante: text})} />
            <TextInput style={styles.input} placeholder="Correo Electrónico" value={formData.correo} keyboardType="email-address" autoCapitalize="none" onChangeText={text => setFormData({...formData, correo: text})} />
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>¿Está requisitoriado?</Text>
                <Switch trackColor={{ false: "#767577", true: "#f5dd4b" }} thumbColor={isRequisitoriado ? "#f4a261" : "#f4f3f4"} onValueChange={setIsRequisitoriado} value={isRequisitoriado} />
            </View>
            <AppButton title="Guardar Cambios" onPress={handleUpdate} disabled={loading} />
            <TouchableOpacity onPress={() => navigate('ProfileList')}>
                <Text style={{color: '#007AFF', marginTop: 15}}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    input: { height: 50, borderColor: '#C6C6C8', borderWidth: 1, borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, width: '100%', backgroundColor: 'white', fontSize: 16 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20, paddingVertical: 10 },
    switchLabel: { fontSize: 16, color: '#333' },
});

export default EditProfileScreen;