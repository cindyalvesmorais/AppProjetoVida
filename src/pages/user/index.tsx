import React from "react";
import { style }  from "./styles";
import {Ionicons} from '@expo/vector-icons';
import { Text, View,Alert,TouchableOpacity } from "react-native";
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import { useUser } from "../../context/userContext";

export default function User() {
    const navigation = useNavigation<NavigationProp<any>>();

    const { nomeUsuario } = useUser();

    const handleLogout = () => {
        Alert.alert("Logout", "Você saiu da conta.");
        return navigation.reset({routes:[{name :'Login'}]});
    };

    return (
        <View style={style.container}>
            <Text style={style.name}>{ nomeUsuario }. Quer realmente sair ?</Text>
            <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
                <Ionicons 
                    name="exit"  
                    style={{color:'#FF8C00'}}
                    size={40}
                />
            </TouchableOpacity>
        </View>
    );
}
