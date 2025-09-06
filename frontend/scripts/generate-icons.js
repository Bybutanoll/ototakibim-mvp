const fs = require('fs');
const path = require('path');

// Simple PNG icon generator using canvas
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(0.5, '#ec4899');
  gradient.addColorStop(1, '#06b6d4');
  
  // Draw background circle
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 8, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw car icon
  const centerX = size / 2;
  const centerY = size / 2;
  const scale = size / 512;
  
  // Car body
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(
    centerX - 80 * scale, 
    centerY - 20 * scale, 
    160 * scale, 
    60 * scale
  );
  
  // Car windows
  ctx.fillStyle = '#3b82f6';
  ctx.globalAlpha = 0.7;
  ctx.fillRect(
    centerX - 70 * scale, 
    centerY - 15 * scale, 
    50 * scale, 
    25 * scale
  );
  ctx.fillRect(
    centerX + 20 * scale, 
    centerY - 15 * scale, 
    50 * scale, 
    25 * scale
  );
  
  // Wheels
  ctx.fillStyle = '#1e293b';
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(centerX - 60 * scale, centerY + 40 * scale, 15 * scale, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + 60 * scale, centerY + 40 * scale, 15 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // AI particles
  ctx.fillStyle = '#ec4899';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(centerX - 30 * scale, centerY - 50 * scale, 8 * scale, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + 30 * scale, centerY - 50 * scale, 8 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(centerX, centerY - 60 * scale, 6 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

// Generate all icon sizes
sizes.forEach(size => {
  const icon = generateIcon(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(__dirname, '..', 'public', filename);
  
  fs.writeFileSync(filepath, icon);
  console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');
