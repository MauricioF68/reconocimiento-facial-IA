import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import AnalyzeScreen from './src/screens/AnalyzeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileListScreen from './src/screens/ProfileListScreen';
import EditProfileScreen from './src/screens/EditProfileScreen'; // <-- NUEVO: importamos la pantalla de edición
import { ScreenName, Profile } from './src/types'; // <-- NUEVO: importamos los tipos desde el nuevo archivo

const SCREENS: { [key: string]: ScreenName } = {
  ANALYZE: 'Analyze',
  REGISTER: 'Register',
  PROFILE_LIST: 'ProfileList',
  EDIT_PROFILE: 'EditProfile', // <-- NUEVO: añadimos la pantalla de edición
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Analyze');
  // NUEVO: estado para saber qué perfil estamos editando
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const navigate = (screen: ScreenName, params?: any) => {
    if (screen === 'EditProfile' && params?.profile) {
      setEditingProfile(params.profile);
    }
    setCurrentScreen(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reconocimiento Facial</Text>
      </View>
      
      <View style={styles.contentContainer}>
        {currentScreen === 'Analyze' && <AnalyzeScreen />}
        {currentScreen === 'Register' && <RegisterScreen navigate={navigate} />}
        {currentScreen === 'ProfileList' && <ProfileListScreen navigate={navigate} />}
        {/* NUEVO: Lógica para mostrar la pantalla de edición */}
        {currentScreen === 'EditProfile' && editingProfile && <EditProfileScreen profile={editingProfile} navigate={navigate} />}
      </View>

      <View style={styles.navigation}>
        <NavButton title="Analizar" onPress={() => navigate('Analyze')} active={currentScreen === 'Analyze'} />
        <NavButton title="Registrar" onPress={() => navigate('Register')} active={currentScreen === 'Register'}/>
        <NavButton title="Perfiles" onPress={() => navigate('ProfileList')} active={currentScreen === 'ProfileList'}/>
      </View>
    </SafeAreaView>
  );
}

const NavButton = ({ onPress, title, active }: { onPress: () => void, title: string, active: boolean }) => (
  <TouchableOpacity onPress={onPress} style={[styles.navButton, active && styles.navButtonActive]}>
    <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { paddingVertical: 15, paddingHorizontal: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#D1D1D6', paddingTop: Platform.OS === 'android' ? 40 : 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  contentContainer: { flex: 1 },
  navigation: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#D1D1D6' },
  navButton: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#F8F8F8' },
  navButtonActive: { backgroundColor: '#007AFF' },
  navButtonText: { color: '#007AFF', fontSize: 16 },
  navButtonTextActive: { color: 'white' },
});