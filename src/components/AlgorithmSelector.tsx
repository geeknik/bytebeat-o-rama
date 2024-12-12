import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { bytebeatAlgorithms } from '@/lib/bytebeatAlgorithms';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  showExperimental: boolean;
  onAlgorithmChange: (value: string) => void;
  onToggleExperimental: () => void;
}

const AlgorithmSelector = ({
  selectedAlgorithm,
  showExperimental,
  onAlgorithmChange,
  onToggleExperimental
}: AlgorithmSelectorProps) => {
  const regularAlgorithms = bytebeatAlgorithms.filter(algo => !algo.experimental);
  const experimentalAlgorithms = bytebeatAlgorithms.filter(algo => algo.experimental);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-mono">Algorithm</label>
        <Button
          variant="ghost"
          size="sm"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          onClick={onToggleExperimental}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showExperimental ? 'Hide Experimental' : 'Show Experimental'}
        </Button>
      </div>
      
      <RadioGroup
        value={selectedAlgorithm}
        onValueChange={onAlgorithmChange}
        className="grid gap-4"
      >
        {regularAlgorithms.map((algo) => (
          <div 
            key={algo.name} 
            className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
              selectedAlgorithm === algo.name 
                ? 'bg-cyan-500/20 border-cyan-500' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <RadioGroupItem value={algo.name} id={algo.name} className="text-cyan-500" />
            <div className="space-y-1">
              <label 
                htmlFor={algo.name} 
                className={`font-medium leading-none cursor-pointer ${
                  selectedAlgorithm === algo.name ? 'text-cyan-500' : ''
                }`}
              >
                {algo.name}
              </label>
              <p className="text-sm text-gray-400">
                {algo.description}
              </p>
            </div>
          </div>
        ))}

        {showExperimental && (
          <div className="mt-8 space-y-4">
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Experimental Algorithms</h3>
              <p className="text-sm text-gray-400 mb-4">
                Warning: These experimental algorithms explore theoretical concepts and may produce unexpected results. Use at your own risk.
              </p>
            </div>
            {experimentalAlgorithms.map((algo) => (
              <div 
                key={algo.name} 
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                  selectedAlgorithm === algo.name 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <RadioGroupItem value={algo.name} id={algo.name} className="text-purple-500" />
                <div className="space-y-1">
                  <label 
                    htmlFor={algo.name} 
                    className={`font-medium leading-none cursor-pointer ${
                      selectedAlgorithm === algo.name ? 'text-purple-500' : ''
                    }`}
                  >
                    {algo.name}
                  </label>
                  <p className="text-sm text-gray-400">
                    {algo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default AlgorithmSelector;