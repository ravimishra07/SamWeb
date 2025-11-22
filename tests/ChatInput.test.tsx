import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '../components/ChatInput';
import { vi } from 'vitest';

describe('ChatInput', () => {
    it('renders input field', () => {
        render(<ChatInput onSend={() => { }} />);
        expect(screen.getByPlaceholderText('write your question to ai chatbot here')).toBeInTheDocument();
    });

    it('updates value on change', () => {
        render(<ChatInput onSend={() => { }} />);
        const input = screen.getByPlaceholderText('write your question to ai chatbot here') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(input.value).toBe('Hello');
    });

    it('calls onSend when submitted', () => {
        const handleSend = vi.fn();
        render(<ChatInput onSend={handleSend} />);
        const input = screen.getByPlaceholderText('write your question to ai chatbot here');
        const button = screen.getByRole('button', { name: /send message/i });

        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(button);

        expect(handleSend).toHaveBeenCalledWith('Hello');
    });

    it('does not call onSend when empty', () => {
        const handleSend = vi.fn();
        render(<ChatInput onSend={handleSend} />);
        const button = screen.getByRole('button', { name: /send message/i });

        fireEvent.click(button);
        expect(handleSend).not.toHaveBeenCalled();
    });
});
