"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";

class UserNofFounErr extends Error {}

export const GetFormStats = async () => {
  const user = await currentUser();
  if (!user) {
    throw new UserNofFounErr();
  }

  const stats = prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = (await stats)._sum.visits || 0;
  const submissions = (await stats)._sum.submissions || 0;
  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
};

export async function CreatForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Not a Valid Input");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNofFounErr();
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("Something Went Wrong");
  }

  return form.id;
}

export const GetForms = async() =>{
    const user = await currentUser();
    if (!user) {
      throw new UserNofFounErr();
    }

    return await prisma.form.findMany({
        where:{
            userId:user.id,
        },
        orderBy:{
            createAt:"desc"
        }
    })
}