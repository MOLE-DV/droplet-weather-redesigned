import { useEffect, useRef, useState } from "react";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { clamp } from "../../math/clamp";
import arrow_left from "../../assets/icons/arrow-left.svg";

//config for canvas padding, text offset and font size

const isMobile = window.innerHeight < 800 || window.innerWidth < 1000;
const config = {
  canvasPadding: isMobile ? 20 : 100,
  textBottomOffset: isMobile ? 10 : 20,
  fontTemp: {
    size: isMobile ? 15 : 16.5,
    name: "Inter, Arial, Helvetica, sans-serif",
    color: "white",
  },
  fontHour: {
    size: isMobile ? 12.5 : 14,
    name: "Inter, Arial, Helvetica, sans-serif",
    color: "rgb(182, 182, 182)",
  },
};

export const Graph = ({ day = 0 }: { day?: number }) => {
  const { weatherData } = useWeatherData();
  const chartPoints = useRef<{ x: number; y: number; temp: number }[]>([]);
  const [indicatorVisiblility, setIndicatorVisiblility] = useState<
    "visible" | "hidden"
  >("hidden");

  const handleChartMouseMove = (pageX: number) => {
    const canvasElement = document.querySelector(
      ".hour-chart"
    ) as HTMLCanvasElement;

    const indicator = document.querySelector(
      ".temp-indicator"
    ) as HTMLCanvasElement;

    const indicatorCtx = indicator?.getContext("2d");
    if (
      !canvasElement ||
      !indicatorCtx ||
      !indicator ||
      (indicator && indicator.classList[1] === "hidden") ||
      !weatherData
    )
      return;
    pageX += canvasElement.offsetLeft;

    const canvasWith = canvasElement.width - config.canvasPadding * 2;
    const canvasHeight = canvasElement.height;

    const mousePosX = clamp(
      pageX * window.devicePixelRatio -
        canvasElement.getBoundingClientRect().left * window.devicePixelRatio,
      config.canvasPadding,
      canvasWith + config.canvasPadding
    );

    const closestPoint = chartPoints.current
      .slice(0, 24)
      .filter((chartPoint, i) => {
        const minPos = chartPoint.x;
        const maxPos =
          i + 1 < chartPoints.current.length
            ? chartPoints.current[i + 1].x
            : canvasWith; //if index isn't out of range: use next point's x as border, otherwise pick canvas width.
        return mousePosX >= minPos && mousePosX <= maxPos;
      })[0];

    if (!closestPoint) return;

    const closestPointIndex = chartPoints.current.indexOf(closestPoint);

    const nextPointX =
      chartPoints.current[closestPointIndex + 1].x || canvasWith;

    const diffPercentage =
      (mousePosX - closestPoint.x) / (nextPointX - closestPoint.x); //as the mouse moves between two points it calculates percentage of mouse position between them

    const tempDiff =
      chartPoints.current[closestPointIndex + 1].temp - closestPoint.temp;

    const tempBetweenPoints = (
      closestPoint.temp +
      tempDiff * diffPercentage
    ).toFixed(1); //defines calculated temperature between two points

    const curveYPoint =
      (1 - diffPercentage) * closestPoint.y +
      diffPercentage * chartPoints.current[closestPointIndex + 1].y; //calculates y position of the curve between two points

    const hours = Object.values(weatherData.forecast[day].hours).filter(
      (hourData) => hourData.temp != null
    );

    const hoveredHour =
      ((mousePosX - config.canvasPadding) / canvasWith) * (hours.length - 1) +
      parseInt(hours[0].datetime.split(":")[0]);
    //calculates hovered hour based on mouse position

    const hoveredMinutes =
      parseFloat(`0.${hoveredHour.toString().split(".")[1]}`) * 60; //calculates hovered minutes based on mouse position

    const fullHour = `${hoveredHour < 10 ? "0" : ""}${Math.floor(
      hoveredHour
    )}:${hoveredMinutes < 10 ? "0" : ""}${Math.floor(hoveredMinutes)}`; //formats hovered hour and minutes

    //render indicator

    indicator.width = canvasElement.width;
    indicator.height = canvasElement.height;

    indicatorCtx.beginPath();

    indicatorCtx.font = `${config.fontTemp.size}px ${config.fontTemp.name}`;
    indicatorCtx.fillStyle = "white";
    indicatorCtx.strokeStyle = "white";
    indicatorCtx.arc(mousePosX, curveYPoint, 7, 0, Math.PI * 2);

    //draw helping line to determine the hovered hour
    indicatorCtx.moveTo(mousePosX, curveYPoint);
    indicatorCtx.lineTo(mousePosX, canvasHeight - config.fontHour.size);
    indicatorCtx.lineWidth = 3;

    let textOffset = { x: 10, y: 30 };

    if (curveYPoint >= canvasHeight * 0.8) {
      textOffset = { ...textOffset, y: -30 };
    }

    if (mousePosX >= canvasWith * 0.98) {
      textOffset = { ...textOffset, x: -50 };
    }

    indicatorCtx.fillText(
      `${tempBetweenPoints}°`,
      mousePosX + textOffset.x,
      curveYPoint + textOffset.y
    );

    indicatorCtx.fillText(
      `${fullHour}`,
      mousePosX + textOffset.x,
      curveYPoint + textOffset.y + config.fontTemp.size
    );

    indicatorCtx.fill();
    indicatorCtx.stroke();
    indicatorCtx.closePath();
  };

  const renderChart = () => {
    chartPoints.current = [];
    const canvas = document.querySelector(".hour-chart") as HTMLCanvasElement;
    const ctx = canvas!.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    if (!canvas || !ctx || !weatherData) return;

    canvas.width = canvas.getBoundingClientRect().width * dpr;
    canvas.height = canvas.getBoundingClientRect().height * dpr;

    const data = Object.values(weatherData.forecast)
      .map((dayWeatherData) => Object.values(dayWeatherData.hours))
      [day].filter((hourData) => hourData.temp != null);
    const temps = data.map((tempData) => tempData.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const getY = (temp: number) => {
      const scale = (temp - minTemp) / (maxTemp - minTemp);
      return (
        canvas.height -
        config.canvasPadding -
        scale * (canvas.height - config.canvasPadding * 2)
      );
    };
    const getX = (i: number) =>
      (i * (canvas.width - 2 * config.canvasPadding)) / (data.length - 1) +
      config.canvasPadding;

    const renderText = (i: number, yOffset: number) => {
      ctx.font = `${config.fontTemp.size}px ${config.fontTemp.name}`;
      ctx.fillStyle = config.fontTemp.color;

      return ctx.fillText(
        `${data[i].temp.toString()}°`,
        getX(i) -
          (data[i].temp.toString().length * config.fontTemp.size) / 5 +
          0.5,
        getY(data[i].temp) - yOffset
      );
    };

    // Draw the chart
    ctx.beginPath();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.moveTo(getX(0), getY(data[0].temp));
    ctx.lineWidth = 2;
    for (let i = 0; i < data.length - 1; i++) {
      const x0 = getX(i),
        y0 = getY(data[i].temp);
      const x3 = getX(i + 1),
        y3 = getY(data[i + 1].temp);

      ctx.lineTo(x3, y3);
      if (i % 3 == 0) {
        renderText(i, config.textBottomOffset);
      }
      ctx.fillStyle = config.fontHour.color;
      ctx.font = `${config.fontHour.size}px ${config.fontHour.name}`;
      ctx.fillText(
        data[i].datetime.substring(0, 2),
        x0 - config.fontHour.size / 2 - (config.fontHour.size / 2) * 0.45,
        canvas.height
      );
      chartPoints.current.push({ x: x0, y: y0, temp: data[i].temp });
    }
    renderText(data.length - 1, config.textBottomOffset);

    ctx.fillStyle = config.fontHour.color;
    ctx.font = `${config.fontHour.size}px ${config.fontHour.name}`;
    ctx.fillText(
      data[data.length - 1].datetime.substring(0, 2),
      getX(data.length - 1) -
        config.fontHour.size / 2 -
        (config.fontHour.size / 2) * 0.45,
      canvas.height
    );
    chartPoints.current.push({
      x: getX(data.length - 1),
      y: getY(data[data.length - 1].temp),
      temp: data[data.length - 1].temp,
    });

    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    if (!isMobile) {
      addEventListener("mousemove", (e) => handleChartMouseMove(e.pageX));
    } else {
      addEventListener("touchmove", (e) =>
        handleChartMouseMove(e.touches[0].pageX)
      );
    }

    addEventListener("resize", renderChart);
    renderChart();
    return () => {
      !isMobile
        ? removeEventListener("mousemove", (e) => handleChartMouseMove(e.pageX))
        : removeEventListener("touchmove", (e) =>
            handleChartMouseMove(e.touches[0].pageX)
          );
      removeEventListener("resize", renderChart);
    };
  }, [weatherData, day]);

  return (
    <div
      className="hour-chart-container"
      onMouseEnter={() => setIndicatorVisiblility("visible")}
      onMouseLeave={() => setIndicatorVisiblility("hidden")}
      onTouchStart={() => setIndicatorVisiblility("visible")}
      onTouchEnd={() => setIndicatorVisiblility("hidden")}
    >
      <div className="scroll-buttons-wrapper">
        <button className={`scroll-left`}>
          <img src={arrow_left} />
        </button>
        <button className={`scroll-right`}>
          <img src={arrow_left} />
        </button>
      </div>
      <canvas className={`temp-indicator ${indicatorVisiblility}`}></canvas>
      <canvas className="hour-chart"></canvas>
    </div>
  );
};
