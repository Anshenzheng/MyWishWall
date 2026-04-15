import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  phase: number;
  speedX: number;
  speedY: number;
}

@Component({
  selector: 'app-starry-background',
  standalone: true,
  template: `
    <canvas #canvas class="starry-canvas"></canvas>
  `,
  styles: [`
    .starry-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  `]
})
export class StarryBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId!: number;
  private time = 0;

  ngOnInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    const particleCount = 180;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.3 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02
      });
    }
  }

  private drawBackground(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.5, '#0d1f3c');
    gradient.addColorStop(1, '#1a2a4a');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private drawMoon(): void {
    const moonX = window.innerWidth * 0.85;
    const moonY = window.innerHeight * 0.15;
    const moonRadius = Math.min(window.innerWidth, window.innerHeight) * 0.06;

    const glowGradient = this.ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 3);
    glowGradient.addColorStop(0, 'rgba(255, 248, 220, 0.15)');
    glowGradient.addColorStop(0.5, 'rgba(255, 248, 220, 0.05)');
    glowGradient.addColorStop(1, 'rgba(255, 248, 220, 0)');
    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
    this.ctx.fill();

    const moonGradient = this.ctx.createRadialGradient(
      moonX - moonRadius * 0.3,
      moonY - moonRadius * 0.3,
      0,
      moonX,
      moonY,
      moonRadius
    );
    moonGradient.addColorStop(0, '#fffef0');
    moonGradient.addColorStop(0.7, '#f5f0e0');
    moonGradient.addColorStop(1, '#e8e0d0');

    this.ctx.fillStyle = moonGradient;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawParticles(): void {
    this.time += 0.01;

    this.particles.forEach(particle => {
      const opacity = particle.baseOpacity + Math.sin(this.time + particle.phase) * 0.3;
      
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, opacity))})`;
      this.ctx.fill();
    });
  }

  private animate(): void {
    this.drawBackground();
    this.drawMoon();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
