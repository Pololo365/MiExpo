// Importamos react-native-gesture-handler para que react-navigation funcione correctamente
import 'react-native-gesture-handler';
import React from 'react';

// Importamos NavigationContainer para proveer el contexto de navegación a la app
import { NavigationContainer } from '@react-navigation/native';
// Importamos createStackNavigator para crear una navegación tipo stack
import { createStackNavigator } from '@react-navigation/stack';

// Importamos la pantalla principal que muestra la fecha y hora
import LoginScreen from './screens/LoginScreen';

// Creamos una instancia del stack navigator
const Stack = createStackNavigator();

// Componente principal de la aplicación
const App = () => {
  return (
    // NavigationContainer envuelve toda la navegación de la aplicación
    <NavigationContainer>
      {/* Configuramos el stack navigator con la pantalla "Home" como ruta inicial */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Iniciar Sesión' }} // Título que se muestra en la cabecera
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
