import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AppButton, commonStyles } from '../components/common';
import { SERVER_URL } from '../config';
import { selectImage } from '../utils/imagePicker';

const AnalyzeScreen = () => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        setAnalysisResult(null);

        const formData = new FormData();
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Obtenemos el nombre original del archivo de la URI
        const filename = image.uri.split('/').pop() || 'photo.jpg';
        // Creamos un nombre de archivo único usando la fecha actual para evitar problemas de caché
        const uniqueFilename = `${Date.now()}-${filename}`;
        // --- FIN DE LA CORRECCIÓN ---

        formData.append('photo', { uri: image.uri, type: 'image/jpeg', name: uniqueFilename } as any);
        
        try {
            const response = await fetch(`${SERVER_URL}/analyze`, { method: 'POST', body: formData });
            const result = await response.json();
            setAnalysisResult(result);
        } catch (e) { Alert.alert('Error del Servidor', `No se pudo conectar: ${(e as Error).message}`); } 
        finally { setLoading(false); }
    };

    if (loading) {
        return <View style={commonStyles.centeredMessage}><ActivityIndicator size="large" color="#007AFF" /></View>
    }

    return (
        <ScrollView contentContainerStyle={commonStyles.screenContent}>
            <Text style={commonStyles.screenTitle}>Analizar Rostro</Text>
            <TouchableOpacity onPress={() => selectImage(setImage)}>
                <Image source={image ? { uri: image.uri } : { uri: 'https://placehold.co/180x180/E0E0E0/CCCCCC?text=Toca' }} style={commonStyles.imagePreview} />
            </TouchableOpacity>
            <AppButton title="Analizar Imagen" onPress={handleAnalyze} disabled={!image} />
            {analysisResult && (
                <View style={commonStyles.resultContainer}>
                    {analysisResult.match ? (
                        <>
                            <Text style={commonStyles.resultTitle}>✅ Coincidencia Encontrada</Text>
                            <Image source={{ uri: analysisResult.profile.photo_url }} style={commonStyles.resultImage} />
                            <Text style={commonStyles.resultText}><Text style={commonStyles.boldText}>Nombre:</Text> {analysisResult.profile.nombre} {analysisResult.profile.apellidos}</Text>
                            <Text style={commonStyles.resultText}><Text style={commonStyles.boldText}>Código:</Text> {analysisResult.profile.codigo_estudiante}</Text>
                            <View style={[commonStyles.alertBox, { backgroundColor: analysisResult.profile.requisitoriado ? '#FFDADC' : '#D4EDDA' }]}>
                                <Text style={[commonStyles.alertText, { color: analysisResult.profile.requisitoriado ? '#D9342B' : '#155724' }]}>{analysisResult.profile.requisitoriado ? '¡ALERTA: REQUISITORIADO!' : 'SIN REQUISITORIA'}</Text>
                            </View>
                        </>
                    ) : (
                         <>
                            <Text style={commonStyles.resultTitle}>❌ Sin Coincidencia</Text>
                            <Text style={commonStyles.resultText}>{analysisResult.reason || 'El rostro no corresponde a ningún perfil.'}</Text>
                        </>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

export default AnalyzeScreen;