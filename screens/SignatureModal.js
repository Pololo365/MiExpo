// SignatureModal.js

import React, { useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Importamos el canvas para la firma
import SignatureCanvas from 'react-native-signature-canvas';
// Se utiliza FileSystem para guardar la imagen temporalmente
import * as FileSystem from 'expo-file-system';
// Se utiliza ImageManipulator para comprimir la imagen
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Componente SignatureModal
 * @param {boolean} visible - Indica si el modal se muestra o no.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {string|number} orderId - Identificador de la orden, para construir la URL de envío.
 * @param {string} token - Token de autenticación que se enviará junto a la firma.
 */

const SignatureModal = ({ visible, onClose, orderId, token }) => {
  // Estado para mostrar el indicador de carga mientras se procesa la firma
  const [isProcessing, setIsProcessing] = useState(false);
  // Creamos una referencia al componente SignatureCanvas para poder invocar su método readSignature()
  const signatureRef = useRef(null);

  /**
   * Función que se ejecuta cuando se obtiene la firma en formato base64.
   * Aquí se valida, comprime y envía la firma al servidor.
   * @param {string} signature - Imagen de la firma en base64.
   */
  const handleSignature = async (signature) => {
    // Validación: si la firma es demasiado corta, se considera que no hay firma
    if (!signature || signature.length < 50) {
      Alert.alert("Firma vacía", "Por favor, proporciona una firma antes de continuar.");
      return;
    }

    // Activamos el indicador de carga
    setIsProcessing(true);

    try {
      // Extraemos la parte base64 si la cadena incluye el prefijo data:image
      const base64Data = signature.includes('data:image') ? signature.split(',')[1] : signature;
      // Definimos una ruta temporal para guardar la imagen (se usa el directorio de caché)
      const fileUri = FileSystem.cacheDirectory + "signature.png";

      // Escribimos el contenido base64 en un archivo temporal
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
      
      // Usamos ImageManipulator para comprimir la imagen. Aquí se aplica una compresión al 50%.
      const manipResult = await ImageManipulator.manipulateAsync(
        fileUri,
        [], // No aplicamos transformaciones adicionales
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG, base64: true }
      );
      
      // Eliminamos el archivo temporal ya que no lo necesitamos
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      console.log('orderId', orderId);
      console.log('token', token);

      
      // Enviamos la firma comprimida al servidor usando el endpoint específico para la orden.
      // Se incluye el token en los headers de autorización.
      const response = await fetch(`http://erpcloud.syncsolutions.es:3030/api/v1/ordenes/${orderId}/firma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviamos el token para la autenticación
        },
        // Se envía la firma en formato base64 dentro de un objeto JSON
        body: JSON.stringify({ firma: manipResult.base64 }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Si el envío fue exitoso, informamos al usuario
        Alert.alert("Éxito", "Firma enviada correctamente.");
        // Cerramos el modal de firma
        onClose();
      } else {
        // Si hay un error, mostramos el mensaje recibido o uno genérico
        Alert.alert("Error", data.message || "Error al enviar la firma.");
      }
    } catch (error) {
      console.log('error', error);
      console.error(error);
      Alert.alert("Error", "Ha ocurrido un error al procesar la firma.");
    } finally {
      // Desactivamos el indicador de carga
      setIsProcessing(false);
    }
  };

  /**
   * Función que se ejecuta si el usuario intenta enviar una firma vacía.
   */
  const handleEmpty = () => {
    Alert.alert("Firma vacía", "No se capturó ninguna firma.");
  };

  // Estilo personalizado para el canvas en web (oculta el footer del canvas)
  const webStyle = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose} // Permite cerrar el modal con el botón de retroceso en Android
    >
      <View style={styles.container}>
        <Text style={styles.title}>Firma de la Orden</Text>
        {/* Muestra un ActivityIndicator mientras se procesa la firma */}
        {isProcessing && <ActivityIndicator size="large" color="#007AFF" />}
        {/* Muestra el canvas de firma solo si no se está procesando */}
        {!isProcessing && (
          <>
            <SignatureCanvas
              ref={signatureRef}           // Referencia para invocar métodos del canvas
              onOK={handleSignature}         // Se llama a handleSignature cuando se confirma la firma
              onEmpty={handleEmpty}          // Se llama a handleEmpty si el canvas está vacío
              descriptionText="Firme aquí"
              webStyle={webStyle}
              autoClear={true}              // Limpia el canvas después de capturar la firma
            />
            {/* Botón para confirmar y guardar la firma */}
            <TouchableOpacity
              onPress={() => {
                if (signatureRef.current) {
                  // Invoca el método readSignature() para obtener la firma y llamar a onOK
                  signatureRef.current.readSignature();
                }
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Firma</Text>
            </TouchableOpacity>
          </>
        )}
        {/* Botón para cancelar y cerrar el modal */}
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Estilos para el modal y sus componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SignatureModal;
