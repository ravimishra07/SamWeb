import { render, screen, fireEvent } from '@testing-library/react';
import { MoodSlider } from '../components/MoodSlider';
import { vi } from 'vitest';

describe('MoodSlider', () => {
    it('renders correctly with initial value', () => {
        render(<MoodSlider value={5} onChange={() => { }} />);
        expect(screen.getByText('5/10')).toBeInTheDocument();
    });

    it('calls onChange when clicked', () => {
        const handleChange = vi.fn();
        render(<MoodSlider value={5} onChange={handleChange} />);

        // This is a bit tricky to test with simple clicks due to the calculation logic
        // But we can verify it renders and events are attached
        const slider = screen.getByText('Mood').parentElement?.nextSibling as HTMLElement;
        expect(slider).toBeInTheDocument();

        fireEvent.mouseDown(slider, { clientX: 100 });
        expect(handleChange).toHaveBeenCalled();
    });
});
