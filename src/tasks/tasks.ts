import database from '@react-native-firebase/database';
import { Alert } from 'react-native';

export const createTask = async (taskData: {
    uid: string | null,
    taskTitle: string,
    taskDescription: string,
    dueDate: Date,
    priority: 'Low' | 'Medium' | 'High' | ""
}) => {
    try {
        const tasksRef = database().ref('tasks');

        const newTaskRef = tasksRef.push();
        newTaskRef
            .set({
                uid: taskData?.uid,
                title: taskData?.taskTitle,
                description: taskData?.taskDescription,
                dueDate: taskData?.dueDate.toISOString(),
                priority: taskData?.priority,
                completed: false, // Default status
                createdAt: new Date().toISOString(), // Add a timestamp
            })
            .then((res) => {
                console.log("Task Created Success!");
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to add task: ' + error.message);
            });
    } catch (error) {
        console.log("Error creating task!")
    }
}