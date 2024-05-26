import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  audioUrl: string;
}

const Waveform: React.FC<WaveformProps> = ({ audioUrl }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#D9DCFF',
        progressColor: '#4353FF',
        cursorColor: '#4353FF',
        height: 100,
        barWidth: 3,
        barRadius: 3,
        // responsive: true,
        normalize: true,
        // partialRender: true,
      });

      wavesurferRef.current.load(audioUrl);
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl]);

  const playPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div>
      <div ref={waveformRef} />
      <button onClick={playPause}>Play/Pause</button>
    </div>
  );
};

export default Waveform;
