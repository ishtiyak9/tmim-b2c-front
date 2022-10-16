import { Line } from "react-chartjs-2";

const options = {
  responsive: true,
  scales: {
    xAxes: [{}],
    yAxes: [
      {
        id: "yAxis1",
        position: "left",
        display: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  plugins: {
    datalabels: {
      anchor: "center",
      align: "end",
      color: "black",
      font: {
        size: 10,
        weight: "bold",
      },
      formatter: (value, context) => {
        return Number(value).toLocaleString();
      },
    },
  },
};

const LineChart = (props) => (
  <>
    <Line data={props.chartData} options={options} />
  </>
);

export default LineChart;
