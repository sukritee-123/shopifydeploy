
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import {OPTIONS} from "../../frontend/utils/constants/index"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
/**
 * The LineChart component is a React component that renders a line chart using the provided labels and
 * data.
 * @returns The LineChart component is being returned.
 */
export const LineChart = ({lablesAndData}) => {
  const chartStyle = {
    width: "100%",
    height: "295px",
    backgroundColor: 'fff',
  

  }
  const data = {
  
    labels: lablesAndData.labels,
    datasets: [
      {
        fill: false,
        label: 'Clicks',
        data: lablesAndData.data,
        borderColor: '#1C78CE',
      },
    
    ],
  };


 


  return (
    <div style={chartStyle}>
      <Line options={OPTIONS} data={data} />
    </div>
  );
};
