import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import styled from "styled-components"
// import { BigNumber } from 'bignumber.js';

const ChartContainer = styled.div`
    width: 750px;
    height: 500px;
`

const URL = "https://logx-monitoring-linea-u2cbkjcpkq-uc.a.run.app"
const GlobalMetricChart = ({ metricName, chainId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "",
                data: [],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    })

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: metricName,
                font: {
                    size: 12,
                },
                padding: {
                    top: 10,
                    bottom: 30,
                },
                color: "#333",
            },
        },
    }

    useEffect(() => {
        const apiUrl = `${URL}/globalMetric/${metricName}/${chainId}`
        console.log(apiUrl)
        axios
            .get(apiUrl)
            .then((response) => {
                const data = response.data
                    .map((item) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                    }))

                    .sort((timeLeft, timeRight) => {
                        const a = timeLeft.timestamp
                        const b = timeRight.timestamp
                        if (a > b) return 1
                        else if (a < b) return -1
                        else return 0
                    })
                const labels = data.map((item, index) =>
                    index === 0 || index === data.length - 1
                        ? item.timestamp.toLocaleString()
                        : item.timestamp.toLocaleTimeString()
                )
                let chartData
                chartData = data.map((item) => parseFloat(item.metricValue))
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: metricName,
                            data: chartData,
                            fill: true,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                })
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
            })
    }, [metricName, chainId])

    return (
        <ChartContainer>
            <Line data={chartData} options={chartOptions} />
        </ChartContainer>
    )
}

export default GlobalMetricChart
