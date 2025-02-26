import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Componente funcional para mostrar la fecha y hora actualizada cada segundo
const HomeScreen = () => {
  // Estado para almacenar la fecha y hora actual
  const [dateTime, setDateTime] = useState(new Date());

  // useEffect se encarga de actualizar la fecha y hora cada 1000 milisegundos (1 segundo)
  useEffect(() => {
    // Creamos un intervalo que actualiza el estado
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Limpiamos el intervalo al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(timer);
  }, []);

  return (
    // Contenedor principal centrado vertical y horizontalmente
    <View style={styles.container}>
      {/* Mostramos la fecha y hora en formato local */}
      <Text style={styles.text}>{dateTime.toLocaleString()}</Text>
    </View>
  );
};

// Definición de estilos básicos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,                   // Ocupa todo el espacio disponible
    justifyContent: 'center',  // Centra el contenido verticalmente
    alignItems: 'center',      // Centra el contenido horizontalmente
    backgroundColor: '#FFFFFF' // Fondo blanco
  },
  text: {
    fontSize: 24,              // Tamaño de fuente adecuado para buena visibilidad
    color: '#333333'           // Color de texto oscuro para buen contraste
  }
});

export default HomeScreen;
