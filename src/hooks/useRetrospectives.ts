
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Retrospective, RetrospectiveFormData } from '@/types/retrospective';
import { calculateDayCount, calculateWeekNumber, getTodayString } from '@/utils/dateUtils';

export function useRetrospectives() {
  const queryClient = useQueryClient();

  // Fetch retrospectives from Supabase
  const { data: retrospectives = [], isLoading, error } = useQuery({
    queryKey: ['retrospectives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retrospectives')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching retrospectives:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Add retrospective mutation
  const addRetrospectiveMutation = useMutation({
    mutationFn: async (formData: RetrospectiveFormData) => {
      const today = getTodayString();
      const newRetrospective = {
        date: today,
        week: calculateWeekNumber(today),
        day_count: calculateDayCount(today),
        author: formData.author,
        summary: formData.summary,
        keep: formData.keep,
        problem: formData.problem,
        try: formData.try,
        memo: formData.memo || null,
      };

      const { data, error } = await supabase
        .from('retrospectives')
        .insert([newRetrospective])
        .select()
        .single();

      if (error) {
        console.error('Error adding retrospective:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospectives'] });
    },
  });

  // Delete retrospective mutation
  const deleteRetrospectiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('retrospectives')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting retrospective:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospectives'] });
    },
  });

  const addRetrospective = (formData: RetrospectiveFormData) => {
    return addRetrospectiveMutation.mutateAsync(formData);
  };

  const deleteRetrospective = (id: string) => {
    deleteRetrospectiveMutation.mutate(id);
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
    isLoading,
    error,
    addRetrospective,
    deleteRetrospective,
    getRetrospectivesByWeek,
    getRetrospectiveById,
  };
}
