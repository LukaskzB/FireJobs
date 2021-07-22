import { Ionicons } from "@expo/vector-icons";
import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { TextInput, Button, RadioButton, Snackbar } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import FirebaseHelper from "../firebaseHelper";

export default class TelaAdicionarFuncionario extends Component {
  constructor(props) {
    super(props);

    const params = this.props.route.params == undefined ? undefined : this.props.route.params.item;
    const editar = params == undefined;

    this.state = {
      item: params,
      editar: editar,
      nomeVaga: editar ? "" : params.nomeVaga,
      contato: editar ? "" : params.contato,
      periodo: editar ? "Período integral" : params.periodo,
      habilidades: editar ? "" : params.habilidades,
      escolaridade: editar ? "" : params.escolaridade,
      localizacao: editar ? {
        latitude: -26.8691722,
        longitude: -52.4242678,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      } : params.localizacao,
      botaoDisabled: false,
      snackbarVisivel: false,
      snackbarMensagem: "",
      titulo: editar ? "Adicionar dados" : "Editar dados",
      botao: editar ? "ADICIONAR DADOS" : "EDITAR DADOS"
    }
  }

  mudarNomeVaga(nomeVaga) {
    this.setState({ nomeVaga: nomeVaga });
  }

  mudarContato(contato) {
    this.setState({ contato: contato });
  }

  mudarPeriodo(periodo) {
    this.setState({ periodo: periodo });
  }

  mudarHabilidades(habilidades) {
    this.setState({ habilidades: habilidades });
  }

  mudarEscolaridade(escolaridade) {
    this.setState({ escolaridade: escolaridade });
  }

  mudarLocalizacao(localizacao) {
    this.setState({ localizacao: localizacao });
  }

