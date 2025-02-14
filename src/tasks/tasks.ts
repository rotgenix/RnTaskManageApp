import database from '@react-native-firebase/database';
import { Alert } from 'react-native';

export const createTask = async (taskData: {
    uid: string | null,
    taskTitle: string,
    taskDescription: string,
    dueDate: Date,
    priority: 'Low' | 'Medium' | 'High'
}) => {
    try {
        const tasksRef = database().ref('tasks');

        // Push a new task to the database
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
                console.log("Task Create res:", res)
                // Alert.alert('Success', 'Task added successfully!');
                // setTaskTitle('');
                // setTaskDescription('');
                console.log("Task Created Success!");
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to add task: ' + error.message);
            });
    } catch (error) {
        console.log("Error creating task!")
    }
}

export const getAllTasks = (uid: string | null) => {
    try {
        const tasksRef = database().ref('tasks');

        // Fetch tasks for the specific user
        tasksRef
            .orderByChild('uid') // Order by userId
            .equalTo(uid) // Filter by the specific user ID
            .on('value', (snapshot) => {
                console.log("snapshot", snapshot);
                const tasksData = snapshot.val();
                console.log("tasksData", tasksData)
                if (tasksData) {
                    const tasksArray = Object.keys(tasksData).map((key) => ({
                        id: key,
                        ...tasksData[key],
                    }));
                    console.log("tasksArray:", tasksArray);
                    return tasksArray;
                } else {
                    return []; // No tasks found
                }
            });
    } catch (error) {
        console.log("Error while fetcing tasks");
    }
}