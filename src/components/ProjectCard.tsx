import Link from 'next/link'
import Image from 'next/image'
import Badge from './Badge'
import { rp } from '@/lib/kpr'
import { hargaMulaiDari, type ProjectWithUnits } from '@/lib/data'

// Kartu proyek (DESIGN.md §6) — foto 4:3, nama, kota, harga mulai, badge.
export default function ProjectCard({ project }: { project: ProjectWithUnits }) {
  const harga = hargaMulaiDari(project)
  const thumb = project.thumbnailUrl ?? project.galeri[0]?.url
  const alt = project.galeri[0]?.alt ?? `Foto proyek ${project.nama}`

  return (
    <Link
      href={`/proyek/${project.slug}`}
      data-testid="project-card"
      className="group block overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-lift focus-within:shadow-lift"
    >
      <div className="relative aspect-[4/3] bg-parchment">
        {thumb ? (
          <Image
            src={thumb}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-ink2">Belum ada foto</span>
        )}
        <span className="absolute left-3 top-3">
          <Badge status={project.status} />
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold group-hover:text-clay">{project.nama}</h3>
        <p className="mt-1 text-ink2">
          {project.kota}
          {project.unitTypes.length > 0 && ` · ${project.unitTypes.length} tipe unit`}
        </p>
        <p className="mt-3 font-semibold text-clay">
          {harga ? `Mulai dari ${rp(harga)}` : 'Hubungi kami untuk harga'}
        </p>
      </div>
    </Link>
  )
}
