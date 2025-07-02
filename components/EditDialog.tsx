import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Combobox } from "./ui/combo-box";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { createPlant, editPlant, getPlantById } from "@/actions/plant.actions";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

type Plant = NonNullable<Awaited<ReturnType<typeof getPlantById>>>

interface EditPlantProps {
  plant: Plant
}

export default function EditDialog({ plant }: EditPlantProps) {

  const [formData, setFormData] = useState({
    name: plant?.name.trim(),
    description: (plant?.description || "").trim(),
    category: plant.category.trim(),
    stock: plant.stock,
    price: plant.price,
    userId: plant.userId.trim(),
    imageUrl: plant.imageUrl || "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  }

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const newPlant = await editPlant(plant.id, formData);
      console.log("plant edited:", newPlant);
      toast.success("Plant edited successfully!");
    } catch (error) {
      console.error("Error editing plant:", error);
      toast.error("Failed to edit plant. Please try again.");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"default"}
          className="ml-auto flex items-center gap-2"
        >
          <span className="hidden lg:inline">Edit Plant</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription >
            Fill out the form below to add a new plant to yout inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSumbit}>
          <div className="grid grid-cols-2 gap-4">
            <div>


              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter plant name"
                value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Combobox
                value={formData.category}
                onChange={(val) => handleChange("category", val)}
              />
            </div>
          </div>
          <Label htmlFor="description" className="mt-4">Description</Label>
          <Textarea
            id="description"
            placeholder="Type your description here"
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
          <div className="py-5">
            <ImageUpload
              endpoint="postImage"
              value={formData.imageUrl}
              onChange={(url) => handleChange("imageUrl", url)}
            />
          </div>


          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Submit</AlertDialogAction>
          </AlertDialogFooter>


        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
