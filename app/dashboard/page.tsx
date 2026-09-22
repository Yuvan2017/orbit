"use client";

import { useMemo, useState } from "react";

type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: "Active" | "Planning" | "Completed";
};

type Task = {
  id: number;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
};

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  const [projects, setProjects] = useState<Project[]>([
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
  ]);

  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [newProject, setNewProject] = useState("");
  const [newTask, setNewTask] = useState("");

  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks, completedTasks]);

  function addProject() {
    if (!newProject.trim()) return;

    setProjects([
      ...projects,
      {
        id: Date.now(),
        name: newProject,
        description: "New Orbit project",
        progress: 0,
        status: "Planning",
      },
    ]);

    setNewProject("");
    setShowProjectForm(false);
  }

  function addTask() {
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        project: "Orbit",
        priority: "Medium",
        completed: false,
      },
    ]);

    setNewTask("");
    setShowTaskForm(false);
  }

  function toggleTask(id: number) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteProject(id: number) {
    setProjects(projects.filter((project) => project.id !== id));
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-950 p-6 md:block">
          <div className="mb-10">
            <h1 className="text-2xl font-bold">
              Orbit <span className="text-purple-400">🚀</span>
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
              Orbit is being developed as an AI-powered workspace for the
              Arc ecosystem.
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-5 md:p-8">

          {/* HEADER */}
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-purple-400">Welcome back</p>
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
            </button>
          </header>

          {/* STATS */}
          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Projects</p>
              <p className="mt-2 text-3xl font-bold">
                {projects.length}
              </p>
              <p className="mt-2 text-xs text-purple-400">
                Active workspace projects
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Tasks</p>
              <p className="mt-2 text-3xl font-bold">
                {tasks.length}
              </p>
              <p className="mt-2 text-xs text-blue-400">
                {completedTasks} completed
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Productivity</p>
              <p className="mt-2 text-3xl font-bold">
                {progress}%
              </p>
              <p className="mt-2 text-xs text-green-400">
                Task completion rate
              </p>
            </div>

          </div>

          {/* CONTENT */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* PROJECTS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Projects
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Track your active work
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
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <div className="flex items-start justify-between">

                      <div>
                        <h4 className="font-semibold">
                          {project.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                          {project.description}
                        </p>
                      </div>

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
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

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

          {/* AI ASSISTANT */}
          <div className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/50 to-blue-950/50 p-6">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-sm font-semibold text-purple-300">
                  Orbit AI Assistant
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Your intelligent productivity layer
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  AI-powered planning, task suggestions and project insights
                  are coming next.
                </p>
              </div>

              <button
                onClick={() => setActive("AI Assistant")}
                className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold hover:bg-purple-500/10"
              >
                Explore AI →
              </button>

            </div>

          </div>

        </section>
      </div>

      {/* NEW PROJECT MODAL */}
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

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowProjectForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={addProject}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW TASK MODAL */}
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

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowTaskForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={addTask}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
