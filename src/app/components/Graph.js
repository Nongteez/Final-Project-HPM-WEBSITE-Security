"use client";
import { useState, useEffect } from "react";
import { BarChart, barLabelClasses } from '@mui/x-charts/BarChart';
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function Graph() {
  const [data, setData] = useState([]);
  const [averageRq20, setAverageRq20] = useState([]);
  const [averageRq29, setAverageRq29] = useState([]);
  const [averageRq3, setAverageRq3] = useState([]);
  const [pressure , setPressure] = useState(0);
  const [encouragement , setEncouragement] = useState(0);
  const [obstacle , setObstacle] = useState(0);

  const getData = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_serverURL + "/api/result"
      );
      const data = await res.json();
      if (res.ok) {
        const averageRq20 = data.reduce(
          (acc, quiz) => {
            acc.pressure += quiz.pressure;
            acc.encouragement += quiz.encouragement;
            acc.obstacle += quiz.obstacle;
            return acc;
          },
          { pressure: 0, encouragement: 0, obstacle: 0 }
        );

        const userQuizRq20Count = data.filter(
          (quiz) => quiz.pressure && quiz.encouragement && quiz.obstacle > 0
        ).length;
        averageRq20.pressure /= userQuizRq20Count;
        averageRq20.encouragement /= userQuizRq20Count;
        averageRq20.obstacle /= userQuizRq20Count;
        setPressure(averageRq20.pressure.toFixed(2));
        setEncouragement(averageRq20.encouragement.toFixed(2));
        setObstacle(averageRq20.obstacle.toFixed(2));
        const dataAverageRq20 = [
          {
            id: 1,
            name: "ความทนต่อแรงกดดัน",
            value: averageRq20.pressure.toFixed(2),
          },
          {
            id: 2,
            name: "การมีความหวังและกำลังใจ",
            value: averageRq20.encouragement.toFixed(2),
          },
          {
            id: 3,
            name: "การต่อสู้เอาชนะอุปสรรค",
            value: averageRq20.obstacle.toFixed(2),
          },
        ];
        const averageRq3 = data
          .filter((quiz) => quiz.quizId === 8)
          .reduce(
            (acc, quiz) => {
              return { total: acc.total + quiz.total };
            },
            { total: 0 }
          );
        const userQuizRq3Count = data.filter(
          (quiz) => quiz.quizId === 8
        ).length;
        averageRq3.total /= userQuizRq3Count;
        const dataAverageRq3 = { name: "พลังใจ", value: averageRq3.total.toFixed(2) };

        const averageRq29 = data
          .filter((quiz) => quiz.quizId === 6)
          .reduce(
            (acc, quiz) => {
              return { total: acc.total + quiz.total };
            },
            { total: 0 }
          );
        const userQuizRq29Count = data.filter(
          (quiz) => quiz.quizId === 6
        ).length;
        averageRq29.total /= userQuizRq29Count;
        const dataAverageRq29 = {
          name: "ความรอบรู้ทางสุขภาพจิต",
          value: averageRq29.total.toFixed(2),
        };

        setAverageRq29(dataAverageRq29);
        setAverageRq3(dataAverageRq3);
        setAverageRq20(dataAverageRq20);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sumAverageRq20 = averageRq20.reduce((acc, data) => acc + data.value, 0);
  useEffect(() => {
    getData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white rounded-md ">
          <p className="label">
            {label} : {payload[0].value} คะแนน
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center justify-evenly w-screen h-96 bg-SLB p-2">
      <div className="w-1/3 h-3/4 p-4 bg-white rounded-lg shadow-sm drop-shadow-md flex items-center justify-center ">
        <PieChart
          series={[
            {
              data: [
                { id:0, value: averageRq29.value, label: "ความรอบรู้ทางสุขภาพจิต" ,color:"#023e8a" },
                { id:1 , value: averageRq3.value, label: "พลังใจ", color: "#afd7f6" },
              ],
              arcLabel:( data ) => `${data.value}`,
              
            },
            
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'semibold',
              fontSize: '20px',
              letterSpacing: '1px',
            },
          }}
          width={600}
          height={200}
          
        ></PieChart>
      </div>
      <div className="w-1/3 h-3/4 p-4 bg-white rounded-lg shadow-sm drop-shadow-md flex items-center justify-center ">
      <BarChart
      xAxis={[{ scaleType: 'band', data: ['ความทนต่อแรงกดดัน', 'การมีความหวังและกำลังใจ', 'การต่อสู้เอาชนะอุปสรรค'] }]}
      series={[{ data: [pressure, encouragement, obstacle] ,color:"#0078b7" }]}
      width={600}
      height={300}
      barLabel={( data ) => `${data.value}`}
      sx={{
        [`& .${barLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'semibold',
          fontSize: '20px',
          letterSpacing: '1px',
        },
      }}
    />
      </div>
    </div>
  );
}
