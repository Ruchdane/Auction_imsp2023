"use client";
import { ProductResponse } from "@/dto/ProductResponseSchema";
import { ProductUpdateDto } from "@/src/products/productUpdate.dto";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { mutationOptions } from "@/ui/query";
import { infoToast } from "@/ui/toast/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function EditForm({ product }: { product: ProductResponse }) {
  let [name, setName] = useState(product.name);
  let [price, setPrice] = useState(product.price);
  let [description, setDescription] = useState(product?.description);

  const isModified = useMemo(
    () =>
      name !== product.name ||
      price !== product.price ||
      description !== product.description,
    [name, price, description, product],
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(
    mutationOptions<ProductUpdateDto, ProductResponse>(
      "PUT",
      "/api/product",
      ["product", product.id],
      queryClient,
      ["product"],
    ),
  );

  async function handleSubmit(e: any) {
    e.preventDefault();
    const updatedProduct = {
      id: product.id,
      name: name !== product.name ? name : undefined,
      price: price !== product.price ? price : undefined,
      description:
        description !== product.description ? description : undefined,
    };
    mutation.mutate(updatedProduct, {
      onSuccess() {
        infoToast("Produit mis à jour avec succès");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product</label>
        <Input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          name="name"
        />
      </div>
      <div>
        <label>Price</label>
        <Input
          onChange={(e) => setPrice(Number(e.target.value))}
          min="0"
          type="number"
          value={price}
          name="price"
        />
      </div>
      <div>
        <label> Description </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name="description"
        />
      </div>
      <Button
        variant="accent"
        className="w-full"
        type="submit"
        disabled={!isModified}
        isLoading={mutation.isLoading}
      >
        Enregistrer
      </Button>
    </form>
  );
}
