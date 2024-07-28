import React, { useState, useEffect } from 'react';

interface TaskFilterProps {
    onFilterChange: (filters: {
        textSearch?: string;
        sortBy?: string;
    }) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
    const [textSearch, setTextSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');

    useEffect(() => {
        onFilterChange({ textSearch, sortBy });
    }, [textSearch, sortBy, onFilterChange]);

    return (
        <div className="task-filter">
            <div>
                <label>Busca por Texto:</label>
                <input
                    type="text"
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                    placeholder="Buscar tarefas..."
                />
            </div>
            <div>
                <label>Ordenar por:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sem ordenação</option>
                    <option value="date_asc">Data Crescente</option>
                    <option value="date_desc">Data Decrescente</option>
                    <option value="priority_high">Prioridade Alta</option>
                    <option value="priority_medium">Prioridade Moderada</option>
                    <option value="priority_low">Prioridade Baixa</option>
                    <option value="title_asc">Título A-Z</option>
                    <option value="title_desc">Título Z-A</option>
                </select>
            </div>
        </div>
    );
};

export default TaskFilter;