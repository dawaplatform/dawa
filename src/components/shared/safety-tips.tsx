import { Shield, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SafetyTips() {
  return (
    <Card className="bg-[#EFF6FF] border-0 h-[200px] rounded-xl">
      <div className="p-6 flex flex-col h-full">
        <div className="flex text-xl  items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-blue-600">Safety Tips</h3>
        </div>
        <div className="space-y-3">
          {[
            'Meet in a safe, public location',
            'Check the item before payment',
            'Never send money in advance',
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-xs text-blue-600">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
