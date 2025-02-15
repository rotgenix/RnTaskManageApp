import database from '@react-native-firebase/database';
import { Alert } from 'react-native';

export const createTask = async (taskData: {
    uid: string | null,
    taskTitle: string,
    taskDescription: string,
    dueDate: Date,
    priority: 'Low' | 'Medium' | 'High' | ""
}) => {
   
}