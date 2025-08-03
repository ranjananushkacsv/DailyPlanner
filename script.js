// Global data storage
let tasks = [];
let selfCareEntries = {
    water: [],
    meditation: [],
    manifestation: [],
    writing: []
};
let projects = [];
let tests = {
    assigned: [],
    upcoming: [],
    completed: []
};

// Motivational quotes
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", author: "Unknown" }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setDailyQuote();
    renderTasks();
    renderSelfCareEntries();
    renderProjects();
    renderTests();
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Daily Quote
function setDailyQuote() {
    const today = new Date().getDate();
    const quote = quotes[today % quotes.length];
    document.getElementById('dailyQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
}

// Tasks functionality
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    
    if (taskInput.value.trim() === '') return;
    
    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        priority: prioritySelect.value,
        completed: false,
        date: new Date().toDateString()
    };
    
    tasks.push(task);
    taskInput.value = '';
    prioritySelect.value = 'low';
    
    renderTasks();
    saveData();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveData();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const today = new Date().toDateString();
    
    // Filter tasks for today and remove completed tasks from previous days
    tasks = tasks.filter(task => task.date === today || !task.completed);
    
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
        `;
        
        taskList.appendChild(taskElement);
    });
}

// Self Care functionality
function addEntry(type) {
    const input = document.getElementById(`${type}Input`);
    const value = input.value.trim();
    
    if (value === '') return;
    
    if (!selfCareEntries[type]) selfCareEntries[type] = [];
    
    selfCareEntries[type].unshift({
        text: value,
        date: new Date().toLocaleDateString()
    });
    
    // Keep only last 10 entries
    if (selfCareEntries[type].length > 10) {
        selfCareEntries[type] = selfCareEntries[type].slice(0, 10);
    }
    
    input.value = '';
    renderSelfCareEntries();
    saveData();
}

function renderSelfCareEntries() {
    Object.keys(selfCareEntries).forEach(type => {
        const container = document.getElementById(`${type}Entries`);
        container.innerHTML = '';
        
        selfCareEntries[type].forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-item';
            entryElement.innerHTML = `
                <div><strong>${entry.date}:</strong> ${entry.text}</div>
            `;
            container.appendChild(entryElement);
        });
    });
}

// Projects functionality
function addProject() {
    const projectName = prompt('Enter project name:');
    if (!projectName) return;
    
    const project = {
        id: Date.now(),
        name: projectName,
        stages: [
            { text: 'BrainStorming and TechStack', completed: false },
            { text: 'Coding/ Model/ Dashboards - Core Part', completed: false },
            { text: 'Documentation', completed: false },
            { text: 'GitHub and Deployment', completed: false }
        ]
    };
    
    projects.push(project);
    renderProjects();
    saveData();
}

function toggleProjectStage(projectId, stageIndex) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.stages[stageIndex].completed = !project.stages[stageIndex].completed;
        renderProjects();
        saveData();
    }
}

function deleteProject(projectId) {
    projects = projects.filter(p => p.id !== projectId);
    renderProjects();
    saveData();
}

function renderProjects() {
    const container = document.getElementById('projectContainer');
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-box';
        
        const stagesHTML = project.stages.map((stage, index) => `
            <div class="stage-item">
                <input type="checkbox" class="stage-checkbox" ${stage.completed ? 'checked' : ''} 
                       onchange="toggleProjectStage(${project.id}, ${index})">
                <span class="stage-text">${stage.text}</span>
            </div>
        `).join('');
        
        projectElement.innerHTML = `
            <div class="project-title">${project.name}</div>
            <div class="project-stages">${stagesHTML}</div>
            <button class="delete-btn" onclick="deleteProject(${project.id})">Delete Project</button>
        `;
        
        container.appendChild(projectElement);
    });
}

// Tests functionality
function addTest(type) {
    const input = document.getElementById(`${type}TestInput`);
    const value = input.value.trim();
    
    if (value === '') return;
    
    const test = {
        id: Date.now(),
        text: value,
        date: new Date().toLocaleDateString()
    };
    
    tests[type].push(test);
    input.value = '';
    
    renderTests();
    saveData();
}

function moveToCompleted(testId, fromType) {
    const testIndex = tests[fromType].findIndex(t => t.id === testId);
    if (testIndex > -1) {
        const test = tests[fromType].splice(testIndex, 1)[0];
        test.completedDate = new Date().toLocaleDateString();
        tests.completed.push(test);
        renderTests();
        saveData();
    }
}

function deleteTest(testId, type) {
    tests[type] = tests[type].filter(t => t.id !== testId);
    renderTests();
    saveData();
}

function renderTests() {
    // Render assigned tests
    const assignedContainer = document.getElementById('assignedTests');
    assignedContainer.innerHTML = '';
    tests.assigned.forEach(test => {
        const testElement = document.createElement('div');
        testElement.className = 'test-item';
        testElement.innerHTML = `
            <input type="checkbox" onchange="moveToCompleted(${test.id}, 'assigned')">
            <span class="task-text">${test.text}</span>
            <button class="delete-btn" onclick="deleteTest(${test.id}, 'assigned')">×</button>
        `;
        assignedContainer.appendChild(testElement);
    });
    
    // Render upcoming tests
    const upcomingContainer = document.getElementById('upcomingTests');
    upcomingContainer.innerHTML = '';
    tests.upcoming.forEach(test => {
        const testElement = document.createElement('div');
        testElement.className = 'test-item';
        testElement.innerHTML = `
            <span class="task-text">${test.text}</span>
            <button class="delete-btn" onclick="deleteTest(${test.id}, 'upcoming')">×</button>
        `;
        upcomingContainer.appendChild(testElement);
    });
    
    // Render completed tests
    const completedContainer = document.getElementById('completedTests');
    completedContainer.innerHTML = '';
    tests.completed.forEach(test => {
        const testElement = document.createElement('div');
        testElement.className = 'test-item';
        testElement.innerHTML = `
            <span class="task-text">${test.text}</span>
            <small style="color: #666; margin-left: 10px;">Completed: ${test.completedDate}</small>
            <button class="delete-btn" onclick="deleteTest(${test.id}, 'completed')">×</button>
        `;
        completedContainer.appendChild(testElement);
    });
}

// Data persistence (using variables instead of localStorage for Claude.ai compatibility)
function saveData() {
    // In a real implementation, you would save to localStorage
    // localStorage.setItem('anushkaDesk', JSON.stringify({
    //     tasks,
    //     selfCareEntries,
    //     projects,
    //     tests
    // }));
}

function loadData() {
    // In a real implementation, you would load from localStorage
    // const saved = localStorage.getItem('anushkaDesk');
    // if (saved) {
    //     const data = JSON.parse(saved);
    //     tasks = data.tasks || [];
    //     selfCareEntries = data.selfCareEntries || { water: [], meditation: [], manifestation: [], writing: [] };
    //     projects = data.projects || [];
    //     tests = data.tests || { assigned: [], upcoming: [], completed: [] };
    // }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeSection = document.querySelector('.section.active');
        if (activeSection.id === 'tasks' && document.getElementById('taskInput') === document.activeElement) {
            addTask();
        }
    }
});