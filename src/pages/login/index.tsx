import React,{ useState } from "react";
import { style } from "./styles";
import Logo from "../../assets/logo.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {Text, View,Image, Alert} from 'react-native'
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import {MaterialIcons,Octicons} from '@expo/vector-icons';
import { useUser } from "../../context/userContext";

export default function Login (){
    const navigation = useNavigation<NavigationProp<any>>();

    const { setNomeUsuario } = useUser();
    
    const [email,setEmail]               = useState('cindy@gmail.com');
    const [password,setPassword]         = useState('12345');
    const [showPassword,setShowPassword] = useState(true);
    const [loading,setLoading]           = useState(false);


    async function getLogin() {
        try {
            setLoading(true)
            
            if(!email ||!password){
                return Alert.alert('Atenção','Informe os campos obrigatórios!')
            }

            let nomeUsuario = '';
            if((email === 'cindy@gmail.com'  && password === '12345' ||
               email === 'helton@gmail.com' && password === '12345' ||
               email === 'arthur@gmail.com' && password === '12345' )){
            
                // Atribui um nome com base no e-mail
                if (email === 'cindy@gmail.com') nomeUsuario = 'Cindy Morais';
                else if (email === 'helton@gmail.com') nomeUsuario = 'Helton Morais';
                else if (email === 'arthur@gmail.com') nomeUsuario = 'Arthur FECAF';
               
                setNomeUsuario(nomeUsuario);
                
                return navigation.reset({ routes: [{ name: 'Tasks'}] });  
                
            }

            Alert.alert('Atenção','E-mail ou senha invalida!')
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }


    return(
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image 
                    source={Logo} 
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.text}>ONG Quadrangular Projeto Vida</Text>
                <Text style={style.textTask}>LISTA DE TAREFAS</Text>
            </View>
            <View style={style.boxMid}>
                <Input 
                    title="ENDEREÇO E-MAIL"
                    value={email}
                    onChangeText={setEmail}
                    IconRigth={MaterialIcons}
                    iconRightName="email"
                    onIconRigthPress={()=>console.log('OLA')}
                />
                <Input 
                    title="SENHA"
                    value={password}
                    onChangeText={setPassword}
                    IconRigth={Octicons}
                    iconRightName={showPassword?"eye-closed":"eye"}
                    onIconRigthPress={()=>setShowPassword(!showPassword)}
                    secureTextEntry={true}
                    multiline={false}
                />
            </View>
            <View style={style.boxBottom}>
                <Button  text="ENTRAR" loading={loading} onPress={()=>getLogin()}/>
            </View>
            <Text style={style.textBottom}>Não tem conta? <Text  style={style.textBottomCreate}>Crie agora</Text></Text>
        </View>
    )
}