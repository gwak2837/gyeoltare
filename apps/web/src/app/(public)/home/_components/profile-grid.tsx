import type { PublicProfile } from "@repo/contracts";

type ProfileGridProps = {
  profiles: PublicProfile[];
};

export function ProfileGrid({ profiles }: ProfileGridProps) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((profile) => (
        <article
          className="rounded-[1.8rem] border border-page-border bg-white/70 p-6 shadow-[0_18px_45px_rgba(21,33,29,0.08)]"
          key={profile.id}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-semibold">{profile.displayName}</p>
            <span className="rounded-full bg-page-accent/10 px-3 py-1 text-xs font-medium text-page-accent">
              /{profile.slug}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-page-ink/75">
            {profile.bio ?? "아직 소개 문구가 등록되지 않았습니다."}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-page-ink/45">
            Created {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </article>
      ))}
    </div>
  );
}
