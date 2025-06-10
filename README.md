# Extendible Hashing Visualization

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

An interactive visualization tool for extendible hashing, a dynamic hashing technique that allows efficient insertion and deletion of data while adapting the hash table size as needed.

## Features

- **Interactive Visualization**: Watch the hash table grow and split in real-time
- **Animated Transitions**: Smooth animations using Framer Motion for bucket splits and key redistribution
- **Directory Display**: Shows the current global depth and binary representations
- **Bucket Details**: Displays local depth and contained keys for each bucket
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

Extendible hashing consists of:
1. A **directory** that points to buckets
2. **Buckets** that store actual keys
3. A **global depth** (p) determining directory size (2^p)
4. **Local depths** (p') for each bucket

When a bucket overflows:
1. The directory doubles if needed (increasing global depth)
2. The overflowing bucket splits into two
3. Keys are redistributed based on the new local depth

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DebLuiza/ExtensibleHashVisualizer.git
