import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Esta es la función que hemos extraído. Ahora puede ser llamada desde cualquier parte de la app.
export const selectImage = (callback: (asset: ImagePicker.ImagePickerAsset) => void) => {
  Alert.alert(
    "Seleccionar Imagen", 
    "Elige una opción",
    [
      { 
        text: "Galería", 
        onPress: async () => {
          await ImagePicker.requestMediaLibraryPermissionsAsync();
          let result = await ImagePicker.launchImageLibraryAsync({ 
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
          });
          if (!result.canceled) {
            callback(result.assets[0]);
          }
        }
      },
      { 
        text: "Cámara", 
        onPress: async () => {
          await ImagePicker.requestCameraPermissionsAsync();
          let result = await ImagePicker.launchCameraAsync({ 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.8 
          });
          if (!result.canceled) {
            callback(result.assets[0]);
          }
        }
      },
      { text: "Cancelar", style: "cancel" },
    ]
  );
};