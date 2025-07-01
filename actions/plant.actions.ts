"use server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

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