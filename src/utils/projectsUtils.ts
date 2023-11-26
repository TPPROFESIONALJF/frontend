
export function getIndustrieById(id: string) {
  return industries.find((industrie) => industrie.id === id);
}

const industries = [
  {
    id: '0', name: 'Software',
  },
  {
    id: '1', name: 'Education',
  },
  {
    id: '2', name: 'Entertainment',
  },
  {
    id: '3', name: 'Engineering & Construction',
  },
  {
    id: '4', name: 'Healthcare Products',
  },
  {
    id: '5', name: 'Biotechnology',
  },
  {
    id: '6', name: 'Electronics',
  },
  {
    id: '7', name: 'Business & Consumer Services',
  },
  {
    id: '8', name: 'Machinery',
  }
];

export default industries;