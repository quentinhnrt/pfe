"use server";

import prisma from "@/shared/lib/prisma";

export async function update(formData: FormData) {
  const userData = Object.fromEntries(formData);

  const firstKey = Object.keys(userData)[0];

  delete userData[firstKey];

  userData.name =
    userData.firstname?.toString().toLowerCase() +
    "-" +
    userData.lastname?.toString().toLowerCase();

  console.log(userData);

  const user = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: userData,
  });
}
