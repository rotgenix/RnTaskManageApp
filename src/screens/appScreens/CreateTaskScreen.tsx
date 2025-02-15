import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { backgroundColors, textColors } from '../../constants/colors';
import { createTask } from '../../tasks/tasks';
import { useAtom } from 'jotai';
import { userAtom } from '../../jotaiStores/userAtomStore';
import database from '@react-native-firebase/database';
import { showToast } from '../../utils/ToastMessage';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
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
                    console.log("res", res);
                    console.log("Task Created Success!");
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
                <Text>{dueDate.toLocaleDateString()}</Text>
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
                {['Low', 'Medium', 'High'].map((level) => (
                    <TouchableWithoutFeedback key={level} onPress={() => setPriority(level)}>
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, priority === level && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>{level}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
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
