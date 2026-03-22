import type { Creator } from '@/types'

// ─── Name / bio pools ───────────────────────────────────────────────────────
const FIRST = [
  'Elena','Kai','Sam','Priya','Marcus','Aiko','Lena','Theo','Nadia','Finn',
  'Zoe','Omar','Isla','Ravi','Mara','Jude','Yuki','Cleo','Axel','Sana',
  'Hana','Emil','Rosa','Dara','Bram','Lila','Kosta','Noa','Felix','Amara',
  'Petra','Nico','Tara','Sven','Lyra','Hugo','Mila','Ezra','Ines','Tobias',
  'Aria','Dante','Vera','Cian','Mira','Lars','Sasha','Kael','Noor','Orion',
  'Leila','Baxter','Cora','Yann','Fiona','Idris','Wren','Matteo','Sofi','Drew',
  'Zara','Luca','Neve','Ren','Ada','Kofi','Pia','Jax','Luz','Amir',
  'Bea','Soren','Teo','Rue','Cass','Nils','Lara','Kes','Dex','Maren',
  'Suki','Thea','Roan','Ivy','Eli','Celine','Pax','Tamsin','Arlo','Gael',
  'Nyx','Petra','Sibyl','Reef','Elan','Ziv','Maru','Caden','Soleil','Lex',
]
const LAST = [
  'Vasquez','Nakamura','Torres','Mehta','Osei','Lindqvist','Fischer','Adeyemi','Koval','Park',
  'Rossi','Ibrahim','Chen','Nguyen','Olsen','Markov','Santos','Dupont','Ferreira','Balogun',
  'Johansson','Reyes','Patel','Müller','Diallo','Watanabe','Kovacs','Nwosu','Larsson','Delacroix',
  'Okwu','Svensson','Almeida','Bergmann','Tanaka','Moreira','Stein','Owusu','Marchand','Kim',
  'Andersen','Yilmaz','Dlamini','Pereira','Novak','Hoffmann','Rashid','Leclerc','Mensah','Walsh',
  'Hargreaves','Yamamoto','Strauss','Abara','Costa','Eriksson','Molina','Okafor','Brunner','Chow',
  'Lecomte','Adesanya','Ritter','Obi','Sørensen','Hakobyan','Bonnet','Afolabi','Nilsson','Carvalho',
  'Ndiaye','Petrov','Asante','Weber','Mwangi','Brandt','Varela','Sato','Lorentz','Tremblay',
  'Achebe','Grøn','Fonseca','Steiner','Diarra','Magnusson','Opoku','Lehmann','Gomes','Ito',
  'Christodoulou','Barroso','Amara','Winther','Ferreira','Navarrete','Buhari','Hofer','Asamoah','Voss',
]
const DISCIPLINES = [
  'Brand designer & illustrator',
  'Senior frontend engineer',
  'Product designer — developer tools',
  'Full-stack developer & open-source creator',
  'UX researcher and product strategist',
  'Motion designer & creative director',
  'iOS and Android developer',
  'Illustrator and visual storyteller',
  'Freelance copywriter & content strategist',
  'Web developer — Jamstack & Next.js',
  'Graphic designer — print & digital',
  'UI designer with a love for type',
  'Backend engineer & API architect',
  '3D artist and generative designer',
  'Technical writer & developer advocate',
  'Design systems engineer',
  'Video editor & creative producer',
  'Data visualisation designer',
  'Open-source maintainer & educator',
  'Photographer & visual brand consultant',
]
const COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
]

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length] }

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString()
}

export const mockCreators: Creator[] = Array.from({ length: 100 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[i % LAST.length]
  const displayName = `${first} ${last}`
  const username = `${slugify(first)}-${slugify(last)}${i > 49 ? i : ''}`
  return {
    id: `c${i + 1}`,
    user_id: `u${i + 1}`,
    username,
    display_name: displayName,
    bio: pick(DISCIPLINES, i),
    avatar_url: null,
    website: i % 3 === 0 ? `https://${slugify(first)}${slugify(last)}.com` : null,
    twitter: i % 4 === 0 ? `@${slugify(first)}${i}` : null,
    total_products: (i % 12) + 1,
    total_sales: (i * 7 + 13) % 200,
    created_at: daysAgo(300 - i * 3),
  }
})
