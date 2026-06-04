import { useEffect, useRef } from "react";
import { brand } from "../chakraTheme";

type Orb = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  phase: number;
};

type Dust = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
};

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    mountRef.current.appendChild(canvas);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let noisePattern: CanvasPattern | null = null;

    const orbPalette = [brand.colors.amber, brand.colors.amberLight, brand.colors.amberDeep];
    let orbs: Orb[] = [];

    const dust: Dust[] = [];

    const createDust = () => {
      dust.length = 0;
      const count = Math.round((width * height) / 22000);

      for (let i = 0; i < count; i += 1) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.12,
          size: 0.8 + Math.random() * 1.6,
          alpha: 0.08 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const SPEED_CONFIG = {
      // 1. 線性漂移速度倍率（原版為 1.0）
      // 改成 2.5 代表平移速度變為 2.5 倍
      driftMultiplier: 20,

      // 2. 局部波浪擺動速度（原版 phase 遞增為 0.0008, time 乘數為 0.00005）
      // 增加此數值會讓光暈在原地扭動得更劇烈、更頻繁
      waveSpeedMultiplier: 2.0,

      // 3. 局部波浪擺動幅度（原版為 X 軸 6 像素, Y 軸 5 像素）
      // 數值越大，晃動的範圍越廣
      waveAmplitudeMultiplier: 1.5,
    };

    const createOrbs = () => {
      orbs = orbPalette.map((color, index) => {
        // 原版基礎速度
        const baseVx = (index % 2 === 0 ? 1 : -1) * (0.018 + index * 0.007);
        const baseVy = (index % 2 === 0 ? -1 : 1) * (0.014 + index * 0.005);

        return {
          x: width * (0.18 + index * 0.31),
          y: height * (0.16 + index * 0.2),
          radius: 260 + index * 72,
          // 💡 套用線性漂移速度倍率
          vx: baseVx * SPEED_CONFIG.driftMultiplier,
          vy: baseVy * SPEED_CONFIG.driftMultiplier,
          color,
          alpha: 0.14 - index * 0.02,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = 160;
      noiseCanvas.height = 160;
      const noiseContext = noiseCanvas.getContext("2d");

      if (noiseContext) {
        const imageData = noiseContext.createImageData(
          noiseCanvas.width,
          noiseCanvas.height,
        );

        for (let i = 0; i < imageData.data.length; i += 4) {
          const value = Math.floor(Math.random() * 255);
          imageData.data[i] = value;
          imageData.data[i + 1] = value;
          imageData.data[i + 2] = value;
          imageData.data[i + 3] = Math.random() > 0.88 ? 24 : 8;
        }

        noiseContext.putImageData(imageData, 0, 0);
        noisePattern = context.createPattern(noiseCanvas, "repeat");
      }

      createDust();
      createOrbs();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const base = context.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, brand.colors.bg0);
      base.addColorStop(0.48, brand.colors.bg1);
      base.addColorStop(1, "#02040b");
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalCompositeOperation = "lighter";

      orbs.forEach((orb, index) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.phase += 0.0008 + index * 0.0002;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const x = orb.x + Math.sin(orb.phase + time * 0.00005) * 6;
        const y = orb.y + Math.cos(orb.phase + time * 0.00005) * 5;
        const gradient = context.createRadialGradient(
          x,
          y,
          orb.radius * 0.06,
          x,
          y,
          orb.radius,
        );

        gradient.addColorStop(0, `${orb.color}cc`);
        gradient.addColorStop(0.34, `${orb.color}66`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, orb.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.restore();

      context.save();
      context.globalCompositeOperation = "screen";

      for (const dot of dust) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.phase += 0.05;

        if (dot.x < -20) dot.x = width + 20;
        if (dot.x > width + 20) dot.x = -20;
        if (dot.y < -20) dot.y = height + 20;
        if (dot.y > height + 20) dot.y = -20;

        const twinkle = 0.5 + Math.sin(dot.phase + time * 0.001) * 0.5;
        const alpha = dot.alpha * twinkle;
        const parallax = 1 - dot.z * 0.35;

        context.fillStyle = `rgba(229, 231, 235, ${alpha})`;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.size * parallax, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();

      if (noisePattern) {
        context.save();
        context.globalAlpha = 0.06;
        context.fillStyle = noisePattern;
        context.fillRect(0, 0, width, height);
        context.restore();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);

      if (mountRef.current && canvas.parentNode === mountRef.current) {
        mountRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
};

export default ThreeBackground;
