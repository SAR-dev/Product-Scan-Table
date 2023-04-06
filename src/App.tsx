import PackingTable from './PackingTable';

interface DataType {
  barcode: string;
  code: string;
  name: string;
  amount: number;
  picked: number;
  packed: number;
}

const data: DataType[] = [
  {
    barcode: '36961338',
    name: 'Antennaria parvifolia Nutt.',
    amount: 7,
    picked: 7,
    packed: 7,
    code: '38909972',
  },
  {
    barcode: '90041381',
    name: 'Dalechampia L.',
    amount: 6,
    picked: 10,
    packed: 2,
    code: '72908576',
  },
  {
    barcode: '72395575',
    name: 'Pteris cretica L. var. cretica',
    amount: 5,
    picked: 5,
    packed: 10,
    code: '2839492',
  },
  {
    barcode: '27365688',
    name: 'Leptospermum morrisonii J. Thomp.',
    amount: 6,
    picked: 5,
    packed: 2,
    code: '20736411',
  },
  {
    barcode: '82013467',
    name: 'Beta trigyna Waldst. & Kit.',
    amount: 5,
    picked: 8,
    packed: 9,
    code: '80171552',
  },
  {
    barcode: '40879225',
    name: 'Astragalus pachypus Greene var. jaegeri Munz & McBurney',
    amount: 4,
    picked: 8,
    packed: 4,
    code: '70695058',
  },
  {
    barcode: '80678432',
    name: 'Echinocereus boyce-thompsonii Orcutt',
    amount: 5,
    picked: 5,
    packed: 1,
    code: '41540111',
  },
  {
    barcode: '27365688',
    name: 'Salvia lycioides A. Gray',
    amount: 8,
    picked: 4,
    packed: 3,
    code: '99607481',
  },
  {
    barcode: '41810280',
    name: 'Eleocharis kamtschatica (C.A. Mey.) Kom.',
    amount: 3,
    picked: 8,
    packed: 6,
    code: '52029050',
  },
];

const key = 'cache';

export default function App() {
  return (
    <div className="p-3">
      <PackingTable initialData={data} cacheKey={key} />
    </div>
  );
}
