#!/bin/bash

# Update and install system dependencies
echo "Updating package lists..."
sudo apt update -y

# Install required system tools
echo "Installing system dependencies..."
sudo apt install -y cppcheck clang-tidy python3-pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install bandit

# Install SpotBugs (manual download as no direct apt package)
echo "Installing SpotBugs..."
wget https://github.com/spotbugs/spotbugs/releases/download/4.9.0/spotbugs-4.9.0.zip -O spotbugs.zip
unzip spotbugs.zip -d ~/spotbugs
rm spotbugs.zip

# Add SpotBugs to PATH
echo 'export PATH=$PATH:~/spotbugs/spotbugs-4.9.0/bin' >> ~/.bashrc
source ~/.bashrc

# Install Brakeman (Ruby tool)
echo "Installing Brakeman..."
sudo apt install -y ruby
sudo gem install brakeman

# Verify installations
echo "Verifying installations..."
cppcheck --version
clang-tidy --version
bandit --version
spotbugs -version
brakeman -v

echo "Setup completed successfully!"
