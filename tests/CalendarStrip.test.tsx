import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarStrip } from '../components/CalendarStrip';
import { vi } from 'vitest';
import { format } from 'date-fns';

describe('CalendarStrip', () => {
    it('renders dates correctly', () => {
        const today = new Date();
        render(<CalendarStrip selectedDate={today} onSelectDate={() => { }} />);
        expect(screen.getByText(format(today, 'd'))).toBeInTheDocument();
    });

    it('calls onSelectDate when a date is clicked', () => {
        const handleSelect = vi.fn();
        const today = new Date();
        render(<CalendarStrip selectedDate={today} onSelectDate={handleSelect} />);

        const dateButton = screen.getByText(format(today, 'd')).closest('button');
        expect(dateButton).toBeInTheDocument();

        fireEvent.click(dateButton!);
        expect(handleSelect).toHaveBeenCalled();
    });
});
