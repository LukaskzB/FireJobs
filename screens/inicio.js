import React, { Component } from "react";
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { TextInput, Snackbar } from "react-native-paper";
import FirebaseHelper from "../firebaseHelper";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default class TelaInicio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      snackbarVisivel: false,
      snackbarMensagem: "",
      tipo: "",
      titulo: "",
      filtrar: "",
      labelFiltrar: "",
      dados: [],
      dadosFiltro: []
    };
  }

  async atualizarDados() {
    //pega os dados do usuário do banco de dados
    let dados = await FirebaseHelper.getDadosUsuario(data => { return data; }, () => { return ""; });

    //caso der erro
    if (dados == "") {
      this.setState({ snackbarVisivel: true, snackbarMensagem: "Ocorreu um erro ao resgatar as informações do banco de dados!" });
      return null;
    }

    this.setState({ tipo: dados.tipo, titulo: dados.tipo == "pessoa" ? "Encontrar vagas" : "Encontrar funcionários" });
    let list = dados.tipo == "pessoa" ? await FirebaseHelper.getVagas() : await FirebaseHelper.getFuncionarios();

    this.setState({ dados: list, dadosFiltro: list });
    this.setState({ labelFiltrar: dados.tipo == "pessoa" ? "Pesquisar entre vagas" : "Pesquisar entre funcionários" });
  }

  componentDidMount() {
    this.atualizarDados();
  }

  filtrar(texto) {
    this.setState({ filtrar: texto });
    let filterArray = this.state.dadosFiltro;
    let resultado = filterArray.filter(item => this.state.tipo == "pessoa" ? item.nome.toLowerCase().includes(texto.toLowerCase()) : item.nomeVaga.toLowerCase().includes(texto.toLowerCase()));
    this.setState({ dados: resultado });
  }

  abrirDetalhes(item) {
    this.props.navigation.navigate(this.state.tipo == "pessoa" ? "DetalhesVaga" : "DetalhesFuncionario", { item: item });
  }

  abrirAdicionar() {
    this.props.navigation.navigate(this.state.tipo == "pessoa" ? "AdicionarFuncionario" : "AdicionarVaga");
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.titulo}>{this.state.titulo}</Text>
          <Ionicons style={styles.perfil} onPress={() => this.props.navigation.navigate("Perfil", { tipo: this.state.tipo })} name="person-outline" color="#333" size={30} />
        </View>

        <TextInput
          onChangeText={(texto) => this.filtrar(texto)}
          value={this.state.filtrar}
          underlineColorAndroid="#ffffff00"
          mode='outlined'
          outlineColor='#00000000'
          theme={{ colors: { primary: '#FF6767', underlineColor: 'transparent', } }}
          underlineColor="#00000000"
          style={styles.search}
          label={this.state.labelFiltrar}
          left={<TextInput.Icon name="magnify" color="#333" size={30} />}
        />

        <FlatList style={{ alignSelf: 'stretch' }} data={this.state.dados} keyExtractor={item => item.id.toString()} renderItem={({ item }) => {
          let tipo = item.tipo == "horal" ? "a hora" : "mensal";
          let pessoa = this.state.tipo == "pessoa";
          return (
            <View style={styles.itemView} >
              <TouchableOpacity onPress={() => this.abrirDetalhes(item)}>
                <Text style={styles.itemTitulo}>{pessoa ? item.nome : item.nomeVaga}</Text>
                <Text style={styles.itemSubtitulo}>{item.periodo} {pessoa ? ": R$" + item.valor + " " + tipo : " "}</Text>
                {!pessoa && <Text style={styles.itemSubtitulo2}>{item._postadoPor}</Text>}
                <View style={styles.itemView2}>
                  <MapView style={styles.itemMapa} initialRegion={item.localizacao}>
                    <Marker coordinate={item.localizacao} />
                  </MapView>
                  <Text style={styles.itemDescricao}>{pessoa ? item.descricao : item.habilidades}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }} ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>{this.state.tipo == "pessoa" ? "Não há nenhum funcionário disponível." : "Não há nenhuma vaga disponível."}</Text>
          </View>
        )} />

        <TouchableOpacity onPress={() => this.abrirAdicionar()} >
          <Image style={styles.adicionar} source={require("../assets/adicionar.png")} />
        </TouchableOpacity>

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
    justifyContent: "flex-start",
    overflow: 'hidden'
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
  perfil: {
    position: "absolute",
    alignSelf: 'flex-end',
    paddingRight: 20
  },
  search: {
    height: 55,
    borderWidth: 1,
    borderColor: '#66333333',
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignSelf: "stretch",
    fontFamily: "Book",
    color: "#333",
  },
  itemView: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#66333333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 5
  },
  itemTitulo: {
    fontFamily: 'Medium',
    textAlign: 'left',
    color: '#333',
    fontSize: 16,
    marginTop: 5,
    marginHorizontal: 10
  },
  itemSubtitulo: {
    fontFamily: 'Medium',
    textAlign: 'left',
    color: '#333',
    fontSize: 14,
    marginHorizontal: 10
  },
  itemSubtitulo2: {
    fontFamily: 'Book',
    textAlign: 'left',
    color: '#333',
    fontSize: 14,
    marginHorizontal: 10
  },
  itemView2: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  itemMapa: {
    width: 120,
    height: 120,
    marginLeft: 10,
    borderRadius: 8,
    marginTop: 5
  },
  itemDescricao: {
    fontFamily: 'Book',
    textAlign: 'left',
    alignSelf: 'stretch',
    width: '55%',
    fontSize: 14,
    color: '#333',
    marginHorizontal: 5,
    marginTop: 5
  },
  adicionar: {
    width: 85,
    height: 85
  },
  adicionarOpacity: {
    position: 'absolute'
  }
});
