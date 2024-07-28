import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types/Task';

interface TaskListProps {
    tasks: Task[];
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onDelete, onEdit }) => {
    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    onDelete={onDelete}
                    onEdit={() => onEdit(task.id)}
                />
            ))}
        </div>
    );
};

export default TaskList;