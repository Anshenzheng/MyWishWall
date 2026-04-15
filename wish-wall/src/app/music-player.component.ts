import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: true,
  template: `
    <div class="music-player">
      <button class="play-btn" (click)="togglePlay()">
        @if (!isPlaying) {
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
        }
        @if (isPlaying) {
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        }
      </button>
      
      <div class="volume-control">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <input 
          type="range" 
          class="volume-slider" 
          min="0" 
          max="100" 
          [value]="volume"
          (input)="onVolumeChange($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    .music-player {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: rgba(20, 30, 50, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 25px;
      border: 1px solid rgba(255, 180, 100, 0.2);
    }

    .play-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff9a56, #ff6b2a);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(255, 107, 42, 0.4);
    }

    .play-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 107, 42, 0.6);
    }

    .play-btn:active {
      transform: scale(0.95);
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 200, 150, 0.8);
    }

    .volume-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 80px;
      height: 4px;
      background: rgba(255, 200, 150, 0.3);
      border-radius: 2px;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #ff9a56, #ff6b2a);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(255, 107, 42, 0.5);
      transition: transform 0.2s ease;
    }

    .volume-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #ff9a56, #ff6b2a);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 6px rgba(255, 107, 42, 0.5);
    }

    .volume-slider::-moz-range-track {
      height: 4px;
      background: rgba(255, 200, 150, 0.3);
      border-radius: 2px;
    }
  `]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioRef', { static: false }) audioRef!: ElementRef<HTMLAudioElement>;
  
  private audio: HTMLAudioElement | null = null;
  isPlaying = false;
  volume = 50;

  private readonly audioUrl = 'https://downsc.chinaz.net/Files/DownLoad/sound1/201801/9620.wav';

  ngOnInit(): void {
    this.initAudio();
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  private initAudio(): void {
    this.audio = new Audio(this.audioUrl);
    this.audio.loop = true;
    this.audio.volume = this.volume / 100;
  }

  togglePlay(): void {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => {
        console.warn('Audio play failed:', err);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseInt(target.value, 10);
    if (this.audio) {
      this.audio.volume = this.volume / 100;
    }
  }
}
