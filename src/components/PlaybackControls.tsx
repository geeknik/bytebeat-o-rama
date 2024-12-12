import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  sampleRate: number;
  onPlayPause: () => void;
  onSampleRateChange: (value: number[]) => void;
}

const PlaybackControls = ({
  isPlaying,
  currentTime,
  sampleRate,
  onPlayPause,
  onSampleRateChange
}: PlaybackControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={onPlayPause}
          className="bg-cyan-500 hover:bg-cyan-600 text-black"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="ml-2">{isPlaying ? 'Stop' : 'Play'}</span>
        </Button>

        <div className="font-mono">
          t = 0x{currentTime.toString(16).toUpperCase()}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-mono">Sample Rate: {sampleRate} Hz</label>
        <Slider
          value={[sampleRate]}
          onValueChange={onSampleRateChange}
          min={4000}
          max={44100}
          step={100}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PlaybackControls;