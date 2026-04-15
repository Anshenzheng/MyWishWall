import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';

interface LanternState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  riseSpeed: number;
  horizontalDrift: number;
  horizontalSpeed: number;
}

@Component({
  selector: 'app-lantern',
  standalone: true,
  template: `
    <div #lanternContainer class="lantern-container">
      <div class="lantern-body">
        <div class="lantern-glow"></div>
        <div class="lantern-shape">
          <div class="lantern-inner-glow"></div>
        </div>
        <div class="lantern-top"></div>
        <div class="lantern-bottom"></div>
      </div>
      <div class="fortune-plate">
        <div class="plate-string"></div>
        <div class="plate-content">
          <span class="vertical-text">{{ wishText }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lantern-container {
      position: fixed;
      pointer-events: none;
      will-change: transform, opacity;
      z-index: 10;
      transform-origin: center bottom;
    }

    .lantern-body {
      position: relative;
      width: 60px;
      height: 80px;
      margin: 0 auto;
    }

    .lantern-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 120px;
      height: 140px;
      background: radial-gradient(ellipse at center, 
        rgba(255, 180, 100, 0.4) 0%, 
        rgba(255, 150, 80, 0.2) 30%, 
        rgba(255, 120, 60, 0.1) 60%, 
        transparent 80%);
      filter: blur(15px);
      animation: pulse 3s ease-in-out infinite;
      will-change: opacity, transform;
    }

    .lantern-shape {
      position: absolute;
      top: 10px;
      left: 5px;
      width: 50px;
      height: 60px;
      background: linear-gradient(135deg, 
        #ff9a56 0%, 
        #ff7b3a 25%, 
        #ff6b2a 50%, 
        #ff5a1a 75%, 
        #ff4a0a 100%);
      border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
      box-shadow: 
        inset 0 0 20px rgba(255, 255, 200, 0.5),
        0 0 30px rgba(255, 150, 80, 0.6),
        0 0 60px rgba(255, 120, 60, 0.3);
      overflow: hidden;
    }

    .lantern-inner-glow {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, 
        rgba(255, 255, 220, 0.9) 0%, 
        rgba(255, 220, 150, 0.6) 40%, 
        transparent 70%);
      border-radius: 50%;
      animation: flicker 2s ease-in-out infinite;
      will-change: opacity, transform;
    }

    .lantern-top {
      position: absolute;
      top: 0;
      left: 15px;
      width: 30px;
      height: 12px;
      background: linear-gradient(to bottom, #8b4513, #654321);
      border-radius: 5px 5px 0 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .lantern-top::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      background: #654321;
      border-radius: 50%;
    }

    .lantern-bottom {
      position: absolute;
      bottom: 0;
      left: 10px;
      width: 40px;
      height: 8px;
      background: linear-gradient(to bottom, #8b4513, #654321);
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .fortune-plate {
      position: relative;
      margin-top: 5px;
      text-align: center;
    }

    .plate-string {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 20px;
      background: linear-gradient(to bottom, #8b4513, #a0522d);
    }

    .plate-content {
      display: inline-block;
      background: linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #d4c4a8 100%);
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
      min-width: 30px;
      min-height: 60px;
    }

    .vertical-text {
      font-family: 'Ma Shan Zheng', cursive;
      font-size: 14px;
      color: #5c3d2e;
      writing-mode: vertical-rl;
      text-orientation: upright;
      letter-spacing: 4px;
      line-height: 1.8;
      text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.8;
        transform: translate3d(-50%, -50%, 0) scale(1);
      }
      50% {
        opacity: 1;
        transform: translate3d(-50%, -50%, 0) scale(1.05);
      }
    }

    @keyframes flicker {
      0%, 100% {
        opacity: 0.9;
        transform: scale(1);
      }
      25% {
        opacity: 1;
        transform: scale(1.05);
      }
      50% {
        opacity: 0.85;
        transform: scale(0.98);
      }
      75% {
        opacity: 0.95;
        transform: scale(1.02);
      }
    }
  `]
})
export class LanternComponent implements OnInit, OnDestroy {
  @Input() wishText: string = '';
  @Input() startX: number = 0;
  @Input() startY: number = 0;

  @ViewChild('lanternContainer', { static: true }) lanternContainer!: ElementRef<HTMLDivElement>;

  private state: LanternState = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0,
    wobblePhase: 0,
    wobbleSpeed: 0,
    wobbleAmount: 0,
    riseSpeed: 0,
    horizontalDrift: 0,
    horizontalSpeed: 0
  };

  private animationId!: number;
  private startTime!: number;
  private totalDuration = 60000;
  private nativeElement!: HTMLElement;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.nativeElement = this.lanternContainer.nativeElement;
    this.initState();
    this.ngZone.runOutsideAngular(() => {
      this.startAnimation();
    });
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initState(): void {
    this.state = {
      x: this.startX,
      y: this.startY,
      scale: 1,
      opacity: 1,
      rotation: 0,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 0.5,
      wobbleAmount: 15 + Math.random() * 20,
      riseSpeed: 0.3 + Math.random() * 0.3,
      horizontalDrift: (Math.random() - 0.5) * 0.5,
      horizontalSpeed: 0.02 + Math.random() * 0.03
    };
  }

  private startAnimation(): void {
    this.startTime = performance.now();
    this.animate();
  }

  private animate(): void {
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.totalDuration, 1);

    this.state.wobblePhase += this.state.wobbleSpeed * 0.016;
    const wobbleOffset = Math.sin(this.state.wobblePhase) * this.state.wobbleAmount;
    const secondaryWobble = Math.sin(this.state.wobblePhase * 0.7) * (this.state.wobbleAmount * 0.5);

    const nonLinearProgress = Math.pow(progress, 0.7);
    const verticalOffset = nonLinearProgress * (this.startY + 200);

    this.state.y = this.startY - verticalOffset;
    this.state.x = this.startX + wobbleOffset + secondaryWobble + (progress * this.state.horizontalDrift * 100);

    this.state.scale = 1 - (progress * 0.6);
    this.state.opacity = 1 - (progress * 0.8);

    this.state.rotation = Math.sin(this.state.wobblePhase * 0.5) * 3;

    this.updateTransform();

    if (progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  private updateTransform(): void {
    const transform = `translate3d(${this.state.x}px, ${this.state.y}px, 0) scale(${this.state.scale}) rotate(${this.state.rotation}deg)`;
    this.nativeElement.style.transform = transform;
    this.nativeElement.style.opacity = this.state.opacity.toString();
  }
}
