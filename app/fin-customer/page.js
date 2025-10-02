"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

async function apiList() {
  const res = await fetch("/api/customers", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}
async function apiCreate(payload) {
  const res = await fetch("/api/customers", { method: "POST", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}
async function apiUpdate(id, payload) {
  const res = await fetch(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
async function apiDelete(id) {
  const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}

export default function FinCustomerPage() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const { register: regEdit, handleSubmit: submitEdit, reset: resetEdit } = useForm();

  const reload = async () => {
    setLoading(true);
    try {
      const data = await apiList();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const onCreate = handleSubmit(async (data) => {
    await apiCreate({
      name: data.name.trim(),
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      memberNumber: Number(data.memberNumber),
      interests: data.interests.trim(),
    });
    reset();
    reload();
  });

  const startEdit = (it) => {
    setEditingId(it._id);
    resetEdit({
      name: it.name,
      dateOfBirth: it.dateOfBirth?.slice(0, 10),
      memberNumber: it.memberNumber,
      interests: it.interests,
    });
  };

  const onEdit = submitEdit(async (data) => {
    await apiUpdate(editingId, {
      name: data.name.trim(),
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      memberNumber: Number(data.memberNumber),
      interests: data.interests.trim(),
    });
    setEditingId(null);
    reload();
  });

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link href="/" className="text-sm underline">Home</Link>
      </header>

      {/* Create */}
      <section className="rounded-2xl border p-4">
        <h2 className="text-lg font-medium mb-3">Add Customer</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input" placeholder="Name" {...register("name", { required: true })} />
          <input className="input" type="date" {...register("dateOfBirth", { required: true })} />
          <input className="input" type="number" min={1} placeholder="Member No." {...register("memberNumber", { required: true, valueAsNumber: true })} />
          <input className="input md:col-span-3" placeholder="Interests (comma separated)" {...register("interests", { required: true })} />
          <button className="btn md:col-span-1">Create</button>
        </form>
      </section>

      {/* List */}
      <section className="rounded-2xl border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">All Customers</h2>
          <button className="btn-outline" onClick={reload} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">DOB</th>
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Interests</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    {editingId === it._id ? (
                      <input className="input" {...regEdit("name", { required: true })} />
                    ) : it.name}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === it._id ? (
                      <input className="input" type="date" {...regEdit("dateOfBirth", { required: true })} />
                    ) : (it.dateOfBirth ? new Date(it.dateOfBirth).toLocaleDateString() : "-")}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === it._id ? (
                      <input className="input" type="number" min={1} {...regEdit("memberNumber", { required: true, valueAsNumber: true })} />
                    ) : it.memberNumber}
                  </td>
                  <td className="py-2 pr-4">
                    {editingId === it._id ? (
                      <input className="input" {...regEdit("interests", { required: true })} />
                    ) : it.interests}
                  </td>
                  <td className="py-2 pr-4 flex gap-2">
                      {editingId === it._id ? (
                        <>
                          <button className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm" onClick={onEdit}>💾 Save</button>
                          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm" onClick={() => setEditingId(null)}>✖ Cancel</button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/fin-customer/${it._id}`}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                          >
                            👁 View
                          </Link>
                          <button
                            className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                            onClick={() => startEdit(it)}
                          >
                            ✎ Edit
                          </button>
                          <button
                            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                            onClick={async () => {
                              if (confirm("Delete this customer?")) {
                                await apiDelete(it._id);
                                reload();
                              }
                            }}
                          >
                            🗑 Delete
                          </button>
                        </>
                      )}
                    </td>

                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr><td className="py-4 text-neutral-500" colSpan={5}>No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tiny Tailwind-ish utility styles */}
            <style jsx>{`
        .input {
          @apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500;
        }
        .btn {
          @apply inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 active:scale-95 transition;
        }
        .btn-outline {
          @apply inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition;
        }
        .btn-ghost {
          @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-50 active:scale-95 transition;
        }
        .btn-danger {
          @apply inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 active:scale-95 transition;
        }
      `}</style>

    </main>
  );
}
