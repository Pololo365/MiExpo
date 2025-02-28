import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';

const DetalleOrdenScreen = ({ route }) => {
  // Se extrae el token y el id de la orden de los parámetros
  const { token, orderId } = route.params || {};
  // Estados para almacenar el detalle de la orden y el indicador de carga
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el detalle de la orden desde el servidor
  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`http://erpcloud.syncsolutions.es:3030/api/v1/ordenes/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Se envía el token en el header
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('data', data);
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
          <Text style={styles.detailText}>Número: {orderDetail.numero}</Text>
          <Text style={styles.detailText}>Nombre del Cliente: {orderDetail.cliente_nombre}</Text>
          <Text style={styles.detailText}>Fecha: {orderDetail.fecha}</Text>
          <Text style={styles.detailText}>Situación: {orderDetail.situacion}</Text>
          <Text style={styles.detailText}>Instalar en: {orderDetail.instalar_en}</Text>
          <Text style={styles.detailText}>Descripción: {orderDetail.descripcion || 'No disponible'}</Text>
          <Text style={styles.detailText}>¿Tiene firma?: {orderDetail.tiene_firma ? 'Sí' : 'No'}</Text>
          {/* Agrega más campos según sea necesario */}
        </>
      ) : (
        <Text>No se encontró información para esta orden.</Text>
      )}
    </ScrollView>
  );
};

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
    fontSize: 16,
    color: '#333333',
    marginBottom: 10, // Espaciado entre líneas
  },
});

export default DetalleOrdenScreen;
