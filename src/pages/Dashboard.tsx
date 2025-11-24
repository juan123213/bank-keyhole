import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { QueryForm } from '@/components/QueryForm';
import { ResultsTable } from '@/components/ResultsTable';
import { productsService } from '@/services/products.service';
import { toast } from '@/hooks/use-toast';
import type { FinancialProduct } from '@/types';

const Dashboard = () => {
  const [products, setProducts] = useState<FinancialProduct[]>([]);

  const queryMutation = useMutation({
    mutationFn: productsService.getProducts,
    onSuccess: (data) => {
      setProducts(data.content);
      toast({
        title: 'Consulta exitosa',
        description: `Se encontraron ${data.content.length} productos`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error en la consulta',
        description: error.response?.data?.message || 'Error al consultar productos',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <QueryForm
              onSubmit={(data) => queryMutation.mutate(data)}
              isLoading={queryMutation.isPending}
            />
          </div>
          <div className="lg:col-span-2">
            {products.length > 0 && <ResultsTable products={products} />}
            {products.length === 0 && !queryMutation.isPending && (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Sin resultados
                  </h3>
                  <p className="text-muted-foreground">
                    Complete el formulario para realizar una consulta
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
