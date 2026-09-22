"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectStatus = "Planning" | "Active" | "Completed";

type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
};

type Task = {
  id: number;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
};

const defaultProjects: Project[] = [
  {
    id: 1,
    name: "Orbit",
    description: "AI-powered productivity workspace",
    progress: 75,
    status: "Active",
  },
  {
    id: 2,
    name: "Arc Integration",
    description: "Connect Orbit with the Arc ecosystem",
    progress: 35,
    status: "Planning",
  },
  {
    id: 3,
    name: "AI Assistant",
    description: "Build intelligent productivity features",
    progress: 20,
    status: "Planning",
  },
];

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Improve Orbit dashboard",
    project: "Orbit",
    priority: "High",
    completed: true,
  },
  {
    id: 2,
    title: "Build project management",
    project: "Orbit",
    priority: "High",
    completed: false,
  },
  {
    id: 3,
    title: "Design AI assistant",
    project: "AI Assistant",
    priority: "Medium",
    completed: false,
  },
  {
    id: 4,
    title: "Research Arc integration",
    project: "Arc Integration",
    priority: "Medium",
    completed: false,
  },
];

export default function Dashboard() {
 const [active, setActive] = useState("Dashboard");
const [showAIAssistant, setShowAIAssistant] = useState(false);
const [walletAddress, setWalletAddress] = useState("");

  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [loaded, setLoaded] = useState(false);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false); 
  const [aiInput, setAiInput] = useState("");
