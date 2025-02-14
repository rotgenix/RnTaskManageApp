import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAtom } from 'jotai';
import { userAtom } from '../../jotaiStores/userAtomStore';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import database from '@react-native-firebase/database';
import { taskInterface, userTaskAtom } from '../../jotaiStores/userTasksStore';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppBottomTabNavigatorParamsList } from '../../navigations/AppNavigation';

type AuthStackNavigationProp = BottomTabNavigationProp<AppBottomTabNavigatorParamsList, "Tasks-Screen">;

const TasksScreen = () => {
    const [userData, setUserData] = useAtom(userAtom);
    const [tasks, setTasks] = useAtom(userTaskAtom);
    const isFocused = useIsFocused();

    const navigation = useNavigation<AuthStackNavigationProp>();

    useEffect(() => {
        const getTasks = async () => {
            try {
                const tasksRef = database().ref('tasks');

                tasksRef
                    .orderByChild('uid')
                    .equalTo(userData?.uid)
                    .on('value', (snapshot) => {
                        const tasksData = snapshot.val();
                        if (tasksData) {
                            const tasksArray = Object.keys(tasksData).map((key) => ({
                                id: key,
                                ...tasksData[key],
                            }));
                            setTasks(tasksArray);
                        } else {
                            setTasks([]);
                        }
                    });
            } catch (error) {
                console.log("Error while fetching tasks");
            }
        }

        if (tasks?.length === 0) {
            getTasks();
        }
    }, [isFocused]);

    const handleEdit = (task: taskInterface) => {
        navigation.navigate("Create-Task-Screen", {
            task: task,
            isEdit: true
        });
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));

        const taskRef = database().ref(`tasks/${id}`);
        taskRef
            .remove()
            .then(() => {
                Alert.alert("Task Deleted Successfully");
            })
            .catch((error) => {
                console.error('Error deleting task: ', error);
            });
    };

    const handleMarkComplete = (task: taskInterface) => {
        const taskRef = database().ref(`tasks/${task?.id}`);

        setTasks(tasks?.map((taskItr) => {
            if (taskItr.id == task.id) {
                return {
                    ...task, completed: !task?.completed
                }
            }
            return taskItr;
        }));

        taskRef
            .update({ ...task, completed: !task?.completed })
            .then(() => {
                console.log('Task updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating task: ', error);
            });
    };

    const renderTaskCard = ({ item }: {
        item: taskInterface
    }) => {
        return (
            <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>

                <Text style={styles.taskDueDate}>Due Date: {String(item?.dueDate).split("T")[0]} {"("}{new Date(item?.dueDate).toLocaleDateString("en-US", { weekday: "short" })}{")"}</Text>

                <Text style={[styles.taskPriority, styles[item.priority.toLowerCase()]]}>{item.priority}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={[styles?.buttonStyle]}>
                        <MaterialIcons name="edit" size={24} color="#1F75FE" />
                        <Text style={styles?.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles?.buttonStyle]}>
                        <MaterialCommunityIcons name="delete" size={24} color="#FF033E" />
                        <Text style={styles?.btnText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMarkComplete(item)} style={[styles?.buttonStyle]}>
                        {item?.completed ? <Ionicons name="checkmark-done-circle" size={24} color="#32de84" /> : <Ionicons name="checkmark-done-circle-outline" size={24} color="#007BFF" />}
                        <Text style={styles?.btnText}>{item?.completed ? "Done" : "Pending"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tasks</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskCard}
                style={styles.taskList}
            />
        </View>
    );
}

export default TasksScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    taskList: {
        width: '100%',
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
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    taskDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    taskDueDate: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    taskPriority: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    low: {
        color: 'green',
    },
    medium: {
        color: 'orange',
    },
    high: {
        color: 'red',
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
    }
});
