import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

// --- COMPONENTES REUTILIZABLES ---
export const AppButton = ({ onPress, title, disabled = false }: { onPress: () => void, title: string, disabled?: boolean }) => (
  <TouchableOpacity onPress={onPress} style={[commonStyles.button, disabled && commonStyles.buttonDisabled]} disabled={disabled}>
    <Text style={commonStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// --- ESTILOS COMUNES ---
export const commonStyles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    marginVertical: 3,
    alignSelf: 'flex-start',
  },
  alertBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  alertText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // --- INICIO DE LA CORRECCIÓN ---
  // Este es el estilo que faltaba
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  // --- FIN DE LA CORRECCIÓN ---
});