const [aiResponse, setAiResponse] = useState(
  "Ask Orbit anything about your projects, tasks or productivity."
);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const [editingProjectId, setEditingProjectId] = useState<number | null>(
    null
  );

  const [newProject, setNewProject] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [newTask, setNewTask] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Orbit");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");

  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] =
    useState<ProjectStatus>("Planning");

  /* -----------------------------
     LOAD SAVED DATA
  ----------------------------- */

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("orbit-projects");
      const savedTasks = localStorage.getItem("orbit-tasks");

      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch {
      console.log("Orbit storage could not be loaded.");
    }

    setLoaded(true);
  }, []);

  /* -----------------------------
     SAVE DATA
  ----------------------------- */

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("orbit-projects", JSON.stringify(projects));
  }, [projects, loaded]);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("orbit-tasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  /* -----------------------------
     STATISTICS
  ----------------------------- */

  const completedTasks = tasks.filter((task) => task.completed).length;

  const productivity = useMemo(() => {
    if (tasks.length === 0) return 0;

    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks.length, completedTasks]);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  const selectedProjectTasks = tasks.filter(
    (task) => task.project === selectedProject?.name
  );

  /* -----------------------------
     PROJECT FUNCTIONS
  ----------------------------- */

  function openProject(project: Project) {
    setSelectedProjectId(project.id);
    setEditProgress(project.progress);
    setEditStatus(project.status);
    setShowProjectDetails(true);
  } async function connectWallet() {
  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    alert("Please install MetaMask or another EVM wallet.");
    return;
  }

  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts?.[0]) {
      setWalletAddress(accounts[0]);
    }
  } catch {
    alert("Wallet connection was cancelled.");
  }
}
function handleAIQuery() {
  const query = aiInput.trim().toLowerCase();

  if (!query) {
    setAiResponse(
      "Ask me about your projects, tasks, productivity, priorities, or Arc work."
    );
    return;
  }

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  if (
    query.includes("how many project") ||
    query.includes("number of project") ||
    query.includes("projects do i have") ||
    query === "projects"
  ) {
    setAiResponse(
      `You currently have ${projects.length} projects. Your main project, Orbit, is ${projects[0]?.progress ?? 0}% complete.`
    );
    return;
  }

  if (
    query.includes("how many task") ||
    query.includes("number of task") ||
    query.includes("tasks do i have") ||
    query === "tasks"
  ) {
    setAiResponse(
      `You have ${tasks.length} tasks in total: ${completedTasks.length} completed and ${pendingTasks.length} still pending.`
    );
    return;
  }

  if (
    query.includes("what should i work") ||
    query.includes("what should i do") ||
    query.includes("what do i work") ||
    query.includes("next task") ||
    query.includes("next step")
  ) {
    if (pendingTasks.length > 0) {
      setAiResponse(
        `I recommend focusing on "${pendingTasks[0].title}" next. You currently have ${pendingTasks.length} pending tasks.`
      );
    } else {
      setAiResponse(
        "Great work! You have no pending tasks right now."
      );
    }
    return;
  }

  if (
    query.includes("productivity") ||
    query.includes("productive") ||
    query.includes("how am i doing") ||
    query.includes("my progress")
  ) {
    setAiResponse(
      `Your current task productivity is ${productivity}%. You have completed ${completedTasks.length} of ${tasks.length} tasks.`
    );
    return;
  }

  if (
    query.includes("unfinished") ||
    query.includes("pending") ||
    query.includes("incomplete")
  ) {
    setAiResponse(
      `You currently have ${pendingTasks.length} unfinished tasks.`
    );
    return;
  }

  if (
    query.includes("arc") ||
    query.includes("ecosystem")
  ) {
    setAiResponse(
      "Orbit is being developed for the Arc ecosystem. The current dashboard provides the workspace foundation, with deeper Arc integration planned as the project evolves."
    );
    return;
  }

  if (
    query.includes("summary") ||
    query.includes("overview") ||
    query.includes("status")
  ) {
    setAiResponse(
      `Orbit currently has ${projects.length} projects and ${tasks.length} tasks. ${completedTasks.length} tasks are completed, with overall task productivity at ${productivity}%.`
    );
    return;
  }

  if (
    query.includes("hello") ||
    query.includes("hi ") ||
    query === "hi" ||
    query.includes("hey")
  ) {
    setAiResponse(
      "Hello! I'm Orbit's productivity assistant. Ask me about your projects, tasks, productivity, priorities, or Arc work."
    );
    return;
  }

  setAiResponse(
    "I can help you understand your projects, tasks, productivity, priorities, and Arc work. Try asking: \"What should I work on next?\""
  );
}
    function createProject() {   if (!newProject.trim()) return;

    const project: Project = {
      id: Date.now(),
      name: newProject.trim(),
      description:
        newDescription.trim() || "New Orbit project",
      progress: 0,
      status: "Planning",
    };

    setProjects((current) => [...current, project]);

    setNewProject("");
    setNewDescription("");
    setShowProjectForm(false);
  }

  function deleteProject(id: number) {
    const project = projects.find((item) => item.id === id);

    if (!project) return;

    const confirmed = window.confirm(
      `Delete "${project.name}"?`
    );

    if (!confirmed) return;

    setProjects((current) =>
      current.filter((item) => item.id !== id)
    );

    setTasks((current) =>
      current.filter((task) => task.project !== project.name)
    );

    if (selectedProjectId === id) {
      setShowProjectDetails(false);
      setSelectedProjectId(null);
    }
  }

  function saveProjectChanges() {
    if (!selectedProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              progress: editProgress,
              status: editStatus,
            }
          : project
      )
    );

    setEditingProjectId(null);
  }

  /* -----------------------------
     TASK FUNCTIONS
  ----------------------------- */

  function createTask() {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      project: newTaskProject,
      priority: newTaskPriority,
      completed: false,
    };

    setTasks((current) => [...current, task]);

    setNewTask("");
    setNewTaskProject("Orbit");
    setNewTaskPriority("Medium");
    setShowTaskForm(false);
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-950 p-6 md:block">

          <div className="mb-10">
            <h1 className="text-2xl font-bold">
              Orbit <span>🚀</span>
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              AI-powered workspace
            </p>
          </div>

          <nav className="space-y-2">
            {[
              "Dashboard",
              "Projects",
              "Tasks",
              "AI Assistant",
              "Analytics",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  active === item
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
            <p className="text-sm font-semibold">
              Built for Arc 🚀
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Orbit is being developed as an AI-powered workspace
              for the Arc ecosystem.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-5 md:p-8">

          {/* HEADER */}
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="text-sm text-purple-400">
                Welcome back
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Orbit Dashboard
              </h2>

              <p className="mt-2 text-slate-400">
                Manage your projects, tasks and productivity.
              </p>
            </div>

            <button
              onClick={() => setShowTaskForm(true)}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
            >
              + New Task
            </button> <button
  onClick={connectWallet}
  className="ml-3 rounded-xl border border-blue-500/40 bg-blue-600/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/20"
>
  {walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Connect Wallet"}
</button>

          </header>

          {/* STATS */}
          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Projects
              </p>

              <p className="mt-2 text-3xl font-bold">
                {projects.length}
              </p>

              <p className="mt-2 text-xs text-purple-400">
                Active workspace projects
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Tasks
              </p>

              <p className="mt-2 text-3xl font-bold">
                {tasks.length}
              </p>

              <p className="mt-2 text-xs text-blue-400">
                {completedTasks} completed
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Productivity
              </p>

              <p className="mt-2 text-3xl font-bold">
                {productivity}%
              </p>

              <p className="mt-2 text-xs text-green-400">
                Task completion rate
              </p>
            </div>

          </div>

          {/* PROJECTS + TASKS */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* PROJECTS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Projects
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Click a project to open its workspace
                  </p>
                </div>

                <button
                  onClick={() => setShowProjectForm(true)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                >
                  + Project
                </button>

              </div>

              <div className="space-y-4">

                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-purple-500/50"
                  >

                    <div className="flex items-start justify-between">

                      <button
                        onClick={() => openProject(project)}
                        className="min-w-0 text-left"
                      >

                        <h4 className="font-semibold hover:text-purple-300">
                          {project.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                          {project.description}
                        </p>

                      </button>

                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-xs text-slate-500 hover:text-red-400"
                      >
                        Delete
                      </button>

                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">

                      <span className="text-slate-400">
                        {project.status}
                      </span>

                      <span className="font-semibold">
                        {project.progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />

                    </div>

                    <button
                      onClick={() => openProject(project)}
                      className="mt-3 text-xs text-purple-400 hover:text-purple-300"
                    >
                      Open project →
                    </button>

                  </div>
                ))}

              </div>

            </div>

            {/* TASKS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5">

                <h3 className="text-xl font-semibold">
                  Recent Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Stay on top of your work
                </p>

              </div>

              <div className="space-y-3">

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        task.completed
                          ? "border-green-500 bg-green-500 text-black"
                          : "border-slate-600"
                      }`}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="min-w-0 flex-1">

                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {task.project} · {task.priority}
                      </p>

                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs text-slate-600 hover:text-red-400"
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* AI */}
          <div id="ai-assistant" className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/50 to-blue-950/50 p-6">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <p className="text-sm font-semibold text-purple-300">
                  Orbit AI Assistant
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Your intelligent productivity layer
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  AI-powered planning, task suggestions and project
                  insights are coming next.
                </p>

              </div>

              <button
               onClick={() => {
  setActive("AI Assistant");
  setShowAIAssistant(true);
}}
                className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold hover:bg-purple-500/10"
              >
                Explore AI →
              </button>

            </div>

          </div>

        </section>
      </div>

     {/* AI ASSISTANT MODAL */}
{showAIAssistant && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl">

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-300">
            Orbit AI Assistant
          </p>

          <h3 className="mt-1 text-2xl font-bold">
            Your intelligent productivity layer
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Ask Orbit about your projects, tasks, productivity, or Arc integration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAIAssistant(false)}
          className="text-xl text-slate-500 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Orbit</p>
        <p className="mt-2 text-sm leading-6 text-white">
          {aiResponse}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAIQuery();
          }}
          placeholder="Ask Orbit about your projects..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
        />

        <button
          type="button"
          onClick={handleAIQuery}
          className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-500"
        >
          Ask Orbit
        </button>
      </div>

    </div>
  </div>
)}  {/* CREATE PROJECT MODAL */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <h3 className="text-xl font-bold">
              Create Project
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add a new project to Orbit.
            </p>

            <input
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Project name"
              className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
            />

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Project description"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                onClick={() => setShowProjectForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
              >
                Create
              </button>

            </div>

          </div>

        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <h3 className="text-xl font-bold">
              Create Task
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add something you need to get done.
            </p>

            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task name"
              className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
            />

            <select
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={newTaskPriority}
              onChange={(e) =>
                setNewTaskPriority(
                  e.target.value as "High" | "Medium" | "Low"
                )
              }
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-purple-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <div className="mt-5 flex justify-end gap-3">

              <button
                onClick={() => setShowTaskForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={createTask}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
              >
                Create
              </button>

            </div>

          </div>

        </div>
      )}

      {/* PROJECT DETAILS MODAL */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-purple-400">
                  Project workspace
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  {selectedProject.name}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {selectedProject.description}
                </p>
              </div>

              <button
                onClick={() => setShowProjectDetails(false)}
                className="text-xl text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* PROJECT PROGRESS */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Project progress
                </span>

                <span className="font-bold">
                  {selectedProject.progress}%
                </span>

              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{
                    width: `${selectedProject.progress}%`,
                  }}
                />

              </div>

              <button
                onClick={() =>
                  setEditingProjectId(
                    editingProjectId === selectedProject.id
                      ? null
                      : selectedProject.id
                  )
                }
                className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
              >
                {editingProjectId === selectedProject.id
                  ? "Close Editor"
                  : "Edit Project"}
              </button>

              {editingProjectId === selectedProject.id && (
                <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">

                  <label className="text-xs text-slate-400">
                    Progress: {editProgress}%
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) =>
                      setEditProgress(Number(e.target.value))
                    }
                    className="mt-3 w-full"
                  />

                  <label className="mt-5 block text-xs text-slate-400">
                    Status
                  </label>

                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value as ProjectStatus
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={saveProjectChanges}
                    className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
                  >
                    Save Changes
                  </button>

                </div>
              )}

            </div>

            {/* PROJECT TASKS */}
            <div className="mt-6">

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="text-lg font-semibold">
                    Project Tasks
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedProjectTasks.filter(
                      (task) => task.completed
                    ).length}{" "}
                    completed of {selectedProjectTasks.length}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewTaskProject(selectedProject.name);
                    setShowProjectDetails(false);
                    setShowTaskForm(true);
                  }}
                  className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold hover:bg-purple-500"
                >
                  + Add Task
                </button>

              </div>

              <div className="mt-4 space-y-3">

                {selectedProjectTasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">

                    <p className="text-sm text-slate-400">
                      No tasks in this project yet.
                    </p>

                    <button
                      onClick={() => {
                        setNewTaskProject(selectedProject.name);
                        setShowProjectDetails(false);
                        setShowTaskForm(true);
                      }}
                      className="mt-3 text-xs text-purple-400 hover:text-purple-300"
                    >
                      Create the first task →
                    </button>

                  </div>
                ) : (
                  selectedProjectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >

                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          task.completed
                            ? "border-green-500 bg-green-500 text-black"
                            : "border-slate-600"
                        }`}
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="flex-1">

                        <p
                          className={`text-sm ${
                            task.completed
                              ? "text-slate-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {task.priority} priority
                        </p>

                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs text-slate-600 hover:text-red-400"
                      >
                        Delete
                      </button>

                    </div>
                  ))
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}
