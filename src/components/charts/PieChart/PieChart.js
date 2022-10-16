import { Pie } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const PieChart = (props) => {
  return (
    <div className="pie-height">
      <Pie data={props.pieData} options={options} />
    </div>
  );
};

export default PieChart;
