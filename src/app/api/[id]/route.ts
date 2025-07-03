let products: any[] = []; // Shared in-memory array (mock DB)

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id == params.id);
  if (!product) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });
  }
  return Response.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, description } = body;

  const index = products.findIndex((p) => p.id == params.id);
  if (index === -1) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });
  }

  products[index] = { ...products[index], name, description };
  return Response.json(products[index]);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const index = products.findIndex((p) => p.id == params.id);
  if (index === -1) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });
  }

  const deleted = products.splice(index, 1);
  return Response.json({ message: "Deleted", deleted });
}
