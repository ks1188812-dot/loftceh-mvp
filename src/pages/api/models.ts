// src/pages/api/models.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Category = 'BEDS' | 'DESKS' | 'SHELVES' | 'WARDROBES'

export type ProductModel = {
  id: string
  name: string
  slug: string
  description?: string
  basePrice?: number
  imageUrl?: string
  category: Category
  finishes: string[]
}

const models: ProductModel[] = [
  // Кровати (3)
  { id: 'bed-a', name: 'Кровать Loft A', slug: 'bed-loft-a', description: 'Металл + ЛДСП', basePrice: 29000, imageUrl: '/catalog/beds/loft-a.webp', category: 'BEDS', finishes: ['дуб','орех','черный'] },
  { id: 'bed-b', name: 'Кровать Loft B', slug: 'bed-loft-b', description: 'С ящиками', basePrice: 34000, imageUrl: '/catalog/beds/loft-b.webp', category: 'BEDS', finishes: ['дуб','белый'] },
  { id: 'bed-c', name: 'Кровать Loft C', slug: 'bed-loft-c', description: 'С мягким изголовьем', basePrice: 38000, imageUrl: '/catalog/beds/loft-c.webp', category: 'BEDS', finishes: ['ткань графит','ткань беж'] },

  // Стеллажи (3)
  { id: 'grid', name: 'Стеллаж Grid', slug: 'shelf-grid', description: 'Металлокаркас 30×30', basePrice: 14500, imageUrl: '/catalog/shelves/grid.webp', category: 'SHELVES', finishes: ['черный','белый'] },
  { id: 'cube', name: 'Стеллаж Cube', slug: 'shelf-cube', description: 'Кубы из ЛДСП', basePrice: 16500, imageUrl: '/catalog/shelves/cube.webp', category: 'SHELVES', finishes: ['дуб','орех'] },
  { id: 'ladder', name: 'Стеллаж Ladder', slug: 'shelf-ladder', description: 'Лестница на стену', basePrice: 15500, imageUrl: '/catalog/shelves/ladder.webp', category: 'SHELVES', finishes: ['черный','дуб'] },

  // Столы (3)
  { id: 'desk-a', name: 'Стол Work A', slug: 'desk-work-a', description: 'П-образный каркас', basePrice: 19000, imageUrl: '/catalog/desks/work-a.webp', category: 'DESKS', finishes: ['120×60','140×70'] },
  { id: 'desk-b', name: 'Стол Work B', slug: 'desk-work-b', description: 'Регулируемые опоры', basePrice: 21000, imageUrl: '/catalog/desks/work-b.webp', category: 'DESKS', finishes: ['120×60','160×80'] },
  { id: 'desk-c', name: 'Стол Work C', slug: 'desk-work-c', description: 'С тумбой', basePrice: 24500, imageUrl: '/catalog/desks/work-c.webp', category: 'DESKS', finishes: ['левый','правый'] },
]

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(models)
}
