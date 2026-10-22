'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export interface EvaluationItem {
  playerId: string;
  isPresent: boolean;
  score?: '-' | '0' | '+';
  absenceReason?: 'unexcused' | 'excused' | 'sick' | 'injury';
  comment?: string;
}

export async function submitTrainingEvaluations(
  trainingId: string,
  clubId: string,
  evaluatorId: string,
  evaluations: EvaluationItem[]
) {
  try {
    const payload = evaluations.map((item) => ({
      training_id: trainingId,
      club_id: clubId,
      player_id: item.playerId,
      evaluator_id: evaluatorId,
      is_present: item.isPresent,
      score: item.isPresent ? item.score : null,
      absence_reason: !item.isPresent ? item.absenceReason : null,
      comment: item.comment || null,
    }));

    // Zapis ocen do bazy (upsert zapobiega duplikatom)
    const { error } = await supabaseAdmin
      .from('evaluations')
      .upsert(payload, { onConflict: 'training_id,player_id' });

    if (error) {
      console.error('Błąd zapisu ocen:', error);
      return { success: false, error: error.message };
    }

    // Odświeżenie widoku w Next.js
    revalidatePath(`/trainings/${trainingId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}