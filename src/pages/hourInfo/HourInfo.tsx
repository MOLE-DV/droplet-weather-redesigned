import { useEffect } from "react";
import "./hourInfo.sass";

export const HourInfo = () => {
  useEffect(() => {
    const canvas = document.querySelector(".hour-chart") as HTMLCanvasElement;
    const ctx = canvas!.getContext("2d");

    if (!canvas || !ctx) return;

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    const data = [
      { hour: "00", temp: 14 },
      { hour: "03", temp: 13 },
      { hour: "06", temp: 15 },
      { hour: "09", temp: 18 },
      { hour: "12", temp: 22 },
      { hour: "15", temp: 24 },
      { hour: "18", temp: 20 },
      { hour: "21", temp: 17 },
    ];

    const getY = (y: number) => canvas.height - y;

    ctx.beginPath();
    ctx.moveTo(20, getY(20));
    ctx.lineWidth = 2;

    const x1 = 20;
    const y1 = getY(20);
    const x2 = 40;
    const y2 = getY(40);
    const cpx = (x1 + x2) / 2;

    ctx.bezierCurveTo(
      (20 + 60) / 2,
      getY(20),
      (20 + 60) / 2,
      getY(60),
      60,
      getY(60)
    );

    ctx.stroke();
  }, []);
  return (
    <div className="pages chart-container">
      <canvas className="hour-chart"></canvas>
    </div>
  );
};
