import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { BytebeatProcessor, bytebeatAlgorithms } from '@/lib/bytebeat';
import { Play, Pause } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1);
  const [sampleRate, setSampleRate] = useState(8000);
  const [visualData, setVisualData] = useState(0);
  const [processor, setProcessor] = useState<BytebeatProcessor | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(bytebeatAlgorithms[0].name);

  useEffect(() => {
    const newProcessor = new BytebeatProcessor((data) => {
      setVisualData(data);
      setCurrentTime(newProcessor.getCurrentTime());
    }, selectedAlgorithm);
    setProcessor(newProcessor);

    return () => {
      if (processor) {
        processor.stop();
      }
    };
  }, []);

  const togglePlayback = useCallback(() => {
    if (!processor) return;

    if (isPlaying) {
      processor.stop();
    } else {
      processor.start();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, processor]);

  const handleSampleRateChange = useCallback((value: number[]) => {
    if (!processor) return;
    const newRate = value[0];
    setSampleRate(newRate);
    processor.setSampleRate(newRate);
  }, [processor]);

  const handleAlgorithmChange = useCallback((value: string) => {
    if (!processor) return;
    setSelectedAlgorithm(value);
    processor.setAlgorithm(value);
  }, [processor]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 font-mono">
          Bytebeat Generator
        </h1>

        <div className="space-y-6">
          <WaveformVisualizer data={visualData} />

          <div className="flex items-center justify-between">
            <Button
              onClick={togglePlayback}
              className="bg-cyan-500 hover:bg-cyan-600 text-black"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="ml-2">{isPlaying ? 'Stop' : 'Play'}</span>
            </Button>

            <div className="font-mono">
              t = 0x{currentTime.toString(16).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono">Algorithm</label>
              <Select value={selectedAlgorithm} onValueChange={handleAlgorithmChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>{selectedAlgorithm}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bytebeatAlgorithms.map((algo) => (
                    <SelectItem key={algo.name} value={algo.name}>
                      <div className="space-y-1">
                        <div>{algo.name}</div>
                        <div className="text-xs text-gray-400">{algo.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono">Sample Rate: {sampleRate} Hz</label>
              <Slider
                value={[sampleRate]}
                onValueChange={handleSampleRateChange}
                min={4000}
                max={44100}
                step={100}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;