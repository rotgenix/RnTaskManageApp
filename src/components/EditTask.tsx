import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { taskInterface, userTaskAtom } from '../jotaiStores/userTasksStore'
import { textColors } from '../constants/colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { showToast } from '../utils/ToastMessage';
import database, { update } from '@react-native-firebase/database';
import { useAtom } from 'jotai';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditTask = ({ completed,
    createdAt,
    description,
    dueDate,
    id,
    priority,
    title,
    uid,
    setIsEdit
}: {
    completed: boolean,
    createdAt: string,
    description: string,
    dueDate: string,
    id: string,
    priority: "Low" | "Medium" | "High",
    title: string,
    uid: string,
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [updatedTask, setUpdatedTask] = useState<taskInterface>({
        completed: completed,
        createdAt: createdAt,
        description: description,
        dueDate: dueDate,
        id: id,
        priority: priority,
        title: title,
        uid: uid,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [upDueDate, setUpDueDate] = useState<Date>(new Date(dueDate));
    const [tasks, setTasks] = useAtom(userTaskAtom);
    const [newTasks, setNewTasks] = useState<taskInterface[]>([]);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || upDueDate;
        setUpDueDate(currentDate);
        setShowDatePicker(false);
    };


    const handleUpdate = async () => {
        try {
            const taskRef = database().ref(`tasks/${id}`);

            taskRef
                .update({
                    ...updatedTask,
                    dueDate: upDueDate.toISOString()
                })
                .then((res) => {
                    showToast({
                        text1: "Task updated Successfully!",
                        type: "success"
                    });

                    setTasks(prev =>
                        prev.map(task =>
                            task.id === id ? { ...updatedTask, } : task
                        )
                    );
                    setNewTasks(prev =>
                        prev.map(task =>
                            task.id === id ? { ...updatedTask, } : task
                        )
                    );
                    setIsEdit(false);
                })
                .catch((error) => {
                    showToast({
                        text1: "Failed to update Task!",
                        text2: "Please try again",
                        type: "error"
                    });
                });
        } catch (error) {
            // console.log(error)
        }
    }

    return (
        <View style={styles.editTaskCard}>
            <View style={styles.editTaskCardContent}>
                {/* Task Title  */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter task title"
                    value={updatedTask.title}
                    onChangeText={(text) => {
                        setUpdatedTask(prev => ({
                            ...prev, title: text
                        }))
                    }}
                    placeholderTextColor={textColors?.teriaryColor}
                />

                {/* Task Description  */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter task description"
                    value={updatedTask?.description}
                    onChangeText={(text) => {
                        setUpdatedTask(prev => ({
                            ...prev, description: text
                        }))
                    }}
                    multiline
                    placeholderTextColor={textColors?.teriaryColor}
                />

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    {/* <Text>{String(upDueDate)}</Text> */}
                    <Text>{(upDueDate).toISOString().split("T")[0]}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={upDueDate}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

                <View style={styles.radioContainer}>
                    <TouchableOpacity
                        key={"Low"}
                        onPress={() => {
                            setUpdatedTask(prev => ({
                                ...prev, priority: "Low"
                            }))
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, updatedTask?.priority === "Low" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Low</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        key={"Medium"}
                        onPress={() => {
                            setUpdatedTask(prev => ({
                                ...prev, priority: "Medium"
                            }))
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, updatedTask?.priority === "Medium" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Medium</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        key={"High"}
                        onPress={() => {
                            setUpdatedTask(prev => ({
                                ...prev, priority: "High"
                            }))
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, updatedTask?.priority === "High" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>High</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleUpdate()} style={[styles?.buttonStyle]}>
                        <MaterialIcons name="save" size={24} color="#1F75FE" />
                        <Text style={styles?.btnText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsEdit(false)}
                        style={[styles?.buttonStyle]}
                    >
                        <MaterialCommunityIcons name="cancel" size={24} color="#FF033E" />
                        <Text style={styles?.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default EditTask

const styles = StyleSheet.create({
    editTaskCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    editTaskCardContent: {
        width: "80%",
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    taskCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    input: {
        width: '100%',
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
        width: 16,
        height: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#1F75FE",
        marginRight: 5,
    },
    radioButtonSelected: {
        backgroundColor: "#1F75FE",
    },
    radioLabel: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 36,
        marginTop: 10,
    },
    buttonStyle: {
        height: 36,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    btnText: {
        color: "black",
        fontSize: 12
    },
})