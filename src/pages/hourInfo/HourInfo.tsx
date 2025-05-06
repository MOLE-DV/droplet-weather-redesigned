import { useEffect } from "react";
import "./hourInfo.sass";
import { useWeatherData } from "../../contexts/WeatherDataContext";

export const HourInfo = () => {
  const { weatherData } = useWeatherData();
  useEffect(() => {
    const canvas = document.querySelector(".hour-chart") as HTMLCanvasElement;
    const ctx = canvas!.getContext("2d");
    const padding = 30;
    const dpr = window.devicePixelRatio || 1;

    if (!canvas || !ctx || !weatherData) return;

    canvas.width = canvas.getBoundingClientRect().width * dpr;
    canvas.height = canvas.getBoundingClientRect().height * dpr;

    const data = Object.values(weatherData.forecast)
      .map((dayWeatherData) => Object.values(dayWeatherData.hours))[0]
      .filter((hourData) => hourData.temp != null);

    console.log(data);

    const temps = data.map((tempData) => tempData.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const getY = (temp: number) => {
      const scale = (temp - minTemp) / (maxTemp - minTemp);
      return canvas.height - padding - scale * (canvas.height - padding * 2);
    };
    const getX = (i: number) =>
      (i * (canvas.width - 2 * padding)) / (data.length - 1) + padding;

    const renderText = (i: number, yOffset: number) =>
      ctx.fillText(
        data[i].temp.toString(),
        getX(i),
        getY(data[i].temp) - yOffset
      );

    const getCubicBezierCurveYPoint = (
      p0: number,
      p1: number,
      p2: number,
      p3: number,
      t: number
    ) => {
      const L0 = (1 - t) * p0 + t * p1;
      const L1 = (1 - t) * p1 + t * p2;
      const L2 = (1 - t) * p2 + t * p3;
      const Q0 = (1 - t) * L0 + t * L1;
      const Q1 = (1 - t) * L1 + t * L2;
      const C0 = (1 - t) * Q0 + t * Q1;
      return C0;
    };

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.moveTo(getX(0), getY(data[0].temp));
    ctx.lineWidth = 2;

    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i].temp);

      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1].temp);

      const cpx = (x1 + x2) / 2;

      ctx.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
      renderText(i, 10);
      ctx.fillText(data[i].datetime.substring(0, 5), x1, canvas.height);
      ctx.fillRect(cpx, getCubicBezierCurveYPoint(y1, y1, y2, y2, 0.5), 10, 10);
    }
    renderText(data.length - 1, 10);
    ctx.fillText(
      data[data.length - 1].datetime.substring(0, 5),
      getX(data.length - 1),
      canvas.height
    );
    ctx.stroke();
    ctx.scale(dpr, dpr);
    ctx.closePath();
  }, []);
  return (
    <div className="pages chart-container">
      <canvas className="hour-chart"></canvas>
    </div>
  );
};
