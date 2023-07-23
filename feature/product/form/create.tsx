"use client";
import { useMemo, useState } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

export function CreateForm() {
  let [name, setProduct] = useState("");
  let [price, setPrice] = useState(100);
  let [description, setDescription] = useState("");

  const isDisabled = useMemo(
    () => name === "" || price < 0 || description === "",
    [name, price, description],
  );
  async function handleSubmit(e: any) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label>Product</label>
        <Input
          onChange={(e) => setProduct(e.target.value)}
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
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name="description"
        />
      </div>
      <Button
        variant="accent"
        disabled={isDisabled}
        // isLoading={mutation.isLoading}
        className="w-full"
        type="submit"
      >
        Enregistrer
      </Button>
    </form>
  );
}
