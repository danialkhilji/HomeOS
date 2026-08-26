interface ColourPickerProps {
  colours: string[];
  selected: string;
  onSelect: (colour: string) => void;
}

export default function ColourPicker({ colours, selected, onSelect }: ColourPickerProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {colours.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onSelect(c)}
          className={`w-12 h-12 rounded-full transition-transform ${
            selected === c ? "ring-3 ring-offset-2 ring-primary scale-110" : ""
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}
