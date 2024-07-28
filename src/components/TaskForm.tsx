import React, { useState } from 'react';

interface TaskFormProps {
    onAdd: (title: string, description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim().length > 0) {
            onAdd(title, description);
            setTitle('');
            setDescription('');
            setError('');
        } else {
            setError('A descrição não pode ser vazia.');
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título"
                    required
                />
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Descrição (use poucas palavras)"
                    required
                    style={{
                        height: '200%',
                        overflow: 'auto',
                        resize: 'none',
                    }}
                />
                <div className="character-count">
                    {description.length} caracteres
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Adicionar Tarefa</button>
            </form>
        </div>
    );
};

export default TaskForm;