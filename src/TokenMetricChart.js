import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';

const ChartContainer = styled.div`
    width: 750px;
    height: 500px;
`;

const URL = 'https://logx-monitoring-linea-u2cbkjcpkq-uc.a.run.app';
const RATE_PRECISION = 1000000000;
const tokenAddressToSymbolMapping = {
    //Mainnet Mantle
    '5000': {
      '0xcabae6f6ea1ecab08ad02fe02ce9a44f09aebfa2': 'BTC',
      '0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111': 'ETH',
      '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae': 'USDT',
    },
    //Mainnet Linea
    '59144': {
      '0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4': 'BTC',
      '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f': 'ETH',
      '0x176211869ca2b568f2a7d4ee941e073a821ee1ff': 'USDC',
    },
  };

const TokenMetricChart = ({ metricName, tokenAddress, chainId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    });

    const symbol = tokenAddressToSymbolMapping[chainId][tokenAddress.toLowerCase()];

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: metricName + ' ' + symbol,
                font: {
                    size: 12
                },
                padding: {
                    top: 10,
                    bottom: 30
                },
                color: '#333'
            }
        },
    };

    useEffect(() => {
        const apiUrl = `${URL}/metrics/${metricName}/${tokenAddress}/${chainId}`;
        
        axios.get(apiUrl).then(response => {
            const data = response.data;
            const labels = data.map(item => new Date(item.timestamp).toLocaleTimeString());
            let chartData;
            if (metricName === "LongFundingRate" || metricName === "ShortFundingRate" || metricName === "LongBorrowingRate" || metricName === "ShortBorrowingRate") {
                chartData = data.map(item => parseFloat(item.metricValue) / RATE_PRECISION);
            } else if (metricName === "LongPnl" || metricName === "ShortPnl") {
                chartData = data.map(item => new BigNumber(item.metricValue).dividedBy(new BigNumber(10).pow(30)).toFixed());
            } else {
                chartData = data.map(item => parseFloat(item.metricValue));
            }
            setChartData({
                labels: labels,
                datasets: [{
                    label: metricName,
                    data: chartData,
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            });
        }).catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [metricName, tokenAddress]);

    return (
        <ChartContainer>
            <Line data={chartData} options={chartOptions}/>
        </ChartContainer>
    );
};


export default TokenMetricChart;