  async addedit() {

    this.setState({ botaoDisabled: true });

    const nomeVaga = this.state.nomeVaga.trim();
    const contato = this.state.contato.trim();
    const periodo = this.state.periodo;
    const habilidades = this.state.habilidades.trim();
    const escolaridade = this.state.escolaridade.trim();
    const localizacao = this.state.localizacao;

    const nomevalido = nomeVaga.length >= 3;
    const contatovalido = contato.length >= 3;
    const habilidadesvalidas = habilidades.length >= 3;
    const escolaridadevalida = escolaridade.length >= 3;

    let msgErro = "";
    const erro = !nomevalido || !contatovalido || !habilidadesvalidas || !escolaridadevalida;

    if (!nomevalido) {
      msgErro = "Por favor, insira um nome válido, com no mínimo 3 caracteres!";
    } else if (!contatovalido) {
      msgErro = "Por favor, insira um contato válido, com no mínimo 3 caracteres!";
    } else if (!habilidadesvalidas) {
      msgErro = "Por favor, insira suas habilidades, com no mínimo 3 caracteres!";
    } else if (!escolaridadevalida) {
      msgErro = "Por favor, insira sua escolaridade, com no mínimo 3 caracteres!";
    }

    console.log(erro)

    if (erro) {
      this.setState({
        snackbarVisivel: erro,
        snackbarMensagem: msgErro,
        botaoDisabled: !erro
      });
      return null;
    }

    if (this.state.editar) {
      FirebaseHelper.adicionarFuncionario({ nomeVaga: nomeVaga, contato: contato, periodo: periodo, habilidades: habilidades, escolaridade: escolaridade, localizacao: localizacao }, () => {
        this.setState({
          snackbarVisivel: true,
          snackbarMensagem: "Seus dados foram adicionados com sucesso!"
        });
      }, erro => {
        this.setState({
          botaoDisabled: false,
          snackbarVisivel: true,
          snackbarMensagem: erro
        });
      });
    } else {
      FirebaseHelper.editarFuncionario({ id: this.state.item.docId, nomeVaga: nomeVaga, contato: contato, periodo: periodo, habilidades: habilidades, escolaridade: escolaridade, localizacao: localizacao }, () => {
        this.setState({
          snackbarVisivel: true,
          snackbarMensagem: "Seus dados foram editados com sucesso!"
        });
      }, erro => {
        this.setState({
          botaoDisabled: false,
          snackbarVisivel: true,
          snackbarMensagem: erro
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
        <View style={styles.header}>
          <Ionicons style={styles.voltar} onPress={() => this.props.navigation.goBack()} name="arrow-back-outline" color="#333" size={30} />
          <Text style={styles.titulo}>{this.state.titulo}</Text>
        </View>

        <ScrollView>
          <TextInput
            onChangeText={(nomeVaga) => this.mudarNomeVaga(nomeVaga)}
            value={this.state.nomeVaga}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Nome da vaga procurada"
            left={
              <TextInput.Icon
                name="card-account-mail"
                color="#AAAAAA"
                size={20}
              />
            }
          />

          <TextInput
            onChangeText={(contato) => this.mudarContato(contato)}
            value={this.state.contato}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Contato (e-mail ou telefone)"
            left={
              <TextInput.Icon
                name="phone"
                color="#AAAAAA"
                size={20}
              />
            }
          />

          <View style={styles.radioView}>
            <View style={styles.radioItem}>
              <RadioButton
                value="integral"
                onPress={() => this.mudarPeriodo("Período integral")}
                status={this.state.periodo == "Período integral" ? "checked" : "unchecked"}
              />
              <Text
                style={{ textAlign: "center" }}
                onPress={() => this.mudarPeriodo("Período integral")}>Período integral</Text>
            </View>

            <View style={styles.radioItem}>
              <RadioButton
                value="meio"
                onPress={() => this.mudarPeriodo("Meio período")}
                status={this.state.periodo == "Meio período" ? "checked" : "unchecked"}
              />
              <Text
                style={{ textAlign: "center" }}
                onPress={() => this.mudarPeriodo("Meio período")}>Meio período</Text>
            </View>
          </View>

          <TextInput
            onChangeText={(habilidades) => this.mudarHabilidades(habilidades)}
            value={this.state.habilidades}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Habilidades pessoais"
            left={
              <TextInput.Icon
                name="text-box"
                color="#AAAAAA"
                size={20}
              />
            }
          />

          <TextInput
            onChangeText={(escolaridade) => this.mudarEscolaridade(escolaridade)}
            value={this.state.escolaridade}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Escolaridade"
            left={
              <TextInput.Icon
                name="text-box"
                color="#AAAAAA"
                size={20}
              />
            }
          />

          <MapView style={styles.mapa} initialRegion={{
            latitude: -26.8691722,
            longitude: -52.4242678,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
            showsUserLocation={true}>
            <Marker draggable={true} coordinate={this.state.localizacao} onDragEnd={(e) => this.mudarLocalizacao(e.nativeEvent.coordinate)} />
          </MapView>

          <Button
            style={styles.botao}
            onPress={() => this.addedit()}
            style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
            disabled={this.state.botaoDisabled}>
            <Text style={styles.add}>{this.state.botao}</Text>
          </Button>
        </ScrollView>

        <Snackbar
          visible={this.state.snackbarVisivel}
          onDismiss={() => this.setState({ snackbarVisivel: false })}
          action={{ label: "OK!" }}
        >
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
    marginHorizontal: 10,
    marginTop: 10,
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
    marginTop: 10,
    alignSelf: "stretch",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  mapa: {
    marginHorizontal: 10,
    alignSelf: 'stretch',
    height: 120,
    borderRadius: 8,
    marginTop: 10
  },
  botao: {
    height: 55,
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 0,
    backgroundColor: "#FF6767",
    borderRadius: 8,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  botaoDesativado: {
    height: 55,
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 0,
    backgroundColor: "#dbdbdb",
    borderRadius: 8,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    fontFamily: "Medium",
    color: "#fff",
    fontSize: 16,
  }
});
