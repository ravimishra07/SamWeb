#!/bin/bash
# Project SAM Setup Script
echo "Setting up project-sam..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup data directories
mkdir -p data/daily_logs data/raw_entries data/embeddings data/backups data/logs

# Create log directory
mkdir -p logs

# Set up environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Environment Configuration
OPENAI_API_KEY=your_openai_api_key_here
ENVIRONMENT=development
DEBUG=true
EOF
    echo "Please update .env with your OpenAI API key"
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "Setup complete!"
echo "Next steps:"
echo "1. Update .env with your OpenAI API key"
echo "2. Activate virtual environment: source venv/bin/activate"
echo "3. Test the system: python3 -m pytest tests/" 