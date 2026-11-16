import { getSupabase } from '../lib/supabase';
import { VocabularyItem } from '../types';

export interface VocabularyRecord {
  id: string;
  artifact_id?: string | null;
  word_vi: string;
  word_en: string;
  pronunciation?: string | null;
  definition_vi?: string | null;
  definition_en?: string | null;
  example_vi?: string | null;
  example_en?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const vocabularyService = {
  mapRecordToVocabularyItem(rec: VocabularyRecord): VocabularyItem {
    return {
      id: rec.id,
      term: rec.word_en,
      ipa: rec.pronunciation || undefined,
      vietnameseMeaning: rec.word_vi,
      englishDefinition: rec.definition_en || undefined,
      exampleSentence:
        rec.example_en || rec.example_vi
          ? {
              en: rec.example_en || '',
              vi: rec.example_vi || ''
            }
          : undefined
    };
  },

  async getByArtifactId(artifactId: string): Promise<VocabularyItem[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('artifact_vocabulary')
        .select('*')
        .eq('artifact_id', artifactId)
        .order('display_order', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data.map(this.mapRecordToVocabularyItem);
    } catch (err) {
      console.warn('[vocabularyService] Error fetching vocabulary:', err);
      return [];
    }
  },

  async create(item: Omit<VocabularyRecord, 'id' | 'created_at' | 'updated_at'>): Promise<VocabularyRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifact_vocabulary')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('[vocabularyService] Error inserting vocabulary:', error);
      throw error;
    }
    return data as VocabularyRecord;
  },

  async update(id: string, updates: Partial<VocabularyRecord>): Promise<VocabularyRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifact_vocabulary')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[vocabularyService] Error updating vocabulary:', error);
      throw error;
    }
    return data as VocabularyRecord;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifact_vocabulary')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[vocabularyService] Error deleting vocabulary:', error);
      throw error;
    }
    return true;
  }
};
