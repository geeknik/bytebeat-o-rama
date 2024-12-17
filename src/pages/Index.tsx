import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import WaveformVisualizer from '@/components/WaveformVisualizer';
import BytebeatFAQ from '@/components/BytebeatFAQ';
import { BytebeatProcessor, bytebeatAlgorithms } from '@/lib/bytebeat';
import { Play, Pause, Sparkles } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1);
  const [sampleRate, setSampleRate] = useState(8000);
  const [visualData, setVisualData] = useState(0);
  const [processor, setProcessor] = useState<BytebeatProcessor | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(bytebeatAlgorithms[0].name);
  const [showExperimental, setShowExperimental] = useState(false);

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

  const regularAlgorithms = bytebeatAlgorithms.filter(algo => !algo.experimental);
  const experimentalAlgorithms = bytebeatAlgorithms.filter(algo => algo.experimental);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8 flex flex-col">
      <div className="max-w-4xl mx-auto space-y-8 flex-grow">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-mono">
            Bytebeats Generator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create music through pure mathematics! Bytebeats are algorithmic compositions that generate audio using simple mathematical formulas. Choose an algorithm, adjust the sample rate, and explore the fascinating world of mathematical music.
          </p>
        </div>

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

          <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-mono">Algorithm</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  onClick={() => setShowExperimental(!showExperimental)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {showExperimental ? 'Hide Experimental' : 'Show Experimental'}
                </Button>
              </div>
              
              <RadioGroup
                value={selectedAlgorithm}
                onValueChange={handleAlgorithmChange}
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
          </div>

          <div className="mt-12 bg-gray-900/30 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <BytebeatFAQ />
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-gray-800 pt-6 pb-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <a 
            href="https://www.buymeacoffee.com/geeknik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block hover:opacity-90 transition-opacity mb-4"
          >
            <img 
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a zero-day&emoji=👾&slug=geeknik&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" 
              alt="Buy me a zero-day"
              className="mx-auto"
            />
          </a>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <a 
              href="https://github.com/geeknik/bytebeat-o-rama" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Source Code
            </a>
            <span>•</span>
            <a 
              href="https://github.com/geeknik/geeknik/blob/main/PRIVACY.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Total Nerdity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
