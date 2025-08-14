import React, { useMemo } from 'react';

const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  // Server Purple Theme Colors
  primaryColor: [174, 62, 201], // Server Purple (#ae3ec9)
  secondColor: [108, 75, 123], // Darker Purple for gradients
  accentColor: [139, 91, 166], // Light Purple accent
  dangerColor: [231, 76, 60], // Red for high usage/low durability
  healthColor: [46, 204, 113], // Green for good status
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const color = useMemo(
    () => {
      if (durability) {
        // Durability: Green when high, red when low
        if (percent > 70) return `rgb(${COLORS.healthColor[0]}, ${COLORS.healthColor[1]}, ${COLORS.healthColor[2]})`;
        if (percent > 30) return colorMixer(COLORS.dangerColor, COLORS.healthColor, percent / 100);
        return `rgb(${COLORS.dangerColor[0]}, ${COLORS.dangerColor[1]}, ${COLORS.dangerColor[2]})`;
      } else {
        // Weight: Green when light, red when heavy
        if (percent < 30) return `rgb(${COLORS.healthColor[0]}, ${COLORS.healthColor[1]}, ${COLORS.healthColor[2]})`; // Green when light
        if (percent < 60) return colorMixer(COLORS.healthColor, COLORS.primaryColor, (percent - 30) / 30); // Green to Purple
        if (percent < 80) return colorMixer(COLORS.primaryColor, COLORS.dangerColor, (percent - 60) / 20); // Purple to Red  
        return `rgb(${COLORS.dangerColor[0]}, ${COLORS.dangerColor[1]}, ${COLORS.dangerColor[2]})`; // Red when heavy
      }
    },
    [durability, percent]
  );

  return (
    <div className={durability ? 'durability-bar' : 'weight-bar'}>
      <div
        style={{
          visibility: percent > 0 ? 'visible' : 'hidden',
          height: '100%',
          width: `${percent}%`,
          backgroundColor: color,
          transition: `background ${0.3}s ease, width ${0.3}s ease`,
        }}
      ></div>
    </div>
  );
};
export default WeightBar;
