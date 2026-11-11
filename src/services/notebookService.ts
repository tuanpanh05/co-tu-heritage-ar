import { Artifact, SavedVocabularyItem, VocabularyItem } from '../types';

const STORAGE_KEY = 'co_tu_vocabulary_notebook_v1';

export const notebookService = {
  getAll(): SavedVocabularyItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.warn('Không thể đọc dữ liệu LocalStorage:', err);
      return [];
    }
  },

  isSaved(wordId: string): boolean {
    const list = this.getAll();
    return list.some((item) => item.id === wordId);
  },

  save(word: VocabularyItem, artifact: Artifact): boolean {
    try {
      const list = this.getAll();
      const existing = list.findIndex((item) => item.id === word.id);
      if (existing !== -1) {
        return false; // Đã tồn tại, tránh trùng lặp
      }

      const newItem: SavedVocabularyItem = {
        ...word,
        savedAt: Date.now(),
        learned: false,
        sourceArtifactSlug: artifact.slug,
        sourceArtifactName: artifact.name
      };

      const updated = [newItem, ...list];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cotu_notebook_updated'));
      return true;
    } catch (err) {
      console.error('Lỗi khi lưu vào sổ tay:', err);
      return false;
    }
  },

  remove(wordId: string): boolean {
    try {
      const list = this.getAll();
      const filtered = list.filter((item) => item.id !== wordId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('cotu_notebook_updated'));
      return true;
    } catch (err) {
      console.error('Lỗi khi xóa từ:', err);
      return false;
    }
  },

  toggleLearned(wordId: string): boolean {
    try {
      const list = this.getAll();
      const updated = list.map((item) => {
        if (item.id === wordId) {
          return { ...item, learned: !item.learned };
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cotu_notebook_updated'));
      return true;
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái đã học:', err);
      return false;
    }
  },

  clearAll(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('cotu_notebook_updated'));
      return true;
    } catch (err) {
      console.error('Lỗi khi xóa sạch sổ tay:', err);
      return false;
    }
  }
};

