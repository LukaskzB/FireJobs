
import { Ionicons } from "@expo/vector-icons";
import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TextInput, Button, Snackbar, RadioButton } from "react-native-paper";
import firebase from "firebase";
import FirebaseHelper from "../firebaseHelper";

export default class TelaPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: firebase.auth().currentUser.displayName,
      tipo: this.props.route.params.tipo != undefined ? this.props.route.params.tipo : "pessoa",
      snackbarVisivel: false,
      snackbarMensagem: "",
      botaoDisabled: false
    };
  }

  mudarNome(nome) {
    //formata o nome
    let length = nome.length;
    let newStr = "";

    for (let i = 0; i < length; i++) {
      newStr += i == 0 ? nome[i].toUpperCase() : nome[i - 1] == " " ? nome[i].toUpperCase() : nome[i].toLowerCase();
    }

    this.setState({
      nome: newStr
    });
  }

  mudarTipo(tipo) {
    this.setState({ tipo: tipo });
  }

  async atualizarPerfil() {
    this.setState({ botaoDisabled: true });

    const nome = this.state.nome;
    const tipo = this.state.tipo;

    let nomevalido = nome.length >= 3;
    if (!nomevalido) {
      this.setState({
        snackbarVisivel: true,
        snackbarMensagem: "Por favor, insira um nome válido, com no mínimo 3 caracteres!",
        botaoDisabled: false
      });
      return null;
    }

    let mensagem = await FirebaseHelper.atualizarPerfil({ nome, tipo });

    this.setState({
      snackbarVisivel: true,
      snackbarMensagem: mensagem,
      botaoDisabled: false
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Ionicons style={styles.voltar} onPress={() => this.props.navigation.goBack()} name="arrow-back-outline" color="#333" size={30} />
          <Text style={styles.titulo}>Editar perfil</Text>
        </View>

        <TextInput
          onChangeText={(nome) => this.mudarNome(nome)}
          value={this.state.nome}
          underlineColorAndroid="#ffffff00"
          underlineColor="#ffffff00"
          style={styles.input}
          theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
          label="Nome completo"
          left={
            <TextInput.Icon
              name="card-account-mail"
              color="#AAAAAA"
              size={20}
            />
          }
        />

        <View style={styles.radioView}>
          <View style={styles.radioItem}>
            <RadioButton
              value="pessoa"
              onPress={() => this.mudarTipo("pessoa")}
              status={this.state.tipo == "pessoa" ? "checked" : "unchecked"}
            />
            <Text
              style={{ textAlign: "center" }}
              onPress={() => this.mudarTipo("pessoa")}
            >
              Empregado
            </Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton
              value="empresa"
              onPress={() => this.mudarTipo("empresa")}
              status={this.state.tipo == "empresa" ? "checked" : "unchecked"}
            />
            <Text
              style={{ textAlign: "center" }}
              onPress={() => this.mudarTipo("empresa")}>Empregador</Text>
          </View>
        </View>

        <Button
          style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
          disabled={this.state.botaoDisabled}
          onPress={() => this.atualizarPerfil()}>
          <Text style={styles.editar}>EDITAR PERFIL</Text>
        </Button>

        <Snackbar
          visible={this.state.snackbarVisivel}
          onDismiss={() => this.setState({ snackbarVisivel: false })}
          action={{ label: "OK!" }}>
          {this.state.snackbarMensagem}
        </Snackbar>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  titulo: {
    textAlign: 'center',
    fontFamily: 'Book',
    color: '#333',
    fontSize: 22
  },
  voltar: {
    position: "absolute",
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  input: {
    height: 55,
    marginHorizontal: 50,
    marginTop: 20,
    borderWidth: 0,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    alignSelf: "stretch",
    fontFamily: "Book",
    color: "#333333",
  },
  radioView: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    borderWidth: 0,
    marginHorizontal: 50,
    alignSelf: "stretch",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  botao: {
    height: 55,
    marginHorizontal: 50,
    marginTop: 20,
    borderWidth: 0,
    backgroundColor: "#FF6767",
    borderRadius: 8,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  botaoDesativado: {
    height: 55,
    marginHorizontal: 50,
    marginTop: 20,
    borderWidth: 0,
    backgroundColor: "#dbdbdb",
    borderRadius: 8,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  editar: {
    fontFamily: "Medium",
    color: "#fff",
    fontSize: 16,
  }
});
