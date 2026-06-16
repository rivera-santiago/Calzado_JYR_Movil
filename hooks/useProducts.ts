import { fetchProductsAPI } from '@/services/api';
import { Product } from '@/services/publicCatalogService';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export function useProducts({ categoryIds, search, sort }: { categoryIds?: string[] | null; search?: string | null; sort?: string | null } = {}): UseQueryResult<Product[], Error> {
  const key = ['products', categoryIds ? categoryIds.join(',') : null, search, sort]
  return useQuery<Product[], Error>({
    queryKey: key,
    queryFn: async () => {
      // fetch all products then filter client-side for now; API accepts categoryId single param, so map client-side for multiple
      const products = await fetchProductsAPI(undefined)
      let results = products
      if (categoryIds && categoryIds.length > 0) {
        results = results.filter((p) => categoryIds.includes(p.category_id || ''))
      }
      if (search && search.length > 0) {
        const q = search.toLowerCase()
        results = results.filter((p: Product) => (p.name || '').toLowerCase().includes(q) || (p.color || '').toLowerCase().includes(q))
      }
      // basic sort placeholder
      if (sort === 'name') results = results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      return results
    },
  })
}
