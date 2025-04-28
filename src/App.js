import { useState } from 'react';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('counter');

  const addTask = () => {
    if (taskInput.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
      setTaskInput('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Clase dinámica para el tema
  const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="container">
        <header>
          <h1 className="app-title">
            React<span className="theme-highlight">Demo</span>
          </h1>
          <p className="app-tagline">
            Una aplicación interactiva creada con React
          </p>
          
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
          >
            <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          </button>
        </header>

        <div className="tabs">
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('counter')}
              className={`tab-button ${activeTab === 'counter' ? 'active' : ''}`}
            >
              Contador
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            >
              Tareas
            </button>
          </div>
        </div>

        {activeTab === 'counter' && (
          <section className="card">
            <h2 className="card-title">Estado y Eventos</h2>
            <div className="counter-container">
              <div className={`counter-value ${count > 0 ? 'positive' : count < 0 ? 'negative' : ''}`}>
                {count}
              </div>
              <div className="counter-buttons">
                <button 
                  onClick={() => setCount(count - 1)}
                  className="btn-circle btn-decrement"
                >
                  -
                </button>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="btn-circle btn-increment"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => setCount(0)}
                className="btn-reset"
              >
                Reiniciar
              </button>
            </div>
          </section>
        )}

        {activeTab === 'tasks' && (
          <section className="card">
            <h2 className="card-title">Lista de Tareas</h2>
            <div className="task-form">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Nueva tarea..."
                className="task-input"
              />
              <button 
                onClick={addTask}
                className="btn-add"
              >
                Añadir
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="tasks-empty">
                <div className="tasks-empty-icon">📋</div>
                <p className="tasks-empty-text">
                  No hay tareas pendientes
                </p>
                <p className="tasks-empty-hint">Añade alguna tarea para comenzar</p>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.map(task => (
                  <li 
                    key={task.id} 
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                  >
                    <label className="task-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                        {task.text}
                      </span>
                    </label>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="btn-delete"
                      aria-label="Eliminar tarea"
                    >
                      <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {tasks.length > 0 && (
              <div className="tasks-summary">
                <p>
                  {tasks.filter(t => t.completed).length} completada(s) de {tasks.length} tarea(s)
                </p>
              </div>
            )}
          </section>
        )}
        
        <footer>
          <p>Desarrollado con React</p>
        </footer>
      </div>
    </div>
  );
}