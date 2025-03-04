// DetalleOrdenScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
// Importamos el componente del modal de firma
import SignatureModal from './SignatureModal';
import { formatDate } from '../funciones';

const DetalleOrdenScreen = ({ route }) => {
  // Extraemos el token y el id de la orden de los parámetros de la ruta
  const { token, orderId } = route.params || {};
  // Estado para almacenar el detalle de la orden
  const [orderDetail, setOrderDetail] = useState(null);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para controlar la visibilidad del modal de firma
  const [modalVisible, setModalVisible] = useState(false);

  // Función para obtener el detalle de la orden desde el servidor
  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`http://erpcloud.syncsolutions.es:3030/api/v1/ordenes/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Guardamos la información de la orden en el estado
        setOrderDetail(data);
      } else {
        Alert.alert('Error', data.message || 'Error al obtener el detalle de la orden');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión al obtener el detalle de la orden');
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar la pantalla para cargar los datos de la orden
  useEffect(() => {
    fetchOrderDetail();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle de la Orden</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : orderDetail ? (
        <>
          {/* Se muestran los detalles de la orden */}
          <Text style={styles.detailText}>Número: {orderDetail.numero}</Text>
          <Text style={styles.detailText}>Nombre del Cliente: {orderDetail.cliente.nombre}</Text>
          <Text style={styles.detailText}>Fecha Orden: {formatDate(orderDetail.fecha_orden)}</Text>
          <Text style={styles.detailText}>Fecha Montaje: {formatDate(orderDetail.fecha_montaje)}</Text>
          <Text style={styles.detailText}>Situación: {orderDetail.situacion_trabajo}</Text>
          <Text style={styles.detailText}>Instalar en: {orderDetail.instalar_en}</Text>
          <Text style={styles.detailText}>Descripción: {orderDetail.descripcion || 'No disponible'}</Text>
          <Text style={styles.detailText}>¿Tiene firma?: {orderDetail.tiene_firma ? '✅' : '❌'}</Text>
          
          {/* Botón "Firmar" para abrir el modal donde se capturará la firma */}
          {!orderDetail.tiene_firma ? (
          <TouchableOpacity 
            style={styles.firmarButton} 
            onPress={() => setModalVisible(true)} // Al pulsar se muestra el modal
          >
            <Text style={styles.firmarButtonText}>Firmar</Text>
          </TouchableOpacity>
          ) : (
            <Text>Orden ya firmada.</Text>
          )}
        </>
      ) : (
        <Text>No se encontró información para esta orden.</Text>
      )}

      {/* Modal para capturar la firma. Se pasa el orderId para utilizarlo al enviar la firma */}
      <SignatureModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        orderId={orderId}
        token={token}
      />
    </ScrollView>
  );
};

// Estilos de la pantalla de detalle y del botón "Firmar"
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 10,
  },
  // Estilos para el botón "Firmar"
  firmarButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  firmarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default DetalleOrdenScreen;
