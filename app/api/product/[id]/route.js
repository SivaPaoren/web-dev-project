import Product from "@/models/Product";

export async function GET(request, { params }) {
  console.log(params)
  const id = params.id;
  const product = await Product.findById(id).populate("category");
  console.log({ product });
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}

export async function PUT(request, { params }) {
  const id = params.id;
  const body = await request.json();

  const updated = await Product.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(updated);
}