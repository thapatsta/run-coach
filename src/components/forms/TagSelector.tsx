import type { RunTag } from '../../types';
import { ALL_TAGS, TAG_LABELS } from '../../constants';

interface TagSelectorProps {
  selected: RunTag[];
  onChange: (tags: RunTag[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
  const toggle = (tag: RunTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_TAGS.map((tag) => {
        const isSelected = selected.includes(tag);
        const isInjury = tag === 'injury_note';
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              isSelected
                ? isInjury
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-indigo-600 text-white border-indigo-600'
                : isInjury
                ? 'bg-white text-red-500 border-red-200 hover:bg-red-50'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {TAG_LABELS[tag]}
          </button>
        );
      })}
    </div>
  );
}
