import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import useTrackerStore from '../stores/useTrackerStore';
import { ACHIEVEMENTS, MILESTONES } from '../utils/achievements';

export function useCelebration() {
  const addCelebration = useTrackerStore(s => s.addCelebration);
  const previousAchievementsRef = useRef(new Set());

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#1B4965', '#62B6CB', '#F4A261', '#E63946', '#22C55E'],
    });
  }, []);

  const fireBigConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1B4965', '#62B6CB', '#F4A261'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E63946', '#22C55E', '#7B2D8E'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const processCelebrations = useCallback((result) => {
    if (!result) return;

    const { achievements, ward_percent, zone_complete } = result;
    const prev = previousAchievementsRef.current;

    // Check for new achievements
    const newAchievements = achievements.filter(a => !prev.has(a));
    newAchievements.forEach(a => {
      prev.add(a);
      const info = ACHIEVEMENTS[a];
      if (info) {
        addCelebration({ type: 'achievement', ...info });
        fireConfetti();
      }
    });

    // Check milestones
    for (const m of MILESTONES) {
      if (ward_percent >= m && ward_percent < m + 5) {
        addCelebration({
          type: 'milestone',
          name: `${m}% Complete!`,
          description: m === 100
            ? 'Every house in the ward has been covered!'
            : `The ward is ${m}% done - keep going!`,
          icon: m === 100 ? '🎉' : '🎯',
        });
        if (m === 100) fireBigConfetti();
        else fireConfetti();
        break;
      }
    }

    // Zone complete
    if (zone_complete) {
      fireConfetti();
    }
  }, [addCelebration, fireConfetti, fireBigConfetti]);

  return { processCelebrations, fireConfetti, fireBigConfetti };
}
