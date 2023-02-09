 import React from 'react';
  import {Button, Image, StyleSheet, Text, TextInput, ToastAndroid, View} from 'react-native';
  import {NavigationContainer} from '@react-navigation/native';
  import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
  import ImageJogo from './assets/jogos.jpg';
  import axios from 'axios';

  const Tab = createBottomTabNavigator();

  function Cadastro(props) { 
    return (
      <View style={estilos.viewFormulario}>
        <Text style={estilos.titulo}><i>Minha Loja de Games</i></Text>
        <View style={estilos.viewInput}>
          <Text style={estilos.label}>Nome do Jogo</Text>
          <TextInput style={estilos.input} value={props.pedido.nomejogo}
                onChangeText={(txt) => {props.atualizarInput(txt, 'nomejogo')}}/>
        </View>
        <View style={estilos.viewInput}>
          <Text style={estilos.label}>Lancamento</Text>
          <TextInput style={estilos.input} value={props.pedido.datalancamento}
                onChangeText={(txt) => {props.atualizarInput(txt, 'datalancamento')}}/>
        </View>
        <View style={estilos.viewInput}>
          <Text style={estilos.label}>Gênero</Text>
          <TextInput style={estilos.input} value={props.pedido.genero}
                onChangeText={(txt) => {props.atualizarInput(txt, 'genero')}}/>
        </View>
        <View style={estilos.viewInput}>
          <Text style={estilos.label}>Quantidade</Text>
          <TextInput style={estilos.input} value={props.pedido.quantidade}
                onChangeText={(txt) => {props.atualizarInput(txt, 'quantidade')}}/>
        </View>
        <Button title="Gravar" color="black" onPress={props.gravar}/>
      </View>
    );
  }

  function ListaPedidos(props) { 
    const lista = props.lista;  
    const listaDisplay = lista.map( (elemento)=> {
      return (
        <View style={estilos.listaItem}>
        <Text style={estilos.listaTitulo}>{elemento.nomejogo}</Text>
        <View style={estilos.listaConteudo}>
          <Text style={estilos.listaConteudoItem}>Quantidade: {elemento.quantidade}</Text>
          <Text style={estilos.listaConteudoItem}>Data de Lançamento:  {elemento.datalancamento}</Text>
          <Text style={estilos.listaConteudoItem}>Gênero: {elemento.genero}</Text>
        </View>
      </View>
      );
    } );



    return (
      <View style={estilos.lista}>
        {listaDisplay}
        <Button title="Atualizar" color="black" onPress={props.atualizar}/>
      </View>
    );
  }

  class App extends React.Component {

    state = {
      lista:  [
        {nomejogo: "God Of War",
        datalancamento: "20/04/2018",
        genero: "Aventura",
        quantidade: "30"},
  
        {nomejogo: "Days Gone",
        datalancamento: "26/04/2019",
        genero: "Ação",
        quantidade: "50"},
  
        {nomejogo: "Horizon Zero Dawn",
        datalancamento: "28/02/2017",
        genero: "RPG",
        quantidade: "30"},
      ],

      cadastro: { 
        nomejogo: "",
        datalancamento: "",
        genero: "",
        quantidade: "",
      }
    }

    atualizarLista() {
      axios.get('https://jogosz.herokuapp.com/jogos')
      .then( (response) => {
        console.log('Funcionou');
        console.log(response.data);
        const novoState = {...this.state};
        novoState.lista = [...response.data];
        this.setState(novoState);
        ToastAndroid.show("Lista carregada com sucesso", ToastAndroid.LONG);
      })
      .catch( () => {
        ToastAndroid.show("Erro ao carregar a lista", ToastAndroid.LONG);
      })
    }

    limparPedido() { 
      const novoState = {...this.state};
      novoState.cadastro.nomejogo = "";
      novoState.cadastro.datalancamento = "";
      novoState.cadastro.genero = "";
      novoState.cadastro.quantidade = "";
      this.setState(novoState);
    }

    gravarPedido() { 
      axios.post('https://jogosz.herokuapp.com/jogo/adicionar', 
        this.state.cadastro)
      .then( () => {
        ToastAndroid.show("Pedido gravado com sucesso", ToastAndroid.LONG);
        this.limparPedido();
      } )
      .catch( () => {
        ToastAndroid.show("Erro ao gravar o pedido", ToastAndroid.LONG);
      } )
    }

    atualizarTextInput(texto, campo) { 
      const novoState = {...this.state};
      novoState.cadastro[campo] = texto;
      this.setState(novoState);
    }

    render() { 
      return (
        <View style={estilos.principal}>
          <Image source={ImageJogo} style={estilos.imagemCabecalho}></Image>
          <View style={estilos.viewNavigation}>
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen name="Cadastro">
                  {()=>
                    <Cadastro gravar={
                                        () => {this.gravarPedido();}
                                      }
                                pedido={this.state.cadastro}
                                atualizarInput={(txt, campo) => {this.atualizarTextInput(txt, campo)}}
                    />
                  }
                </Tab.Screen>
                <Tab.Screen name="Listar Jogos">
                  {()=>
                    <ListaPedidos 
                          lista={this.state.lista} 
                          atualizar={
                                    ()=> {this.atualizarLista();}
                                  }/>
                  }
                </Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </View>
        </View>
      );
    }
  }


  class Login extends React.Component { 

    state = {
      usuario: "",
      senha: "",
      token: undefined,
    }

    atualizaTexto(txt, campo) { 
      const novoState = {...this.state};
      novoState[campo] = txt;
      this.setState(novoState);
    }

    login() {
      
      const userInfo = {
            "usuario": this.state.usuario,
            "senha": this.state.senha,
      }
      axios.post('https://jogosz.herokuapp.com/login', userInfo)
      .then((res)=>{
        console.log(res.data);
        ToastAndroid.show("Logado", ToastAndroid.LONG);
      })
      .catch((err)=>{
        console.log("Erro==>", err);
        ToastAndroid.show("Erro: " + err, ToastAndroid.LONG);
      })
    }


    render() { 
      return (
        <View style={estilos.loginArea}>
          <Text>Insira o nome do usuário</Text>
          <TextInput  style={estilos.loginUsuario} 
                      value={this.state.usuario}
                      onChangeText={(texto)=>{this.atualizaTexto(texto, 'usuario')}}/>
          <Text>Insira sua senha</Text>
          <TextInput style={estilos.loginSenha}
                      placeholderTextColor="#9a73ef"
                      returnKeyType="go"
                      secureTextEntry
                      autoCorrect={false}
                      value={this.state.senha}
                      onChangeText={(texto)=>{this.atualizaTexto(texto, 'senha')}}/>
          <Button title="LOG IN" color="black" onPress={()=>{this.login()}}/>
        </View>
      )
    }
  }

  export default Login;

  const estilos = StyleSheet.create({
    loginArea: { 
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    loginUsuario: { 
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: "#77F"
    },
    loginSenha: { 
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: "#777"
    },
    principal: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    imagemCabecalho: { 
      width: "100%",
      flex: 2,
    },
    viewNavigation: { 
      flex: 3,
    },
    label: { 
      flex: 1,
      fontWeight: 'bold',
      fontSize: 20,
    },
    input: { 
      flex: 3,
      backgroundColor: "silver",
      borderColor: "blue",
      borderWidth: 2,
    },
    viewInput: { 
      flex: 1,
      flexDirection: 'row',
      marginLeft: 15,
      marginRight: 15,
    },
    titulo: {
      flex: 1,
      alignSelf: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'fantasy'
    },
    viewFormulario: { 
      flex: 1,
      flexDirection: 'column',
      marginTop: 20,
      marginBottom: 10,
    },
    lista: { 
      flex: 1,
    },
    listaItem: { 
      borderBottomColor: '#33F',
      borderBottomWidth: 2,
      padding: 5,
      marginLeft: 15,
      marginRight: 15,
    },
    listaTitulo: { 
      fontWeight: 'bold'
    },
    listaConteudo: {
      flexDirection: 'row',
    },
    listaConteudoItem: { 
      flex: 1,
    }

  });
