import React, { useState, useEffect, useCallback } from 'react';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import TaskFilter from './components/TaskFilter';
import Header from './components/Header';
import { Task } from './types/Task';
import { fetchTasks, addTask, updateTask, deleteTask } from './services/api';
import { jsPDF } from 'jspdf';
import './styles/main.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewCompleted, setViewCompleted] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ textSearch?: string; sortBy?: string }>({});

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  const handleSaveTask = async (task: Task) => {
    if (task.id) {
      const updatedTask = await updateTask(task.id, task);
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } else {
      const newTask = await addTask(task);
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setCurrentTask(taskToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCompleteTask = async (id: string) => {
    const completedTimestamp = new Date().toISOString();
    const updatedTask = await updateTask(id, { completed: true, completedTimestamp });
    setTasks(tasks.map(task => task.id === id ? updatedTask : task));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const totalTasks = tasks.length;
    const totalCompletedTasks = tasks.filter(task => task.completed).length;
    const totalPendingTasks = totalTasks - totalCompletedTasks;

    const earliestTask = tasks.reduce<Task | null>((earliest, task) =>
      (!earliest || (task.timestamp && new Date(task.timestamp) < new Date(earliest.timestamp!)))
        ? task
        : earliest,
      null);
    const latestTask = tasks.reduce<Task | null>((latest, task) =>
      (!latest || (task.timestamp && new Date(task.timestamp) > new Date(latest.timestamp!)))
        ? task
        : latest,
      null);

    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    doc.text(`Total de tarefas para fazer: ${totalPendingTasks}`, 10, 10);
    doc.text(`Total de tarefas concluídas: ${totalCompletedTasks}`, 10, 20);
    doc.text(`Total absoluto de tarefas: ${totalTasks}`, 10, 30);

    if (earliestTask && latestTask) {
      const earliestFormatted = formatDateTime(earliestTask.timestamp!);
      const latestFormatted = formatDateTime(latestTask.timestamp!);
      doc.text(`Período das tarefas: ${earliestFormatted} a ${latestFormatted}`, 10, 40);
    }

    const filteredTasks = applyFilters(tasks, filters);
    filteredTasks.forEach((task, index) => {
      doc.text(`Título: ${task.title} - Prioridade: ${task.priority}`, 10, 50 + index * 10);
    });

    const now = new Date();
    const fileName = `tarefas_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.pdf`;
    doc.save(fileName);
  };

  const handleViewCompletedTasks = () => {
    setViewCompleted(!viewCompleted);
  };

  const handleFilterChange = useCallback((newFilters: { textSearch?: string; sortBy?: string }) => {
    setFilters(newFilters);
  }, []);

  const applyFilters = (tasks: Task[], filters: { textSearch?: string; sortBy?: string }) => {
    let filteredTasks = tasks;

    if (filters.textSearch) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(filters.textSearch!.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.textSearch!.toLowerCase())
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'date_asc':
          filteredTasks.sort((a, b) =>
            new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
          );
          break;
        case 'date_desc':
          filteredTasks.sort((a, b) =>
            new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime()
          );
          break;
        case 'priority_high':
          filteredTasks = filteredTasks.filter(task => task.priority === 'alta');
          break;
        case 'priority_medium':
          filteredTasks = filteredTasks.filter(task => task.priority === 'moderada');
          break;
        case 'priority_low':
          filteredTasks = filteredTasks.filter(task => task.priority === 'baixa');
          break;
        case 'title_asc':
          filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title_desc':
          filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }

    return filteredTasks;
  };

  const displayedTasks = applyFilters(
    viewCompleted ? tasks.filter(task => task.completed) : tasks.filter(task => !task.completed),
    filters
  );

  return (
    <div className="app-container">
      <Header
        onAddTask={() => { setIsModalOpen(true); setCurrentTask(null); }}
        onExportToPDF={handleExportToPDF}
        onViewCompletedTasks={handleViewCompletedTasks}
        viewCompleted={viewCompleted}
      />
      <div className="content">
        <TaskFilter onFilterChange={handleFilterChange} />
        <div className="task-columns">
          <h2>{viewCompleted ? 'Tarefas Concluídas' : 'Tarefas Pendentes'}</h2>
          <TaskList tasks={displayedTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={handleEditTask} />
        </div>
      </div>
      {isModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default App;