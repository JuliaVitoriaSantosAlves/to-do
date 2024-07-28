import React from 'react';

interface HeaderProps {
    onAddTask: () => void;
    onExportToPDF: () => void;
    onViewCompletedTasks: () => void;
    viewCompleted: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddTask, onExportToPDF, onViewCompletedTasks, viewCompleted }) => {
    return (
        <header className="header">
            <h2>Gerenciador de Tarefas</h2>
            <div className="header-buttons">
                <button className="button button-secondary" onClick={onAddTask}>Adicionar Tarefa</button>
                <button className="button button-secondary" onClick={onExportToPDF}>Exportar para PDF</button>
                <button className="button button-secondary" onClick={onViewCompletedTasks}>
                    {viewCompleted ? 'Ver Pendentes' : 'Ver Concluídas'}
                </button>
            </div>
        </header>
    );
};

export default Header;