import { useAtom } from 'jotai';
import React, { useState } from 'react';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { showToast } from '../../utils/ToastMessage';
import { userAtom } from '../../jotaiStores/userAtomStore';
import { backgroundColors, textColors } from '../../constants/colors';
import { AppBottomTabNavigatorParamsList } from '../../navigations/AppNavigation';

type AppNavigationProp = BottomTabNavigationProp<AppBottomTabNavigatorParamsList, "Tasks-Screen">;

const CreateTaskScreen = ({ }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "">("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [userData, setUserData] = useAtom(userAtom);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dueDate;

        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const navigation = useNavigation<AppNavigationProp>();

    const handleCreateTask = async () => {
        try {
            const isValidString = (str: string) => {
                return typeof str === 'string' && str.trim().length > 0;
            };

            if (!isValidString(title) || !isValidString(description) || !isValidString(priority)) {
                showToast({
                    text1: "Please Fill all the fields!!!",
                    type: "error"
                });
                return;
            }
            const tasksRef = database().ref('tasks');

            const newTaskRef = tasksRef.push();
            newTaskRef
                .set({
                    uid: userData?.uid,
                    title: title,
                    description: description,
                    dueDate: dueDate.toISOString(),
                    priority: priority,
                    completed: false,
                    createdAt: new Date().toISOString(),
                })
                .then((res) => {
                    showToast({
                        text1: "Task Created Successfully!!!", type: "success"
                    });
                    setTitle("");
                    setDescription("");
                    setDueDate(new Date());
                    setPriority("");

                    navigation.navigate("Tasks-Screen");
                })
                .catch((error) => {
                    console.log("error", error);
                    showToast({
                        text1: "Error while creating Task",
                        text2: "Please try again",
                        type: "error"
                    });
                });
        } catch (error) {
            console.log("Error creating task!")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Task</Text>

            <Text style={styles.label}>Task Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={textColors?.teriaryColor}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task description"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholderTextColor={textColors?.teriaryColor}
            />

            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.input}>
                <Text>{String(dueDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <Text style={styles.label}>Task Priority</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity key={"Low"} onPress={() => setPriority("Low")}>
                    <View style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, priority === "Low" && styles.radioButtonSelected]} />
                        <Text style={styles.radioLabel}>Low</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity key={"Medium"} onPress={() => setPriority("Medium")}>
                    <View style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, priority === "Medium" && styles.radioButtonSelected]} />
                        <Text style={styles.radioLabel}>Medium</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity key={"High"} onPress={() => setPriority("High")}>
                    <View style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, priority === "High" && styles.radioButtonSelected]} />
                        <Text style={styles.radioLabel}>High</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: '10%',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: backgroundColors?.primaryColor,
        marginRight: 5,
    },
    radioButtonSelected: {
        backgroundColor: backgroundColors?.primaryColor,
    },
    radioLabel: {
        fontSize: 16,
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: backgroundColors?.primaryColor,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CreateTaskScreen;
