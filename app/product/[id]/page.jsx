import ProductDetail from '../../../components/ProductDetail'

export function generateMetadata({ params }) {
  return {
    title: 'Samsung Inverter 208L Refrigerator – CoolHome',
    description: 'Buy the Samsung Digital Inverter 208L fridge. Energy-saving, silent, No Frost technology. Free delivery & 2-year warranty.',
  }
}

export default function ProductPage({ params }) {
  return <ProductDetail id={params.id} />
}
