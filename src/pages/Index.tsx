import { useState, useEffect, useCallback } from 'react';
import { BytebeatProcessor, bytebeatAlgorithms } from '@/lib/bytebeat';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import PlaybackControls from '@/components/PlaybackControls';

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

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 font-mono">
          Bytebeat Generator
        </h1>

        <div className="space-y-6">
          <WaveformVisualizer data={visualData} />

          <PlaybackControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            sampleRate={sampleRate}
            onPlayPause={togglePlayback}
            onSampleRateChange={handleSampleRateChange}
          />

          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            showExperimental={showExperimental}
            onAlgorithmChange={handleAlgorithmChange}
            onToggleExperimental={() => setShowExperimental(!showExperimental)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;