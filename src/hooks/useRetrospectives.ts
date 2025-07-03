import { useState, useEffect } from 'react';
import { Retrospective, RetrospectiveFormData } from '@/types/retrospective';
import { calculateDayCount, calculateWeekNumber, getTodayString } from '@/utils/dateUtils';

export function useRetrospectives() {
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('retrospectives');
    if (stored) {
      try {
        setRetrospectives(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored retrospectives:', error);
      }
    }
  }, []);

  // Save to localStorage whenever retrospectives change
  useEffect(() => {
    localStorage.setItem('retrospectives', JSON.stringify(retrospectives));
  }, [retrospectives]);

  const addRetrospective = (formData: RetrospectiveFormData) => {
    const today = getTodayString();
    const newRetrospective: Retrospective = {
      id: Date.now().toString(),
      date: today,
      week: calculateWeekNumber(today),
      day_count: calculateDayCount(today),
      author: formData.author,
      summary: formData.summary,
      keep: formData.keep,
      problem: formData.problem,
      try: formData.try,
      memo: formData.memo,
      created_at: new Date().toISOString(),
    };

    setRetrospectives(prev => [newRetrospective, ...prev]);
    return newRetrospective;
  };

  const deleteRetrospective = (id: string) => {
    setRetrospectives(prev => prev.filter(retro => retro.id !== id));
  };

  const getRetrospectivesByWeek = () => {
    const grouped = retrospectives.reduce((acc, retro) => {
      const week = retro.week;
      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(retro);
      return acc;
    }, {} as Record<number, Retrospective[]>);

    // Sort each week's retrospectives by date (newest first)
    Object.keys(grouped).forEach(week => {
      grouped[parseInt(week)].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    return grouped;
  };

  const getRetrospectiveById = (id: string) => {
    return retrospectives.find(retro => retro.id === id);
  };

  return {
    retrospectives,
    addRetrospective,
    deleteRetrospective,
    getRetrospectivesByWeek,
    getRetrospectiveById,
  };
}