"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

async function fetchOne(id) {
  const res = await fetch(`/api/customers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
async function updateOne(id, payload) {
  const res = await fetch(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}
async function deleteOne(id) {
  const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

export default function CustomerDetail({ params }) {
  const { id } = params;
  const [doc, setDoc] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchOne(id);
      setDoc(d);
      reset({
        name: d.name,
        dateOfBirth: d.dateOfBirth?.slice(0, 10),
        memberNumber: d.memberNumber,
        interests: d.interests,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    await updateOne(id, {
      name: data.name.trim(),
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      memberNumber: Number(data.memberNumber),
      interests: data.interests.trim(),
    });
    await load();
    alert("Saved!");
  });

  if (loading) return <main className="p-6">Loading…</main>;
  if (!doc) return <main className="p-6">Not found</main>;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customer Detail</h1>
        <Link href="/final" className="underline">Back</Link>
      </div>

      <section className="rounded-2xl border p-4 space-y-2">
        <div><span className="font-medium">ID:</span> {doc._id}</div>
        <div><span className="font-medium">Created:</span> {new Date(doc.createdAt).toLocaleString()}</div>
        <div><span className="font-medium">Updated:</span> {new Date(doc.updatedAt).toLocaleString()}</div>
      </section>

      <section className="rounded-2xl border p-4">
        <h2 className="text-lg font-medium mb-3">Edit</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Name</span>
            <input className="input" {...register("name", { required: true })} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Date of Birth</span>
            <input className="input" type="date" {...register("dateOfBirth", { required: true })} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Member Number</span>
            <input className="input" type="number" min={1} {...register("memberNumber", { required: true, valueAsNumber: true })} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Interests</span>
            <input className="input" {...register("interests", { required: true })} />
          </label>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 active:scale-95 transition text-sm">
              💾 Save
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 active:scale-95 transition text-sm"
              onClick={async () => {
                if (confirm("Delete this customer?")) {
                  await deleteOne(id);
                  window.location.href = "/final";
                }
              }}
            >
              🗑 Delete
            </button>
          </div>
        </form>
      </section>

      <style jsx>{`
        .input { @apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500; }
      `}</style>
    </main>
  );
}
