import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, FlatList, ImageBackground, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Jogos from './assets/jogos.jpg';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const estilos = StyleSheet.create({
  principal: { 
    flex: 1,
    flexDirection: 'column',
    
  },

  cabecalho: {
    flex: 2,
    backgroundColor: '#FFC',
    alignItems: 'stretch',
  },

  corpo: {
    flex: 3,
    backgroundColor: '#CFF'
    
  },

  imagem: { 
    flex: 1,
    width: '100%',
    height: 320,
    resizeMode: 'contain',
    justifyContent: 'center'
  },

  titulo1: {
    fontSize: 40,
    color: "white",
    backgroundColor: 'rgba(150, 150, 150, 1)',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 209,
    },
    
  

    input: { 
      flex: 1,
      backgroundColor: "silver",
      borderColor: "blue",
      borderWidth: 2,
    },

      
  
});




const Lancamento = (props) => { 
  const options = {};

  

  return(
    <View>
      <br/>
      <Text> <b>Total de Jogos Vendidos      </b><TextInput  style={estilos.input} value={props.lancamentoAtual.vendas} 
          onChangeText={(texto)=>{props.atualizarInput('vendas', texto)}}/></Text> 
<br/>
      <Text><b> Data                                       </b><TextInput style={estilos.input} value={props.lancamentoAtual.datavenda}
          onChangeText={(texto)=>{props.atualizarInput('datavenda', texto)}}/></Text>
<br/>
<Text><b> Valor                                      </b><TextInput style={estilos.input} value={props.lancamentoAtual.valor}
          onChangeText={(texto)=>{props.atualizarInput('valor', texto)}}/> </Text>  
<br/>
    <Button title="Gravar" color='black' onPress= {props.gravar} />
    </View> 
  )
}



const Linha = (props) => { 
  console.log(props);
  return (
    <View>
      <Text><b>  <br/> Total de Jogos Vendidos :  {props.item.vendas}  <br/> Data :  {props.item.datavenda} <br/> Lucro Mensal :  {props.item.valor} </b></Text>
    </View>
  );
}

const Lista = (props) => { 
  console.log(props.lancamentos);
  return(
    <View>
      <FlatList
        data={props.lancamentos}
        renderItem={Linha}
        keyExtractor={item => item.index}
      />
    </View>
  )
}

class Principal extends React.Component { 
  state = { 
    lancamentoAtual : { 
      vendas: "",
      datavenda: "",
      valor: ""
    },

    lancamentos: [
      {vendas: "1000",
      datavenda: "20/04/2018",
      valor: "R$ 1.000"},

      {vendas: "2000",
      datavenda: "20/05/2018",
      valor: "R$ 2.000"},

      {vendas: "5000",
      datavenda: "20/06/2018",
      valor: "R$ 5.000"},
    ]
  }


  atualizarLancamento(campo, texto) { 
    const novoState = {...this.state};
    novoState.lancamentoAtual[campo] = texto;
    this.setState(novoState);
  }

  gravarLista() { 
    const novoState = {...this.state};
    novoState.lancamentos.push(
      {...novoState.lancamentoAtual}
    );
    this.setState(novoState);
  }

  render() { 
    return (
      <View style={estilos.principal}>
        <View style={estilos.cabecalho}>
          <ImageBackground source={Jogos} style={estilos.imagem}>
            <Text style={estilos.titulo1}>Minha Loja de Games</Text>
          </ImageBackground>
          
        </View>
        <View style={estilos.corpo}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Inserir vendas">
                { ()=>{return (
                  <Lancamento lancamentoAtual={this.state.lancamentoAtual}
                      atualizarInput={(campo, txt)=>{this.atualizarLancamento(campo, txt)}} 
                      gravar={()=>{this.gravarLista()}}
                      />
                )}}
              </Tab.Screen>
              <Tab.Screen name="Lista de Vendas">
                { ()=> {return (
                  <Lista lancamentos={this.state.lancamentos}/>
                )}}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </View>
    )
  }
}

export default Principal;
