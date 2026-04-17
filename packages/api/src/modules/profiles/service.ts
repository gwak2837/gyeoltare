import { listProfilesResponseSchema } from "@repo/contracts";

import { listPublicProfilesFromDatabase } from "./repository";

type ListPublicProfilesOptions = {
  limit: number;
};

export async function listPublicProfiles({ limit }: ListPublicProfilesOptions) {
  const items = await listPublicProfilesFromDatabase({
    limit: Math.min(limit, 24),
  });

  return listProfilesResponseSchema.parse({ items });
}
