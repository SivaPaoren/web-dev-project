"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset } = useForm();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    const p2 = p.map((prod) => ({
      ...prod,
      id: prod._id, // DataGrid requires `id`
    }));
    setProducts(p2);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  // CREATE or UPDATE
  const saveProduct = (data) => {
    if (editMode) {
      // Update product
      fetch(`${API_BASE}/product/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchProducts();
      });
      return;
    }

    // Create product
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  // DELETE
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/product/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // EDIT MODE
  const startEditMode = (product) => {
    reset(product); // prefill form
    setEditMode(true);
  };

  const stopEditMode = () => {
    reset({
      code: "",
      name: "",
      description: "",
      price: "",
      category: "",
    });
    setEditMode(false);
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  // DataGrid columns
  const columns = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        const cat = category.find((c) => c._id === params.value);
        return cat ? cat.name : "Unknown";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteProduct(params.row._id)}>🗑️</button>
          
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-6 m-4">
      {/* FORM */}
      <form onSubmit={handleSubmit(saveProduct)}>
        <div className="grid grid-cols-2 gap-4 border p-4 w-fit">
          <div>Code:</div>
          <div>
            <input
              {...register("code", { required: true })}
              className="border border-black w-full"
            />
          </div>

          <div>Name:</div>
          <div>
            <input
              {...register("name", { required: true })}
              className="border border-black w-full"
            />
          </div>

          <div>Description:</div>
          <div>
            <textarea
              {...register("description", { required: true })}
              className="border border-black w-full"
            />
          </div>

          <div>Price:</div>
          <div>
            <input
              type="number"
              {...register("price", { required: true })}
              className="border border-black w-full"
            />
          </div>

          <div>Category:</div>
          <div>
            <select
              {...register("category", { required: true })}
              className="border border-black w-full"
            >
              {category.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 text-right">
            {editMode ? (
              <>
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
                {" "}
                <button
                  type="button"
                  onClick={stopEditMode}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            )}
          </div>
        </div>
      </form>

      {/* DATAGRID */}
      <div className="h-[500px] w-full">
        <DataGrid rows={products} columns={columns} pageSize={5} />
      </div>
    </main>
  );
}
