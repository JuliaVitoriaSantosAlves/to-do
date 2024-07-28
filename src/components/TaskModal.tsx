import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';

interface TaskModalProps {
    task?: Task | null;
    onSave: (task: Task) => void;
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<'baixa' | 'moderada' | 'alta'>(task?.priority || 'baixa');
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
        }
    }, [task]);

    const handleSubmit = () => {
        if (!title.trim() || !description.trim()) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const updatedTask: Task = {
            ...task!,
            title,
            description,
            priority,
            timestamp: task?.timestamp || new Date().toISOString(),
            completed: task?.completed || false,
            completedTimestamp: task?.completed ? task.completedTimestamp : undefined,
        };
        onSave(updatedTask);
        setError('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Título</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite o título da tarefa"
                        required
                    />
                    <label>Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Digite uma descrição para a tarefa"
                        required
                    />
                    <label>Prioridade</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'baixa' | 'moderada' | 'alta')}
                        required
                    >
                        <option value="" disabled>Selecione a prioridade</option>
                        <option value="baixa">Baixa</option>
                        <option value="moderada">Moderada</option>
                        <option value="alta">Alta</option>
                    </select>
                    {error && <div className="error-message">{error}</div>}
                    <button type="button" onClick={handleSubmit}>Salvar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;