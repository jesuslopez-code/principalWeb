import type {NextConfig} from 'next';
import createMDX from '@next/mdx';

// Sin remotePatterns: todas las imágenes son locales (public/). Si se trae una externa,
// declarar aquí su host o next/image falla.
// pageExtensions incluye mdx aunque no haya páginas .mdx: Next solo aplica sus alias de React (el vendorizado)
// a los ficheros con esas extensiones; sin ellas el MDX importa el React 18 de node_modules y rompe el prerender.
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
