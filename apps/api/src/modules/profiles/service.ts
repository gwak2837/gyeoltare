import { listPublicProfilesFromDatabase } from "./repository";
import { listProfilesResponseSchema } from "./schema";

type ListPublicProfilesOptions = {
  limit: number;
};

export async function listPublicProfiles({ limit }: ListPublicProfilesOptions) {
  const items = await listPublicProfilesFromDatabase({
    limit: Math.min(limit, 24),
  });

  return listProfilesResponseSchema.parse({ items });
}
