import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  minDate?: Date;
  error?: string;
}

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  error,
}: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSelect = (date: Date | undefined) => {
    onDateSelect(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#feb139] focus:border-[#feb139] transition-all font-semibold shadow-sm text-left flex items-center justify-between ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 bg-white hover:border-[#feb139]/50'
        }`}
      >
        <span className={selectedDate ? 'text-[#25476a]' : 'text-gray-400'}>
          {formatDate(selectedDate)}
        </span>
        <CalendarIcon size={20} className="text-[#feb139]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-[#feb139] overflow-hidden">
            <div className="bg-gradient-to-r from-[#feb139] to-[#f59e0b] px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Select Payment Date</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 calendar-picker">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                disabled={{ before: minDate }}
                modifiersClassNames={{
                  selected: 'selected-day',
                  today: 'today-day',
                }}
              />
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
          <span>⚠️</span> {error}
        </p>
      )}

      <style jsx>{`
        .calendar-picker :global(.rdp) {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #feb139;
          --rdp-background-color: #feb139;
          margin: 0;
        }

        .calendar-picker :global(.rdp-months) {
          justify-content: center;
        }

        .calendar-picker :global(.rdp-month) {
          width: 100%;
        }

        .calendar-picker :global(.rdp-caption) {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 0 1rem 0;
        }

        .calendar-picker :global(.rdp-caption_label) {
          font-size: 1rem;
          font-weight: 700;
          color: #25476a;
        }

        .calendar-picker :global(.rdp-nav) {
          position: absolute;
          right: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 0.5rem;
        }

        .calendar-picker :global(.rdp-nav_button) {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .calendar-picker :global(.rdp-nav_button:hover) {
          background-color: #feb139;
          color: white;
        }

        .calendar-picker :global(.rdp-head_cell) {
          font-weight: 600;
          color: #25476a;
          font-size: 0.875rem;
          text-transform: uppercase;
        }

        .calendar-picker :global(.rdp-cell) {
          padding: 2px;
        }

        .calendar-picker :global(.rdp-button) {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .calendar-picker :global(.rdp-day) {
          color: #25476a;
        }

        .calendar-picker :global(.rdp-day:hover:not(.rdp-day_selected)) {
          background-color: #feb139 !important;
          color: white;
        }

        .calendar-picker :global(.rdp-day_selected) {
          background-color: #feb139 !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(254, 177, 57, 0.4);
        }

        .calendar-picker :global(.rdp-day_today:not(.rdp-day_selected)) {
          background-color: #38aae1;
          color: white;
          font-weight: 600;
        }

        .calendar-picker :global(.rdp-day_disabled) {
          color: #d1d5db;
          cursor: not-allowed;
        }

        .calendar-picker :global(.rdp-day_disabled:hover) {
          background-color: transparent !important;
          color: #d1d5db !important;
        }

        .calendar-picker :global(.rdp-day_outside) {
          color: #9ca3af;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
