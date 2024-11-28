import React, { createContext, useContext, useEffect, useRef, useState } from "react"; 
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Modalize } from 'react-native-modalize';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Loading } from "../components/Loading";


export const AuthContextList:any= createContext({});

const flags = [
    { caption: 'Crítico', color: themas.Colors.red },
    { caption: 'Essencial', color: themas.Colors.orange },
    { caption: 'Moderado', color: themas.Colors.yellow },
    { caption: 'Menor', color: themas.Colors.green },
];

export const AuthProviderList = (props) => {
    
    const modalizeRef = useRef(null);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFlag, setSelectedFlag] = useState('Crítico');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [taskListBackup,setTaskListBackup]= useState([]);
    const [item,setItem] = useState(0);
    const [loading,setLoading]= useState(false)

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };

    useEffect(() => {
        get_taskList();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (date) => {
        setSelectedTime(date)
    };
    const handleSave = async () => {
        const newItem = {
            item: item !== 0 ? item : Date.now(),
            title,
            description,
            flag: selectedFlag,
            timeLimit: new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedTime.getHours(),
                selectedTime.getMinutes()
            ).toISOString()
        };
        onClose();
    
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            let taskList = storedData ? JSON.parse(storedData) : [];
    
            // Verifica se o item já existe no array
            const itemIndex = taskList.findIndex((task) => task.item === newItem.item);
    
            if (itemIndex >= 0) {
                // Substitui o item existente pelo novo
                taskList[itemIndex] = newItem;
            } else {
                // Adiciona o novo item ao array
                taskList.push(newItem);
            }
    
            await AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskList(taskList);
            setTaskListBackup(taskList)
            setData()
            
        } catch (error) {
            console.error("Erro ao salvar o item:", error);
            onOpen()
        }finally{
            setLoading(false)
        }
    };
    
    const filter = (t:string) => {
        if(taskList.length == 0)return
        const array = taskListBackup
        const campos = ['title','description']
        if (t) {
            const searchTerm = t.trim().toLowerCase(); 
            
            const filteredArr = array.filter((item) =>{ 
                for(let i =0; i<campos.length; i++){
                    if(item[campos[i].trim()].trim().toLowerCase().includes(searchTerm))
                        return true
                }
            });
    
            setTaskList(filteredArr);
        } else {
            setTaskList(array);
        }
    }

    

    const handleEdit = async (itemToEdit:PropCard) => {
        setTitle(itemToEdit.title);
        setDescription(itemToEdit.description);
        setSelectedFlag(itemToEdit.flag);
        setItem(itemToEdit.item)
        
        const timeLimit = new Date(itemToEdit.timeLimit);
        setSelectedDate(timeLimit);
        setSelectedTime(timeLimit);
        
        onOpen(); 
    };
    
    const handleDelete = async (itemToDelete) => {
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            const taskList = storedData ? JSON.parse(storedData) : [];
            
            const updatedTaskList = taskList.filter(item => item.item !== itemToDelete.item);
    
            await AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList));
            setTaskList(updatedTaskList);
            setTaskListBackup(updatedTaskList)
        } catch (error) {
            console.error("Erro ao excluir o item:", error);
        }finally{
            setLoading(false)
        }
    };
    

    async function get_taskList() {
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            const taskList = storedData ? JSON.parse(storedData) : [];
            setTaskList(taskList);
            setTaskListBackup(taskList)
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    const _renderFlags = () => {
        return flags.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
                setSelectedFlag(item.caption)
            }}>
                <Flag 
                    caption={item.caption}
                    color={item.color} 
                    selected={item.caption == selectedFlag}
                />
            </TouchableOpacity>
        ));
    };

    const setData = ()=>{
        setTitle('');
        setDescription('');
        setSelectedFlag('Crítico');
        setItem(0)
        setSelectedDate(new Date());
        setSelectedTime(new Date());
    }

    const _container = () => {
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => onClose()}>
                            <MaterialIcons name="close" style={styles.close} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{item != 0?'Editar tarefa':'Criar tarefa'}</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <AntDesign name="check" style={styles.check} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <Input 
                            title="Título:" 
                            labelStyle={styles.label} 
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Input 
                            title="Descrição:" 
                            numberOfLines={5} 
                            height={100} 
                            multiline 
                            labelStyle={styles.label}
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}  style={{ width: 130,zIndex:999 }}>
                                <Input 
                                    title="Data limite:" 
                                    labelStyle={styles.label} 
                                    editable={false}
                                    value={selectedDate.toLocaleDateString()}
                                    onPress={() => setShowDatePicker(true)} 
                                />
                            </TouchableOpacity>
                           
                        </View>

                            <CustomDateTimePicker 
                                type='date' 
                                onDateChange={handleDateChange} 
                                show={showDatePicker} 
                                setShow={setShowDatePicker} 
                            />
                           

                        <View style={styles.containerFlag}>
                            <Text style={styles.flag}>Flags:</Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                {_renderFlags()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    return (
        <AuthContextList.Provider value={{ onOpen, taskList,handleEdit,handleDelete,taskListBackup,filter}}>
            <Loading loading={loading}/>
            {props.children}
            <Modalize ref={modalizeRef} childrenStyle={{ height: 600 }} adjustToContentHeight={true}>
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    );
};

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFEED9'

    },
    header: {
        width: '100%',
        height: 40,
        paddingHorizontal: 40,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center'        
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        
    },
    content: {
        width: '100%',
        paddingHorizontal: 20,
        color: '#FF8C00'
    },
    label: {
        fontWeight: 'bold',
        color: '#FF8C00'
    },
    labelDescription: {
        fontWeight: 'bold',
        color: '#FF8C00'
    },  
    containerFlag: {
        paddingTop: 20,
        width: '100%',
        padding: 5
        
    },
    flag: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF8C00'
    },
    close: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#FF0000'
    },
    check: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#009900'
    }

});


export const useAuth = () => useContext(AuthContextList);

