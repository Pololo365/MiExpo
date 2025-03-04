import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { formatDate } from '../funciones';
const WorkOrdersScreen = ({ route, navigation }) => {
  // Se extrae el token de los parámetros recibidos desde HomeScreen
  const { token } = route.params || {};
  // Estado para almacenar las órdenes y el indicador de carga
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las órdenes de trabajo desde el servidor
  const fetchOrders = async () => {
    try {
      // Realizamos la petición a la API enviando el token en el header
      const response = await fetch('http://erpcloud.syncsolutions.es:3030/api/v1/ordenes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        //console.log('data', data); // Verifica la estructura de data
        if (Array.isArray(data.ordenes)) { // Asegúrate de que data.ordenes sea un array
          setOrders(data.ordenes); // Establece el estado con el array de órdenes
        } else {
          Alert.alert('Error', 'La respuesta no es un array de órdenes.');
        }
      } else {
        Alert.alert('Error', data.message || 'Error al obtener las órdenes');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión al obtener las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Función que se ejecuta al pulsar sobre una orden para navegar a su detalle
  const handleOrderPress = (orderId) => {
    navigation.navigate('DetalleOrden', { token, orderId });
  };

  // Renderiza cada orden en la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)}>
      <Text style={styles.orderText}>Número: {item.numero}</Text>
      <Text style={styles.orderText}>Nombre: {item.cliente_nombre}</Text>
      <Text style={styles.orderText}>Fecha: {formatDate(item.fecha)}</Text>
      <Text style={styles.orderText}>Situación: {item.situacion}</Text>
      <Text style={styles.orderText}>Instalar en: {item.instalar_en}</Text>
      <Text style={styles.orderText}>¿Tiene firma?: {item.tiene_firma ? '✅' : '❌'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Órdenes de Trabajo</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList 
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text>No hay órdenes disponibles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  orderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 11,
  },
});

export default WorkOrdersScreen;
