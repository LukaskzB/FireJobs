import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";

import FirebaseHelper from "../firebaseHelper";

export default class TelaLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      senha: "",
      snackVisivel: false,
      snackMensagem: "",
      botaoDisabled: false,
    };
  }

  validate = (email) => {
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  mudarEmail(email) {
    this.setState({ email: email });
  }

  mudarSenha(senha) {
    this.setState({ senha: senha });
  }

  async esqueceuSenha() {
    let email = this.state.email.trim();
    let emailvalido = await this.validate(email);

    let msgErro = "";
    let erro = !emailvalido;

    if (!emailvalido) {
      msgErro = "Por favor, insira um e-mail válido!";
    }

    if (erro) {
      this.setState({
        snackMensagem: msgErro,
        snackVisivel: erro
      });
      return null;
    }

    FirebaseHelper.esqueceuSenha({ email: email }, success => {
      this.setState({
        snackMensagem: success,
        snackVisivel: true
      });
    }, error => {
      this.setState({
        snackMensagem: error,
        snackVisivel: true
      });
    });
  }

  async fazerLogin() {

    this.setState({ botaoDisabled: true });

    let email = this.state.email.trim();
    let senha = this.state.senha.trim();
    let emailvalido = await this.validate(email);
    let senhavalida = senha.length >= 6;

    let msgErro = "";
    let erro = !emailvalido || !senhavalida;

    if (!emailvalido) {
      msgErro = "Por favor, insira um e-mail válido!";
    } else if (!senhavalida) {
      msgErro = "Por favor, insira uma senha com no mínimo 6 caracteres!";
    }

    if (erro) {
      this.setState({
        snackMensagem: msgErro,
        snackVisivel: erro,
        botaoDisabled: !erro
      });

      return null;
    }

    FirebaseHelper.fazerLogin({ email: email, senha: senha }, () => {
      this.props.navigation.navigate("Inicio");
    }, erro => {
      this.setState({
        snackMensagem: erro,
        snackVisivel: true,
        botaoDisabled: false
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sombra}>
          <Image
            style={styles.header}
            source={require("../assets/header-login.png")}
          />
        </View>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Seja bem vindo!</Text>
          <Text style={styles.descricao}>A conexão que você precisa!</Text>
        </View>
        <View style={styles.loginContainer}>
          <View style={styles.loginBackground}>
            <Text style={styles.loginTitulo}>ENTRAR</Text>

            <TextInput
              onChangeText={(email) => this.mudarEmail(email)}
              value={this.state.email}
              underlineColorAndroid="#ffffff00"
              underlineColor="#ffffff00"
              theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
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
              theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
              secureTextEntry={true}
              label="Senha"
              left={<TextInput.Icon name="lock" color="#AAAAAA" size={20} />}
            />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 60
              }}>
              <Text
                style={styles.esqueceuSenha}
                onPress={() => this.esqueceuSenha()}>Esqueceu sua senha?
              </Text>
            </View>

            <Button
              style={styles.botao}
              onPress={() => this.fazerLogin()}
              style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
              disabled={this.state.botaoDisabled}>
              <Text style={styles.entrar}>ENTRAR</Text>
            </Button>
            <View style={styles.cadastrarView}>
              <Text
                style={styles.cadastrar}
                onPress={() => this.props.navigation.navigate("Cadastro")}>CADASTRAR</Text>
            </View>
          </View>
        </View>

        <Snackbar
          visible={this.state.snackVisivel}
          onDismiss={() => this.setState({ snackVisivel: false })}
          action={{ label: "OK!" }}>
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
  sombra: {
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 3,
    width: "100%",
    position: "absolute",
    height: "35%",
  },
  header: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 10,
    position: "absolute",
  },
  loginContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBackground: {
    width: "80%",
    height: "60%",
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "#fff",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loginTitulo: {
    fontFamily: "Bold",
    fontSize: 26,
    color: "#333",
    marginTop: 20,
    paddingHorizontal: 25,
    width: "100%",
  },
  tituloContainer: {
    position: "absolute",
    width: "80%",
    height: "25%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  titulo: {
    fontFamily: "Bold",
    fontSize: 35,
    color: "#fff",
    textAlign: "left",
    flexDirection: "column",
    elevation: 10,
  },
  descricao: {
    fontFamily: "Book",
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
    elevation: 10,
  },
  input: {
    height: 55,
    marginHorizontal: 25,
    marginTop: 20,
    borderWidth: 0,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    alignSelf: "stretch",
    fontFamily: "Book",
    color: "#333333",
  },
  botao: {
    height: 55,
    marginHorizontal: 25,
    marginTop: 5,
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
    marginHorizontal: 25,
    marginTop: 5,
    borderWidth: 0,
    backgroundColor: "#dbdbdb",
    borderRadius: 8,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  entrar: {
    fontFamily: "Medium",
    color: "#fff",
    fontSize: 16,
  },
  esqueceuSenha: {
    fontFamily: "Book",
    color: "#333",
    fontSize: 14,
    marginTop: 5,
  },
  cadastrarView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cadastrar: {
    fontFamily: "Medium",
    color: "#646464",
    fontSize: 16,
  },
});
