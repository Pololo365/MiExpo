import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Se reciben las props 'route' para obtener parámetros y 'navigation' para navegar a otras pantallas
const HomeScreen = ({ route, navigation }) => {
  // Se extraen el mensaje y el token enviados desde LoginScreen
  const { message, token } = route.params || {};

  // Estado para almacenar la fecha y hora actual
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Imprime en consola al entrar a HomeScreen
    console.log('Estoy en HomeScreen: ', token);

    // Intervalo para actualizar la fecha y hora cada segundo
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Muestra el mensaje recibido */}
      {message && <Text style={styles.messageText}>{message}</Text>}
      {/* Muestra la fecha y hora actual */}
      <Text style={styles.text}>{dateTime.toLocaleString()}</Text>
      {/* Botón para navegar a la pantalla de Órdenes de Trabajo */}
      <Button 
        title="📝 Órdenes de Trabajo" 
        onPress={() => navigation.navigate('WorkOrders', { token })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                   
    justifyContent: 'center',  
    alignItems: 'center',      
    backgroundColor: '#FFFFFF' 
  },
  text: {
    fontSize: 24,
    color: '#333333'
  },
  messageText: {
    fontSize: 20,
    color: '#007AFF',
    marginBottom: 20,
  }
});

export default HomeScreen;
