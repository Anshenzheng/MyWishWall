import { Component, OnInit, OnDestroy, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { StarryBackgroundComponent } from './starry-background.component';
import { LanternComponent } from './lantern.component';
import { MusicPlayerComponent } from './music-player.component';
import { FormsModule } from '@angular/forms';

interface LanternData {
  id: number;
  text: string;
  startX: number;
  startY: number;
  componentRef: ComponentRef<LanternComponent>;
  createdAt: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StarryBackgroundComponent, MusicPlayerComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  @ViewChild('lanternContainer', { read: ViewContainerRef, static: true }) 
  lanternContainer!: ViewContainerRef;

  wishText = '';
  private lanterns: LanternData[] = [];
  private lanternIdCounter = 0;
  private simulationInterval: any;
  private cleanupInterval: any;

  private readonly simulatedWishes = [
    '愿家人平安健康',
    '愿事业蒸蒸日上',
    '愿爱情甜蜜美满',
    '愿学业有成',
    '愿财源广进',
    '愿身体健康',
    '愿心想事成',
    '愿万事如意',
    '愿年年有余',
    '愿岁岁平安',
    '愿福星高照',
    '愿吉祥如意',
    '愿步步高升',
    '愿前程似锦',
    '愿花好月圆',
    '愿金玉满堂',
    '愿龙凤呈祥',
    '愿百福具臻',
    '愿千祥云集',
    '愿万事亨通',
    '愿吉星高照',
    '愿鸿运当头',
    '愿五福临门',
    '愿六六大顺',
    '愿七星报喜',
    '愿八方来财',
    '愿九九同心',
    '愿十全十美',
    '愿百事可乐',
    '愿千事吉祥',
    '愿万事如意',
    '愿笑口常开',
    '愿青春永驻',
    '愿美丽常在',
    '愿智慧增长',
    '愿勇气倍增',
    '愿内心平静',
    '愿生活美满',
    '愿幸福安康'
  ];

  private readonly lanternLifetime = 60000;
  private readonly minLanternCount = 18;

  ngOnInit(): void {
    this.startSimulation();
    this.startCleanup();
  }

  ngOnDestroy(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.lanterns.forEach(l => l.componentRef.destroy());
    this.lanterns = [];
  }

  sendWish(): void {
    if (!this.wishText.trim()) return;
    
    this.createLantern(this.wishText.trim());
    this.wishText = '';
  }

  private createLantern(text: string): void {
    const startX = Math.random() * (window.innerWidth - 100) + 50;
    const startY = window.innerHeight - 150;

    const componentRef = this.lanternContainer.createComponent(LanternComponent);
    componentRef.instance.wishText = text;
    componentRef.instance.startX = startX;
    componentRef.instance.startY = startY;

    const lanternData: LanternData = {
      id: this.lanternIdCounter++,
      text,
      startX,
      startY,
      componentRef,
      createdAt: Date.now()
    };

    this.lanterns.push(lanternData);
  }

  private startSimulation(): void {
    const initialCount = Math.min(this.minLanternCount, 10);
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => {
        this.createSimulatedLantern();
      }, i * 800);
    }

    this.simulationInterval = setInterval(() => {
      this.maintainLanternCount();
    }, 3000);
  }

  private maintainLanternCount(): void {
    const currentCount = this.lanterns.length;
    const deficit = this.minLanternCount - currentCount;

    if (deficit > 0) {
      const toCreate = Math.min(deficit, 3);
      for (let i = 0; i < toCreate; i++) {
        setTimeout(() => {
          this.createSimulatedLantern();
        }, i * 500);
      }
    } else if (Math.random() < 0.3) {
      this.createSimulatedLantern();
    }
  }

  private createSimulatedLantern(): void {
    const randomWish = this.simulatedWishes[Math.floor(Math.random() * this.simulatedWishes.length)];
    this.createLantern(randomWish);
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredLanterns();
    }, 5000);
  }

  private cleanupExpiredLanterns(): void {
    const now = Date.now();
    const expiredLanterns = this.lanterns.filter(
      l => now - l.createdAt > this.lanternLifetime
    );

    expiredLanterns.forEach(expired => {
      const index = this.lanterns.findIndex(l => l.id === expired.id);
      if (index !== -1) {
        this.lanterns[index].componentRef.destroy();
        this.lanterns.splice(index, 1);
      }
    });
  }
}
