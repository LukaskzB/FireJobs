import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  IconButton,
  RadioButton,
  Snackbar,
} from "react-native-paper";
import firebase from "../firebase";

export default class Cadastro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagem: "",
      nome: "",
      email: "",
      senha: "",
      tipo: "pessoa",
      snackMensagem: "",
      snackVisivel: false,
      botaoDisabled: false,
    };
  }

  mudarNome(nome) {
    this.setState({ nome: nome });
  }

  mudarEmail(email) {
    this.setState({ email: email });
  }

  mudarSenha(senha) {
    this.setState({ senha: senha });
  }

  mudarTipo(tipo) {
    this.setState({ tipo: tipo });
  }

  async cadastrar() {
    this.setState({ botaoDisabled: true });

    let email = this.state.email.trim();
    let nome = this.state.nome.trim();
    let senha = this.state.senha.trim();
    let tipo = this.state.tipo;

    let emailvalido = this.validate(email);
    let senhavalida = senha.length >= 6;
    let nomevalido = nome.length >= 3;

    if (!nomevalido) {
      this.setState({
        snackMensagem:
          "Por favor, insira um nome válido, com no mínimo 3 caracteres!",
        snackVisivel: true,
        botaoDisabled: false,
      });
    } else if (!emailvalido) {
      this.setState({
        snackMensagem: "Por favor, insira um e-mail válido!",
        snackVisivel: true,
        botaoDisabled: false,
      });
    } else if (!senhavalida) {
      this.setState({
        snackMensagem:
          "Por favor, insira uma senha com no mínimo 6 caracteres!",
        snackVisivel: true,
        botaoDisabled: false,
      });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, senha)
        .then((dados) => {
          let user = dados.user;

          //define o nome do usuário
          user.updateProfile({ displayName: nome });

          //cria o arquivo no firestore
          firebase.firestore().collection("usuarios").doc(user.uid).set({
            email: email,
            nome: nome,
            tipo: tipo,
          });

          //vai pro inicio
          this.props.navigation.navigate("Inicio");
        })
        .catch((error) => {
          console.log(error);

          this.setState({
            botaoDisabled: false,
          });
        });
    }
  }

  validate = (email) => {
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.voltar}>
          <IconButton
            icon="arrow-left"
            style={styles.botaoVoltar}
            color="#000"
            size={35}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>

        <Text style={styles.titulo}>Vamos começar!</Text>
        <Text style={styles.descricao}>
          Crie uma conta FireJobs para utilizar todas as funcionalidades!
        </Text>

        <TextInput
          onChangeText={(nome) => this.mudarNome(nome)}
          value={this.state.nome}
          underlineColorAndroid="#ffffff00"
          underlineColor="#ffffff00"
          style={styles.input}
          label="Nome completo"
          left={
            <TextInput.Icon
              name="card-account-mail"
              color="#AAAAAA"
              size={20}
            />
          }
        />

        <TextInput
          onChangeText={(email) => this.mudarEmail(email)}
          value={this.state.email}
          underlineColorAndroid="#ffffff00"
          underlineColor="#ffffff00"
          style={styles.input}
          label="E-mail"
          left={<TextInput.Icon name="account" color="#AAAAAA" size={20} />}
        />

        <TextInput
          onChangeText={(senha) => this.mudarSenha(senha)}
          value={this.state.senha}
          underlineColorAndroid="#ffffff00"
          underlineColor="#ffffff00"
          style={styles.input}
          secureTextEntry={true}
          label="Senha"
          left={<TextInput.Icon name="lock" color="#AAAAAA" size={20} />}
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
              onPress={() => this.mudarTipo("empresa")}
            >
              Empregador
            </Text>
          </View>
        </View>

        <Button
          style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
          disabled={this.state.botaoDisabled}
          onPress={() => this.cadastrar()}
        >
          <Text style={styles.cadastrar}>CADASTRAR</Text>
        </Button>

        <Snackbar
          visible={this.state.snackVisivel}
          onDismiss={() => this.setState({ snackVisivel: false })}
          action={{ label: "OK!" }}
        >
          {this.state.snackMensagem}
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
    justifyContent: "flex-start",
  },
  voltar: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  botaoVoltar: {
    marginTop: 100,
    marginLeft: 25,
    backgroundColor: "#00000000",
    height: 30,
    width: 30,
  },
  titulo: {
    width: "80%",
    marginTop: 90,
    fontFamily: "Bold",
    fontSize: 30,
    color: "#333333",
    textAlign: "center",
  },
  descricao: {
    width: "70%",
    fontFamily: "Book",
    fontSize: 15,
    color: "#333333",
    textAlign: "center",
    marginBottom: 40,
  },
  foto: {
    backgroundColor: "#f3f3f3",
    borderRadius: 500,
    borderWidth: 0,
    borderColor: "#00000000",
    width: 120,
    height: 120,
    marginTop: 50,
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
  cadastrar: {
    fontFamily: "Medium",
    color: "#fff",
    fontSize: 16,
  },
});
