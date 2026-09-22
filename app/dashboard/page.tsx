"use client";

import { useState } from "react";

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  const menu = [
    "Dashboard",
    "Projects",
    "Tasks",
    "AI Assistant",
    "Analytics",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Orbit 🚀</h1>
          <p className="text-sm text-slate-400 mt-1">
            AI-powered workspace
          </p>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                active === item
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-10 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-400">Built for</p>
          <p className="font-semibold mt-1">Arc Ecosystem 🚀</p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-400 text-sm">Orbit Workspace</p>
            <h2 className="text-3xl font-bold mt-1">
              Good to see you 👋
            </h2>
          </div>

          <button className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700">
            Connect Wallet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Stat title="Projects" value="3" />
          <Stat title="Active Tasks" value="12" />
          <Stat title="Progress" value="68%" />
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold mb-5">
              My Projects
            </h3>

            <Project
              title="Orbit"
              description="AI-powered project workspace"
              progress="75%"
            />

            <Project
              title="Arc Integration"
              description="Onchain workspace integration"
              progress="35%"
            />

            <Project
              title="AI Assistant"
              description="Intelligent project assistant"
              progress="20%"
            />
          </div>

          {/* Tasks */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold mb-5">
              Recent Tasks
            </h3>

            <Task text="Design Orbit dashboard" done />
            <Task text="Build AI assistant" />
            <Task text="Integrate Arc wallet" />
            <Task text="Add project analytics" />
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mt-6 rounded-2xl border border-blue-900 bg-slate-900 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🤖</div>
            <div>
              <h3 className="text-xl font-semibold">
                Orbit AI Assistant
              </h3>
              <p className="text-sm text-slate-400">
                Your intelligent project companion
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
            <p className="text-slate-300">
              Ask Orbit AI about your projects, tasks, priorities,
              or productivity.
            </p>

            <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">
              Ask Orbit AI
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Project({
  title,
  description,
  progress,
}: {
  title: string;
  description: string;
  progress: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between mb-2">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>

        <span className="text-sm text-blue-400">{progress}</span>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: progress }}
        />
      </div>
    </div>
  );
}

function Task({
  text,
  done = false,
}: {
  text: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0">
      <div
        className={`w-5 h-5 rounded-full border ${
          done
            ? "bg-blue-600 border-blue-600"
            : "border-slate-600"
        }`}
      />

      <span
        className={
          done ? "text-slate-500 line-through" : "text-slate-200"
        }
      >
        {text}
      </span>
    </div>
  );
}
