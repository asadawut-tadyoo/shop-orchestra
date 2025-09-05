import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import BarcodeForm from '@/components/form/BarcodeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, CheckCircle, AlertCircle } from 'lucide-react';

export default function RecievePage() {
  const [scannedItems, setScannedItems] = useState<Array<{ code: string; timestamp: Date; status: string }>>([]);
  const [currentBarcode, setCurrentBarcode] = useState('');
  const { toast } = useToast();

  const handleBarcodeSubmit = (barcode: string) => {
    // Validate barcode format
    if (!barcode.startsWith('RM-')) {
      toast({
        title: "Invalid Barcode",
        description: "Material barcode must start with 'RM-'",
        variant: "destructive"
      });
      setCurrentBarcode('');
      return;
    }

    // Add to scanned items
    const newItem = {
      code: barcode,
      timestamp: new Date(),
      status: 'Received'
    };
    
    setScannedItems([newItem, ...scannedItems]);
    setCurrentBarcode('');
    
    toast({
      title: "Material Received",
      description: `Successfully received material: ${barcode}`,
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Receive Materials</h1>
          <p className="text-muted-foreground mt-1">
            Scan incoming raw materials to register them in the system
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Material Scanner
              </CardTitle>
              <CardDescription>
                Scan material barcode to receive items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarcodeForm
                label="Scan Material Barcode"
                autoSubmit={true}
                onSubmit={handleBarcodeSubmit}
                valueCode={currentBarcode}
                onChangeCode={setCurrentBarcode}
                isEnable={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                Last {scannedItems.length} materials received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scannedItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No materials scanned yet
                  </p>
                ) : (
                  scannedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">{item.code}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}