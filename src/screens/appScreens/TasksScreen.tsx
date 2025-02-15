import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { backgroundColors, textColors } from '../../constants/colors';
import SplashScreen from 'react-native-splash-screen';
import { showToast } from '../../utils/ToastMessage';
import NoTaskScreen from '../../components/NoTasks';

type AppNavigationProp = BottomTabNavigationProp<AppBottomTabNavigatorParamsList, "Tasks-Screen">;

const TasksScreen = () => {
    const [userData, setUserData] = useAtom(userAtom);
    const [tasks, setTasks] = useAtom(userTaskAtom);
    const isFocused = useIsFocused();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFilterStatus, setSelectedFilterStatus] = useState<"Pending" | "Completed" | "">("");
    const [selectedFilterPriority, setSelectedFilterPriority] = useState<"Low" | "Medium" | "High" | "">("");

    const navigation = useNavigation<AppNavigationProp>();

    const [newTasks, setNewTasks] = useState<taskInterface[]>([]);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);

    const [sortBy, setSortBy] = useState<"Earliest" | "Oldest" | "">("");

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
                            let tasksArray = Object.keys(tasksData).map((key) => ({
                                id: key,
                                ...tasksData[key],
                            }));

                            tasksArray.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                            console.log("tasksArray", tasksArray)

                            setTasks(tasksArray);
                            setNewTasks(tasksArray);
                        } else {
                            setTasks([]);
                            setNewTasks([]);
                        }
                    });
            } catch (error) {
                console.log("Error while fetching tasks");
            }
        }

        if (tasks?.length === 0) {
            getTasks();
        }
        setNewTasks(tasks);
    }, [isFocused]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         SplashScreen.hide();
    //     }, 500);
    // }, [])

    const handleEdit = (task: taskInterface) => {
        navigation.navigate("Create-Task-Screen", {
            task: task,
            isEdit: true
        });
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
        setNewTasks(newTasks.filter(task => task.id !== id));
        const taskRef = database().ref(`tasks/${id}`);
        taskRef
            .remove()
            .then(() => {
                showToast({ text1: "Task Deleted Successfully", type: "success" });
            })
            .catch((error) => {
                console.error('Error deleting task: ', error);
                showToast({
                    text1: "Failed to deleted task",
                    text2: "Please try again",
                    type: "error"
                });
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
                showToast({ text1: `Task Marked as ${task?.completed ? "Incomplete" : "Complete"}!`, type: "success" });
            })
            .catch((error) => {
                console.error('Error updating task: ', error);
                showToast({
                    text1: "Failed to Mark task as Complete!",
                    text2: "Please try again",
                    type: "error"
                });
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

    const handleFilter = (FilterBy: string, Value: string) => {
        if (FilterBy === "Priority") {
            const filteredTasks = tasks.filter((task) => {
                return task.priority === Value;
            });
            setNewTasks(filteredTasks);
        } else if (FilterBy === "Status") {
            const filteredTasks = tasks.filter((task) => {
                return task.completed === (Value === "Pending" ? false : true);
            });
            setNewTasks(filteredTasks);
        } else if (selectedFilterStatus.length > 0 && selectedFilterPriority?.length > 0) {
            const filteredTasks = tasks.filter((task) => {
                return (task.completed === (selectedFilterStatus === "Pending" ? false : true)) && (task.priority === selectedFilterPriority);
            });
            setNewTasks(filteredTasks);
        }
    }

    const handleSort = (SortBy: string) => {
        if (SortBy === "Earliest") {
            newTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        } else if (SortBy === "Oldest") {
            newTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tasks</Text>

            {/* {newTasks.length > 0 &&} */}

            <View style={styles?.searchContainer}>
                <MaterialIcons name="search" size={24}
                    color={textColors?.teriaryColor}
                />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search tasks..."
                    value={searchQuery}
                    placeholderTextColor={textColors?.teriaryColor}
                    onChangeText={(text) => {
                        if (text?.length > 0) {
                            const searchedTask = tasks.filter((task) => {
                                return task.title.includes(text);
                            });
                            setNewTasks(searchedTask);
                        }
                        else {
                            setNewTasks(tasks);
                        }
                        setSearchQuery(text);
                    }}
                />
            </View>

            {/* Filter Button */}
            <View style={styles?.filterContainer}>
                <View style={styles?.filterSortBtnsCont}>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setSortModalVisible(prev => !prev)}>
                        <Text style={styles.filterText}>Sort Tasks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(prev => !prev)}>
                        <Text style={styles.filterText}>Filter Tasks</Text>
                    </TouchableOpacity>
                </View>

                {/* Sort  */}
                {sortModalVisible && <View style={styles.sortOptionsContainer}>
                    <Text style={styles.modalTitle}>Due Date</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setSortBy('Earliest');
                            setSortModalVisible(false);
                            handleSort("Earliest");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, sortBy === "Earliest" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Earliest</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSortBy("Oldest");
                            setSortModalVisible(false);
                            handleSort("Oldest");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, sortBy === "Oldest" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Oldest</Text>
                        </View>
                    </TouchableOpacity>
                </View>}

                {/* Filter Modal */}
                {filterModalVisible && <View style={styles.filterOptionsContainer}>
                    <Text style={styles.modalTitle}>Status</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFilterStatus('Pending');
                            setFilterModalVisible(false);
                            handleFilter("Status", "Pending");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedFilterStatus === "Pending" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Pending</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFilterStatus('Completed'); setFilterModalVisible(false);
                            handleFilter("Status", "Completed");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedFilterStatus === "Completed" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Completed</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Priority</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFilterPriority('Low'); setFilterModalVisible(false);
                            handleFilter("Priority", "Low");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedFilterPriority === "Low" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Low</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFilterPriority('Medium');
                            setFilterModalVisible(false);
                            handleFilter("Priority", "Medium");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedFilterPriority === "Medium" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Medium</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFilterPriority('High');
                            setFilterModalVisible(false);
                            handleFilter("Priority", "High");
                        }}
                    >
                        <View style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedFilterPriority === "High" && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>High</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
            </View>

            {newTasks && newTasks.length > 0 && <FlatList
                data={newTasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskCard}
                style={styles.taskList}
            />}

            {newTasks.length === 0 && <NoTaskScreen />}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
    },
    searchBar: {
        flex: 1,
        height: 40,
    },
    // filter 
    filterContainer: {
        position: 'relative'
    },
    filterSortBtnsCont: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18
    },
    filterButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
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
    sortOptionsContainer: {
        width: 140,
        backgroundColor: "white",
        position: 'absolute',
        left: 0,
        zIndex: 1,
        borderRadius: 8,
        padding: 16,
        top: 40,
        gap: 8,
        elevation: 5
    },
    filterOptionsContainer: {
        width: 140,
        // height: 180,
        backgroundColor: "white",
        position: 'absolute',
        right: 0,
        zIndex: 1,
        borderRadius: 8,
        padding: 16,
        top: 40,
        gap: 8,
        elevation: 5
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 250,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOption: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalText: {
        fontSize: 16,
    },
    modalClose: {
        padding: 10,
        marginTop: 10,
    },
    filterText: {
        color: '#000',
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
