"use client";
import { ProductResponse } from "@/dto/ProductResponseSchema";
import { Button } from "@/ui/button";
import { mutationOptions } from "@/ui/query";
import { infoToast } from "@/ui/toast/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function DeleteForm({ product }: { product: ProductResponse }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    mutationOptions(
      "DELETE",
      "/api/product?id=" + product.id,
      ["product", product.id],
      queryClient,
      ["product"],
    ),
  );

  async function handleSubmit(e: any) {
    e.preventDefault();
    mutation.mutate(product.id, {
      onSuccess() {
        infoToast("Produit supprimé avec succès");
      },
    });
  }
  return (
    <div className="flex justify-center items-center">
      <form className="w-full max-w-md rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label> Etes vous sur de vouloir supprimer</label>
          <span className="text-3xl text-primary text-center w-full">
            {product.name}
          </span>
        </div>
        <Button
          variant="accent"
          className="w-full"
          isLoading={mutation.isLoading}
          type="submit"
        >
          Supprimer
        </Button>
      </form>
    </div>
  );
}
