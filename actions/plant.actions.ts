"use server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.actions";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getPlants(searchTerm?: String) {
  try {
    const currentUserId = await getUserId();
    console.log("Current User ID:", currentUserId);
    const whereCaluse: any = {
      userId: currentUserId,
    };

    if (searchTerm) {
      whereCaluse.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    const userPlants = await prisma.plants.findMany({
      where: whereCaluse,
    });

    // revalidatePath("/plants")
    return {success: true, userPlants}

  } catch (error) {
    console.log("Error fetching plants:", error);
    throw new Error("Failed to fetch plants");
  }
}

export async function getPlantById(id:string) {
  return await prisma.plants.findUnique({
    where: {id},
  });
}

export async function createPlant(data: Prisma.PlantsCreateInput){
  console.log("creating plant")
  console.log(data)
  try {
    const currentUserId = await getUserId();
    if(!currentUserId) return
    const newPlant = await prisma.plants.create({
      data: {
        ...data,
        userId: currentUserId,
      }
    })
    revalidatePath("/plants");
    return newPlant
  } catch (error) {
    
  }
}

export async function editPlant(
  id: string,
  data: Prisma.PlantsUpdateInput
) {
  try {
    const currentUserId = await getUserId();
    const updatedPlant = await prisma.plants.update({
      where: {id},
      data: {
        ...data
,
userId: currentUserId,     }
    });
    revalidatePath("/plants");
  } catch (error) {
    console.error("Error updating plant:", error);
    throw new Error("Failed to update plant");
  }
}