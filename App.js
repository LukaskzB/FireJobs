import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import * as Font from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
const Stack = createStackNavigator();

import telaLogin from "./screens/login";
import telaCadastro from "./screens/cadastro";
import telaInicio from "./screens/inicio";
import telaAdicionarVaga from "./screens/adicionarVaga";
import telaAdicionarFuncionario from "./screens/adicionarFuncionario";
import telaDetalhesVaga from "./screens/detalhesVaga";
import telaDetalhesFuncionario from "./screens/detalhesFuncionario";
import telaPerfil from "./screens/perfil";

import firebase from "./firebase";
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carregou: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync(
      "Medium",
      require("./assets/fonts/Milliard-Medium.otf")
    );
    await Font.loadAsync("Bold", require("./assets/fonts/Milliard-Bold.otf"));
    await Font.loadAsync("Book", require("./assets/fonts/Milliard-Book.otf"));
    this.setState({ carregou: true });
  }

  render() {
    let user = firebase.auth().currentUser;
    let tela = user != null ? "Inicio" : "Login";

    if (!this.state.carregou) {
      return <AppLoading />;
    }

    let opcoes = {
      headerShown: false,
    };

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={tela}>
          <Stack.Screen name="Login" component={telaLogin} options={opcoes} />
          <Stack.Screen
            name="Cadastro"
            component={telaCadastro}
            options={opcoes}
          />
          <Stack.Screen name="Inicio" component={telaInicio} options={opcoes} />
          <Stack.Screen name="Perfil" component={telaPerfil} options={opcoes} />
          <Stack.Screen
            name="AdicionarVaga"
            component={telaAdicionarVaga}
            options={opcoes}
          />
          <Stack.Screen
            name="AdicionarFuncionario"
            component={telaAdicionarFuncionario}
            options={opcoes}
          />
          <Stack.Screen
            name="DetalhesFuncionario"
            component={telaDetalhesFuncionario}
            options={opcoes}
          />
          <Stack.Screen
            name="DetalhesVaga"
            component={telaDetalhesVaga}
            options={opcoes}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
