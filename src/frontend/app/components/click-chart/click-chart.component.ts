import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { ClickStats } from '../../statistics.service';

@Component({
  selector: 'app-click-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>Click Statistics</h3>
      <canvas 
        #chartCanvas 
        class="click-chart">
      </canvas>
      @if (stats().length === 0) {
        <p class="no-data">No data to display</p>
      }
    </div>
  `,
  styleUrls: ['./click-chart.component.scss']
})
export class ClickChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  readonly stats = input<ClickStats[]>([]);
  
  constructor() {
    // Use effect to automatically redraw when stats change
    effect(() => {
      if (this.canvasRef) {
        this.drawChart();
      }
    });
  }
  
  ngAfterViewInit() {
    this.drawChart();
  }

  private drawChart() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stats = this.stats();
    if (stats.length === 0) return;

    // Use fixed dimensions to prevent width growth
    const fixedWidth = 600;
    const fixedHeight = 300;
    const dpr = window.devicePixelRatio || 1;
    
    // Only set canvas dimensions if they haven't been set or are different
    if (canvas.width !== fixedWidth * dpr || canvas.height !== fixedHeight * dpr) {
      canvas.width = fixedWidth * dpr;
      canvas.height = fixedHeight * dpr;
      canvas.style.width = fixedWidth + 'px';
      canvas.style.height = fixedHeight + 'px';
      ctx.scale(dpr, dpr);
    } else {
      // Canvas is already properly sized, just ensure scaling is correct
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    const displayWidth = fixedWidth;
    const displayHeight = fixedHeight;

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Chart dimensions
    const padding = 60;
    const chartWidth = displayWidth - 2 * padding;
    const chartHeight = displayHeight - 2 * padding;

    // Find max clicks for scaling
    const maxClicks = Math.max(...stats.map(s => s.click_count), 1);

    // Draw chart background
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    // Draw bars
    const barWidth = chartWidth / stats.length * 0.8;
    const barSpacing = chartWidth / stats.length * 0.2;

    stats.forEach((stat, index) => {
      const barHeight = (stat.click_count / maxClicks) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = padding + chartHeight - barHeight;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Add subtle shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(x + 2, y + 2, barWidth, barHeight);
      
      // Redraw bar on top
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        stat.click_count.toString(),
        x + barWidth / 2,
        y - 8
      );

      // Draw short code below bar
      ctx.fillStyle = '#6c757d';
      ctx.font = '11px Arial';
      const shortCode = stat.short_code.length > 8 ? 
        stat.short_code.substring(0, 6) + '..' : 
        stat.short_code;
      ctx.fillText(
        shortCode,
        x + barWidth / 2,
        padding + chartHeight + 20
      );
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxClicks / 5) * i);
      const y = padding + chartHeight - (i / 5) * chartHeight;
      ctx.fillText(value.toString(), padding - 10, y + 4);
      
      // Draw grid lines
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw chart title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clicks per Short URL', displayWidth / 2, 35);

    // Draw axis labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6c757d';
    ctx.fillText('Clicks', 30, padding + chartHeight / 2);
    ctx.fillText('Short URLs', displayWidth / 2, displayHeight - 15);
  }
}
