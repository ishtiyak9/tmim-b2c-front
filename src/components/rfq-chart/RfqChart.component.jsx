import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../pages/dashboard/dashboard';
import RoundInfo from '../charts/RoundInfo/RoundInfo';
import moment from 'moment';
import { getData } from '../../shared/http-request-handler';
import { RFQ_CHART_JSON_KEYS } from '../../shared/utility/chart-constant';
import SpinnerComponent from '../../shared/component/spinner/spinner.component';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { getChartDataFormat } from '../../shared/utility/utility';
import './css/rfqTable.css';
import { LensTwoTone } from '@material-ui/icons';

const RfqChartComponent = () => {
  const userContextData = useContext(UserContext);
  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === 'en' ? 'left' : 'right'
  );
  const [chartData, setChartData] = useState([]);
  const [roundChartData, setRoundChartData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('day');
  const { t } = useTranslation();

  const fetchData = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_RFQ_CHART_URL + '?' + filter}`;
    getData(url, localStorage.getItem('token'))
      .then((res) => {
        setLoading(false);
        let dataX = [];
        const value = [];

        // create map
        const key =
          filter === 'day' ? 'days' : filter === 'year' ? 'month' : filter;
        const result = res[RFQ_CHART_JSON_KEYS[filter]].reduce(function (
          map,
          obj
        ) {
          map[obj[key]] = obj.counts;
          return map;
        },
        {});
        // console.log('Map Result ---- 0000', result);

        //get data format
        let formatArr = getChartDataFormat(filter);
        // console.log('Map Result ---- 111', formatArr);

        // merge result and format array to create final data
        formatArr.forEach((d) => {
          if (d in result) {
            console.log(d);
            dataX.push(d);
            value.push(result[d]);
          } else {
            dataX.push(d);
            value.push(0);
          }
        });

        if (filter === 'year') {
          dataX = dataX.map((year) => moment(year, 'M').format('MMM'));
        }

        // console.log('Map Result ---- ', dataX, value);
        const colors = ['#ee734f'];
        const option = {
          color: colors,
          width: 680,
          height: 220,
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#303443',
            borderColor: '#303443',
            textStyle: {
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 15,
            },
          },
          toolbox: {
            show: false,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataX,
            axisTick: false,
            axisLine: false,
            axisLabel: {
              interval: filter === 'month' ? 7 : 0,
              rotate: 0,
              fontSize: 12,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'RFQ',
              data: value,
              type: 'line',
              areaStyle: { color: '#ee734f', opacity: 0.1 },
              lineStyle: { color: '#ee734f', width: 4, type: 'solid' },
              smooth: true,
            },
          ],
        };
        // console.log(option);
        setChartData(option);
        setRoundChartData(res.active_total_count);
      })
      .catch((e) => {
        setLoading(false);
        setChartData();
        setRoundChartData(0);
      });
  };

  const filterValueChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    setChangeAlignment(
      userContextData.selectedLanguage === 'en' ? 'left' : 'right'
    );
    fetchData();
  }, [filter, userContextData.selectedLanguage]);

  return (
    <div className="row dashboard-box-shadow ml-1">
      <div className="d-flex justify-content-end">
        <span className="overflow-hidden">
          <select
            // className="select-option dashboard-input-look"
            className={
              changeAlignment === 'right'
                ? 'select-option-quotation-chart-rtl'
                : 'select-option-quotation-chart'
            }
            onChange={filterValueChangeHandler}
            value={filter}
          >
            <option value="day">
              {t('dashboard-card-rfq-dropdown-option-1')}
            </option>
            <option value="month">
              {t('dashboard-card-rfq-dropdown-option-2')}
            </option>
            <option value="year">
              {t('dashboard-card-rfq-dropdown-option-3')}
            </option>
          </select>
        </span>
      </div>

      {loading ? (
        <SpinnerComponent />
      ) : (
        <>
          {chartData && chartData.series ? (
            <>
              <div className="col-md-3 graph-height padding-0">
                <div className="background">
                  <div className="content">
                    <RoundInfo chartData={roundChartData} />
                  </div>
                </div>
              </div>
              <div className="col-md-9 padding-0">
                <ReactECharts option={chartData} />
              </div>
            </>
          ) : (
            <p>No Data Found</p>
          )}
        </>
      )}
    </div>
  );
};

export default RfqChartComponent;
