import React from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
    task: Task;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete, onEdit }) => {
    const priorityClass =
        task.priority === 'alta' ? 'task-priority-high' :
            task.priority === 'moderada' ? 'task-priority-medium' :
                'task-priority-low';

    return (
        <div className={`card ${priorityClass}`}>
            <h3 className={task.completed ? "completed-title" : ""}>{task.title}</h3>
            <p className="description">{task.description}</p>
            <p className="timestamp">
                Criado em: {task.timestamp ? new Date(task.timestamp).toLocaleDateString() : 'Data desconhecida'}
            </p>
            {task.completed && task.completedTimestamp && (
                <p className="timestamp">
                    Concluído em: {new Date(task.completedTimestamp).toLocaleDateString()}
                </p>
            )}
            <div className="actions">
                <button className="button button-edit" onClick={() => onEdit?.(task.id)}>Editar</button>
                <button className="button button-delete" onClick={() => onDelete(task.id)}>Deletar</button>
                {!task.completed && (
                    <button className="button button-completar" onClick={() => onComplete(task.id)}>Completar</button>
                )}
            </div>
        </div>
    );
};

export default TaskItem;