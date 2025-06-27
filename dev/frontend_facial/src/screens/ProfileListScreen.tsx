import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from 'react-native';

import { commonStyles } from '../components/common';
import { SERVER_URL } from '../config';
import { Profile, ScreenName } from '../types';

type FilterType = 'all' | 'requisitoriados' | 'no_requisitoriados';

const ProfileListScreen = ({ navigate }: { navigate: (s: ScreenName, params?: any) => void }) => {
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const fetchProfiles = useCallback(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/profiles`);
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const data = await response.json();
            setAllProfiles(data);
        } catch (e) {
             Alert.alert("Error del Servidor", `No se pudo conectar: ${(e as Error).message}`);
             setAllProfiles([]);
        }
    }, []);
    
    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleDelete = (profile: Profile) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Estás seguro de que quieres eliminar a ${profile.nombre} ${profile.apellidos}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: async () => {
                    try {
                        const response = await fetch(`${SERVER_URL}/profiles/${profile.id}`, { method: 'DELETE' });
                        if (response.ok) {
                            Alert.alert("Éxito", "Perfil eliminado correctamente.");
                            fetchProfiles(); // Refresca la lista después de eliminar
                        } else {
                            const result = await response.json();
                            Alert.alert("Error", result.error || "No se pudo eliminar el perfil.");
                        }
                    } catch(e) {
                         Alert.alert("Error del Servidor", `No se pudo conectar: ${(e as Error).message}`);
                    }
                }},
            ]
        );
    };

    const displayedProfiles = React.useMemo(() => {
        if (activeFilter === 'requisitoriados') return allProfiles.filter(p => p.requisitoriado);
        if (activeFilter === 'no_requisitoriados') return allProfiles.filter(p => !p.requisitoriado);
        return allProfiles;
    }, [allProfiles, activeFilter]);

    return (
        <ScrollView style={{flex: 1}}>
            <View style={styles.screenContentList}>
                <View style={styles.listHeader}>
                  <Text style={commonStyles.screenTitle}>Perfiles Registrados</Text>
                  <TouchableOpacity onPress={fetchProfiles}><Text style={{color: '#007AFF'}}>Refrescar</Text></TouchableOpacity>
                </View>
                <View style={styles.filterContainer}>
                    <FilterButton title="Todos" onPress={() => setActiveFilter('all')} active={activeFilter === 'all'} />
                    <FilterButton title="Requisitoriados" onPress={() => setActiveFilter('requisitoriados')} active={activeFilter === 'requisitoriados'} />
                    <FilterButton title="No Requisitoriados" onPress={() => setActiveFilter('no_requisitoriados')} active={activeFilter === 'no_requisitoriados'} />
                </View>
                {displayedProfiles.length > 0 ? displayedProfiles.map(profile => (
                    <View key={profile.id} style={styles.profileListItem}>
                        <Image source={{ uri: profile.photo_url }} style={styles.profileListImage} />
                        <View style={styles.profileListInfo}>
                            <Text style={styles.profileListName}>{profile.nombre} {profile.apellidos}</Text>
                            <Text>{profile.codigo_estudiante}</Text>
                            <Text style={{color: profile.requisitoriado ? '#D9342B' : '#28A745', fontWeight: 'bold', marginTop: 4}}>{profile.requisitoriado ? 'REQUISITORIADO' : 'SIN REQUISITORIA'}</Text>
                        </View>
                        {/* NUEVO: Botones de acción */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => navigate('EditProfile', { profile })}>
                                <Text style={styles.actionTextEdit}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(profile)}>
                                <Text style={styles.actionTextDelete}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )) : (
                    <View style={commonStyles.centeredMessage}><Text style={{color: '#666'}}>No hay perfiles que coincidan.</Text></View>
                )}
            </View>
        </ScrollView>
    );
};

const FilterButton = ({ title, onPress, active }: { title: string, onPress: () => void, active: boolean }) => (
    <TouchableOpacity onPress={onPress} style={[styles.filterButton, active && styles.filterButtonActive]}>
        <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    screenContentList: { padding: 20 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 10 },
    filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#EFEFEF' },
    filterButtonActive: { backgroundColor: '#007AFF' },
    filterButtonText: { color: '#007AFF' },
    filterButtonTextActive: { color: 'white', fontWeight: 'bold' },
    profileListItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, width: '100%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    profileListImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    profileListInfo: { flex: 1 },
    profileListName: { fontWeight: 'bold', fontSize: 16 },
    actionsContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' },
    actionTextEdit: { color: '#007AFF', marginBottom: 10 },
    actionTextDelete: { color: '#D9342B' },
});

export default ProfileListScreen;