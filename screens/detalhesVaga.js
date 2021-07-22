import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import FirebaseHelper from "../firebaseHelper";

export default class TelaDetalhesVaga extends Component {
  constructor(props) {
    super(props);

    const params = this.props.route.params.item;
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let pubdate = new Date(params._pub.seconds * 1000).toLocaleDateString(undefined, options);

    this.state = {
      item: params,
      nomeEmpresa: params._postadoPor,
      nome: params.nome,
      contato: params.contato,
      periodo: params.periodo,
      valor: params.valor,
      tipo: params.tipo,
      descricao: params.descricao,
      localizacao: params.localizacao,
      id: params.docId,
      pub: pubdate,
      snackbarVisivel: false,
      snackbarMensagem: "",
      editar: params._postadoPorUID === firebase.auth().currentUser.uid
    };
  }

  editar() {
    this.props.navigation.navigate("AdicionarVaga", { item: this.state.item });
  }

  excluir() {
    this.setState({
      botaoDisabled: true
    });

    FirebaseHelper.removerVaga({ id: this.state.id }, () => {
      this.setState({
        snackbarMensagem: "A vaga foi removida com sucesso! Para que as alterações sejam percebidas, é necessário reiniciar o aplicativo!",
        snackbarVisivel: true
      });
    }, erro => {
      this.setState({
        snackbarMensagem: erro,
        snackbarVisivel: true,
        botaoDisabled: false
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Ionicons style={styles.voltar} onPress={() => this.props.navigation.goBack()} name="arrow-back-outline" color="#333" size={30} />
          <Text style={styles.titulo}>Detalhes da vaga</Text>
        </View>

        <ScrollView>
          <Text style={styles.itemTitulo}>{this.state.nome}</Text>
          <MapView initialRegion={this.state.localizacao} showsUserLocation={true}
            style={styles.mapa}>
            <Marker coordinate={this.state.localizacao} />
          </MapView>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch' }}>
            <Ionicons name="people-outline" color="#333" size={30} style={{ margin: 5, marginLeft: 10 }} />
            <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: "Book", color: '#333' }}>{this.state.nomeEmpresa}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch' }}>
            <Ionicons name="briefcase-outline" color="#333" size={30} style={{ margin: 5, marginLeft: 10 }} />
            <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: "Book", color: '#333' }}>{this.state.periodo + ": R$" + this.state.valor + " " + this.state.tipo}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch' }}>
            <Ionicons name="call-outline" color="#333" size={30} style={{ margin: 5, marginLeft: 10 }} />
            <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: "Book", color: '#333' }}>{this.state.contato}</Text>
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', alignSelf: 'stretch', marginLeft: 10, marginTop: 10 }}>
            <Text style={styles.itemSubtitulo}>Descrição da vaga</Text>
            <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: "Book", color: '#333' }}>{this.state.descricao}</Text>
          </View>

          {this.state.editar &&
            <Button
              style={styles.botao}
              onPress={() => this.editar()}
              style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
              disabled={this.state.botaoDisabled}>
              <Text style={styles.btn}>EDITAR VAGA</Text>
            </Button>
          }

          {this.state.editar &&
            <Button
              style={styles.botao}
              onPress={() => this.excluir()}
              style={!this.state.botaoDisabled ? styles.botao : styles.botaoDesativado}
              disabled={this.state.botaoDisabled}>
              <Text style={styles.btn}>EXCLUIR VAGA</Text>
            </Button>
          }
        </ScrollView>

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
  mapa: {
    borderRadius: 8,
    height: 140,
    alignSelf: 'stretch',
    marginHorizontal: 10
  },
  itemTitulo: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Bold',
    fontSize: 18,
    marginTop: 5
  },
  itemSubtitulo: {
    textAlign: 'left',
    color: '#333',
    fontFamily: 'Medium',
    fontSize: 14,
    marginTop: 5
  },
  btn: {
    fontFamily: "Medium",
    color: "#fff",
    fontSize: 16,
  }
});
