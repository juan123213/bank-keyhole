import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QueryFormProps {
  onSubmit: (data: { originAccount: string; valueTransfer: string }) => void;
  isLoading: boolean;
}

export const QueryForm = ({ onSubmit, isLoading }: QueryFormProps) => {
  const [originAccount, setOriginAccount] = useState('');
  const [valueTransfer, setValueTransfer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originAccount || !valueTransfer) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({ originAccount, valueTransfer });
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>Consulta de Productos</CardTitle>
        <CardDescription>
          Ingrese los datos para consultar productos financieros
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originAccount">Cuenta de Origen</Label>
            <Input
              id="originAccount"
              type="text"
              placeholder="Ej: 2157656"
              value={originAccount}
              onChange={(e) => setOriginAccount(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueTransfer">Valor de Transferencia</Label>
            <Input
              id="valueTransfer"
              type="number"
              placeholder="Ej: 10000"
              value={valueTransfer}
              onChange={(e) => setValueTransfer(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Consultar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
