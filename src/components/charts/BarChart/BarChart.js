import { Bar } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        id: "yAxis1",
        position: "left",
        display: true,
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          display: false,
        },
      },
    ],
  },
};

const BarChart = (props) => {
  return (
    <div className="mt-3"> 
      <Bar data={props.barData} options={options} />
    </div>
  );
};

export default BarChart;
