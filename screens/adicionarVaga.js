import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { TextInput, Button, RadioButton, Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import FirebaseHelper from "../firebaseHelper";
import { TapGestureHandler } from "react-native-gesture-handler";

export default class TelaAdicionarVaga extends Component {
  constructor(props) {
    super(props);

    const params = this.props.route.params == undefined ? undefined : this.props.route.params.item;
    const editar = params == undefined;

    this.state = {
      item: params,
      editar: editar,
      nomeVaga: editar ? "" : params.nome,
      periodo: editar ? "Período integral" : params.periodo,
      valor: editar ? null : params.valor,
      tipo: editar ? "horal" : params.tipo,
      contato: editar ? "" : params.contato,
      descricao: editar ? "" : params.descricao,
      localizacao: editar ? {
        latitude: -26.8691722,
        longitude: -52.4242678,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      } : params.localizacao,
      botaoDisabled: false,
      snackbarVisivel: false,
      snackbarMensagem: "",
      titulo: editar ? "Adicionar sua vaga" : "Editar sua vaga",
      botao: editar ? "ADICIONAR VAGA" : "EDITAR VAGA"
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

  mudarLocalizacao(localizacao) {
    this.setState({ localizacao: localizacao });
  }

  mudarDescricao(descricao) {
    this.setState({ descricao: descricao });
  }

  mudarValor(valor) {
    this.setState({ valor: valor.replace(/[^0-9]/g, '') });
  }

  mudarTipo(tipo) {
    this.setState({ tipo: tipo });
  }

  async addedit() {

    this.setState({ botaoDisabled: true });

    const nomeVaga = this.state.nomeVaga.trim();
    const periodo = this.state.periodo;
    const valor = this.state.valor == null || this.state.valor == "" ? 0 : this.state.valor.trim();
    const tipo = this.state.tipo;
    const contato = this.state.contato.trim();
    const descricao = this.state.descricao.trim();
    const localizacao = this.state.localizacao;

    const nomevalido = nomeVaga.length >= 3;
    const contatovalido = contato.length >= 3;
    const descricaovalida = descricao.length >= 3;

    const erro = !nomevalido || !contatovalido || !descricaovalida;
    let msgErro = "";

    if (erro) {

      if (!nomevalido) {
        msgErro = "Por favor, insira um nome válido, com no mínimo 3 caracteres!";
      } else if (!contatovalido) {
        msgErro = "Por favor, insira um contato válido, com no mínimo 3 caracteres!";
      } else if (!descricaovalida) {
        msgErro = "Por favor, insira uma descrição válida, com no mínimo 3 caracteres!";
      }

      this.setState({
        snackbarMensagem: msgErro,
        snackbarVisivel: true,
        botaoDisabled: false
      });

      return null;
    }

    //adiciona ou edita
    if (this.state.editar) {
      await FirebaseHelper.adicionarVaga({ nome: nomeVaga, periodo: periodo, valor: valor, tipo: tipo, contato: contato, descricao: descricao, localizacao: localizacao }, () => {
        this.setState({
          snackbarVisivel: true,
          snackbarMensagem: "Sua vaga foi adicionada com sucesso!"
        });
      }, erro => {
        this.setState({
          botaoDisabled: false,
          snackbarMensagem: erro,
          snackbarVisivel: true
        });
      });
    } else {
      await FirebaseHelper.editarVaga({ id: this.state.item.docId, nome: nomeVaga, periodo: periodo, valor: valor, tipo: tipo, contato: contato, descricao: descricao, localizacao: localizacao }, () => {
        this.setState({
          snackbarVisivel: true,
          snackbarMensagem: "Sua vaga foi editada com sucesso!"
        });
      }, erro => {
        this.setState({
          botaoDisabled: false,
          snackbarMensagem: erro,
          snackbarVisivel: true
        });
      });
    }

  }

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
            label="Nome da vaga"
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
            onChangeText={(valor) => this.mudarValor(valor)}
            value={this.state.valor}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Valor do salário"
            left={
              <TextInput.Icon
                name="cash-multiple"
                color="#AAAAAA"
                size={20}
              />
            }
          />

          <View style={styles.radioView}>
            <View style={styles.radioItem}>
              <RadioButton
                value="horal"
                onPress={() => this.mudarTipo("horal")}
                status={this.state.tipo == "horal" ? "checked" : "unchecked"}
              />
              <Text
                style={{ textAlign: "center" }}
                onPress={() => this.mudarTipo("horal")}>Salário horal</Text>
            </View>

            <View style={styles.radioItem}>
              <RadioButton
                value="meio"
                onPress={() => this.mudarTipo("mensal")}
                status={this.state.tipo == "mensal" ? "checked" : "unchecked"}
              />
              <Text
                style={{ textAlign: "center" }}
                onPress={() => this.mudarTipo("mensal")}>Salário mensal</Text>
            </View>
          </View>

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

          <TextInput
            onChangeText={(descricao) => this.mudarDescricao(descricao)}
            value={this.state.descricao}
            underlineColorAndroid="#ffffff00"
            underlineColor="#ffffff00"
            style={styles.input}
            theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
            label="Descrição da vaga"
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
