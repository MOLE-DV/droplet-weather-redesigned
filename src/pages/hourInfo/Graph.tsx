import { useEffect, useRef, useState } from "react";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { clamp } from "../../math/clamp";
import weatherIconsSVG from "../../assets/icons/weather/svg/getWeatherIconSVG";

//config current.for canvas padding, text offset and font size

const getDiviceType = () =>
  window.innerHeight < 500 || window.innerWidth < 800 ? "mobile" : "pc";

const getConfig = () => {
  const isMobile = getDiviceType() == "mobile";
  return {
    canvasPadding: 100,
    textBottomOffset: isMobile ? 30 : 20,
    fontTemp: {
      size: isMobile ? 50 : 16.5,
      name: "Inter, Arial, Helvetica, sans-serif",
      color: "white",
    },
    fontHour: {
      size: isMobile ? 30 : 14,
      name: "Inter, Arial, Helvetica, sans-serif",
      color: "rgb(182, 182, 182)",
    },
    weahterIconGap: 5,
    tempDisplayFreq: isMobile ? 1 : 3,
    tempDisplayWeatherIconSize: isMobile ? 50 : 20,
    tempChartDotSize: isMobile ? 10 : 5,
    tempIndicatorDotSize: 5,
  };
};

export const Graph = ({ day = 0 }: { day?: number }) => {
  const { weatherData } = useWeatherData();
  const chartPoints = useRef<
    { x: number; y: number; temp: number; icon: string }[]
  >([]);
  const [indicatorVisiblility, setIndicatorVisiblility] = useState<
    "visible" | "hidden"
  >("hidden");
  const config = useRef(getConfig());

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

    const canvasWith = canvasElement.width - config.current.canvasPadding * 2;
    const canvasHeight = canvasElement.height;

    const mousePosX = clamp(
      pageX * window.devicePixelRatio -
        canvasElement.getBoundingClientRect().left * window.devicePixelRatio,
      config.current.canvasPadding,
      canvasWith + config.current.canvasPadding
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
      ((mousePosX - config.current.canvasPadding) / canvasWith) *
        (hours.length - 1) +
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

    indicatorCtx.font = `${config.current.fontTemp.size}px ${config.current.fontTemp.name}`;
    indicatorCtx.fillStyle = "white";
    indicatorCtx.strokeStyle = "white";
    indicatorCtx.arc(
      mousePosX,
      curveYPoint,
      config.current.tempIndicatorDotSize,
      0,
      Math.PI * 2
    );

    //draw helping line to determine the hovered hour
    indicatorCtx.moveTo(mousePosX, curveYPoint);
    indicatorCtx.lineTo(mousePosX, canvasHeight - config.current.fontHour.size);
    indicatorCtx.lineWidth = 3;

    let textOffset = { x: 10, y: 30 };

    if (curveYPoint >= canvasHeight * 0.8) {
      textOffset = { ...textOffset, y: -30 };
    }

    if (mousePosX >= canvasWith * 0.98) {
      textOffset = { ...textOffset, x: -80 };
    }

    indicatorCtx.fillText(
      `${tempBetweenPoints}°`,
      mousePosX + textOffset.x,
      curveYPoint + textOffset.y
    );

    indicatorCtx.fillText(
      `${fullHour}`,
      mousePosX + textOffset.x,
      curveYPoint + textOffset.y + config.current.fontTemp.size
    );

    //draw image
    const image = new Image();
    image.src =
      weatherIconsSVG[
        closestPoint.icon &&
        Object.keys(weatherIconsSVG).includes(closestPoint.icon)
          ? closestPoint.icon
          : "unknown"
      ];
    indicatorCtx.drawImage(
      image,
      mousePosX +
        textOffset.x +
        config.current.fontTemp.size * 3.5 -
        image.width / 4,
      curveYPoint +
        textOffset.y -
        image.height / 2 -
        config.current.fontTemp.size / 3
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
        config.current.canvasPadding -
        scale * (canvas.height - config.current.canvasPadding * 2)
      );
    };
    const getX = (i: number) =>
      (i * (canvas.width - 2 * config.current.canvasPadding)) /
        (data.length - 1) +
      config.current.canvasPadding;

    const renderText = (
      i: number,
      yOffset: number,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.font = `${config.current.fontTemp.size}px ${config.current.fontTemp.name}`;
      ctx.fillStyle = config.current.fontTemp.color;

      const [x, y] = [
        getX(i) -
          (data[i].temp.toString().length * config.current.fontTemp.size) / 5 +
          0.5,
        getY(data[i].temp) - yOffset,
      ];
      ctx.fillText(`${data[i].temp.toString()}°`, x, y);

      //draw weather icon on the left of temp. text
      const image = new Image();
      image.src =
        weatherIconsSVG[
          data[i].icon && Object.keys(weatherIconsSVG).includes(data[i].icon)
            ? data[i].icon
            : "unknown"
        ];
      ctx.drawImage(
        image,
        x -
          config.current.tempDisplayWeatherIconSize -
          config.current.weahterIconGap,
        y - config.current.tempDisplayWeatherIconSize / 1.25,
        config.current.tempDisplayWeatherIconSize,
        config.current.tempDisplayWeatherIconSize
      );
    };

    const renderHourText = (i: number, x0: number) => {
      ctx.fillStyle = config.current.fontHour.color;
      ctx.font = `${config.current.fontHour.size}px ${config.current.fontHour.name}`;
      ctx.fillText(
        data[i].datetime.substring(0, 2),
        x0 -
          config.current.fontHour.size / 2 -
          (config.current.fontHour.size / 2) * 0.45,
        canvas.height
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

      //draw temperature indicators
      if (
        i % config.current.tempDisplayFreq == 0 ||
        getDiviceType() == "mobile"
      ) {
        renderText(i, config.current.textBottomOffset, ctx);
      }
      renderHourText(i, x0);
      chartPoints.current.push({
        x: x0,
        y: y0,
        temp: data[i].temp,
        icon: data[i].icon,
      });
    }
    renderText(data.length - 1, config.current.textBottomOffset, ctx);
    renderHourText(data.length - 1, getX(data.length - 1));

    chartPoints.current.push({
      x: getX(data.length - 1),
      y: getY(data[data.length - 1].temp),
      temp: data[data.length - 1].temp,
      icon: data[data.length - 1].icon,
    });

    ctx.stroke();
    ctx.closePath();

    const drawTempDot = (i: number, x: number, y: number) => {
      if (
        (getDiviceType() == "pc" && i % 3 == 0) ||
        getDiviceType() == "mobile"
      ) {
        ctx.beginPath();
        ctx.arc(x, y, config.current.tempChartDotSize, 0, 2 * Math.PI);
        ctx.fillStyle = "#222222";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      }
    };

    chartPoints.current.forEach((chartPoint, i) =>
      drawTempDot(i, chartPoint.x, chartPoint.y)
    );
  };

  useEffect(() => {
    if (getDiviceType() == "pc") {
      addEventListener("mousemove", (e) => handleChartMouseMove(e.pageX));
    }

    renderChart();
    return () => {
      getDiviceType() == "pc" &&
        removeEventListener("mousemove", (e) => handleChartMouseMove(e.pageX));

      removeEventListener("resize", renderChart);
    };
  }, [weatherData, day]);

  return (
    <div
      className="hour-chart-container"
      onMouseEnter={() => setIndicatorVisiblility("visible")}
      onMouseLeave={() => setIndicatorVisiblility("hidden")}
    >
      <canvas className={`temp-indicator ${indicatorVisiblility}`}></canvas>
      <canvas className="hour-chart"></canvas>
    </div>
  );
};
