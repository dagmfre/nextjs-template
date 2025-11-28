import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface GameInfo {
  title: string;
  slug: string;
  version: number;
  last_update: string;
  developer: string;
  description: string;
  instructions: string;
  category: string;
  tags: string;
  thumbnail: string;
}

export async function GET() {
  try {
    const gamesDir = path.join(process.cwd(), 'public', 'games');
    const gameFolders = fs.readdirSync(gamesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const games: GameInfo[] = [];

    for (const folder of gameFolders) {
      const infoPath = path.join(gamesDir, folder, 'info.json');
      
      if (fs.existsSync(infoPath)) {
        const infoContent = fs.readFileSync(infoPath, 'utf-8');
        const info = JSON.parse(infoContent);
        
        // Determine thumbnail path (asteroid uses 'images', others use 'img')
        const imagesFolder = fs.existsSync(path.join(gamesDir, folder, 'images')) 
          ? 'images' 
          : 'img';
        
        games.push({
          ...info,
          thumbnail: `/games/${folder}/${imagesFolder}/cover.png`,
        });
      }
    }

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error loading games:', error);
    return NextResponse.json(
      { error: 'Failed to load games' },
      { status: 500 }
    );
  }
}
