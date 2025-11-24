import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import type { FinancialProduct } from '@/types';

interface ResultsTableProps {
  products: FinancialProduct[];
}

export const ResultsTable = ({ products }: ResultsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.nroProducto.toLowerCase().includes(term) ||
        product.nombreAsociado.toLowerCase().includes(term) ||
        product.convenio.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>Resultados de Búsqueda</CardTitle>
        <CardDescription>
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </CardDescription>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por producto, titular o convenio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Convenio</TableHead>
                <TableHead>Titular</TableHead>
                <TableHead>Fecha Apertura</TableHead>
                <TableHead className="text-right">Valor Cuota</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.nroProducto}>
                    <TableCell className="font-medium">{product.nroProducto}</TableCell>
                    <TableCell>{product.convenio}</TableCell>
                    <TableCell>{product.nombreAsociado}</TableCell>
                    <TableCell>{formatDate(product.fechaApertura)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(product.valorCuota)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.estado === 'ACTIVO' ? 'default' : 'secondary'}
                        className={
                          product.estado === 'ACTIVO'
                            ? 'bg-success hover:bg-success/90'
                            : ''
                        }
                      >
                        {product.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
