import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Se recibe la prop 'navigation' para poder navegar a otras pantallas
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Cargar la contraseña guardada de forma segura para el usuario
  const loadPassword = async (username) => {
    try {
      const storedPassword = await SecureStore.getItemAsync(username);
      if (storedPassword) {
        setPassword(storedPassword);
        console.log('Contraseña recuperada:', storedPassword);
      } else {
        setPassword('');
      }
    } catch (error) {
      console.log('Error al cargar la contraseña', error);
    }
  };

  // Actualiza la contraseña cada vez que el nombre de usuario cambia
  useEffect(() => {
    if (username) {
      loadPassword(username);
    } else {
      setPassword('');
    }
  }, [username]);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      // Petición a la API para autenticar al usuario
      const response = await fetch('http://erpcloud.syncsolutions.es:3030/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Muestra alerta de éxito sin mostrar el token
        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
          {
            text: 'Guardar contraseña',
            onPress: async () => {
              try {
                // Guarda la contraseña y el token de forma segura
                await SecureStore.setItemAsync(username, password);
                await SecureStore.setItemAsync('token', data.token);
                // Navega a HomeScreen pasando el token y un mensaje
                navigation.navigate('Home', { message: data.message || 'Bienvenido', token: data.token });
              } catch (error) {
                console.log('Error al guardar las credenciales', error);
              }
            },
          },
          {
            text: 'OK',
            onPress: () => {
              // Navega a HomeScreen sin guardar las credenciales
              navigation.navigate('Home', { message: data.message || 'Bienvenido', token: data.token });
            },
          },
        ]);
      } else {
        // En caso de error, limpia los campos y muestra mensaje
        setUsername('');
        setPassword('');
        Alert.alert('Error', data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      // En error de conexión, limpia campos y muestra mensaje
      setUsername('');
      setPassword('');
      Alert.alert('Error', 'Error de conexión');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombre de usuario:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Text>Contraseña:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
