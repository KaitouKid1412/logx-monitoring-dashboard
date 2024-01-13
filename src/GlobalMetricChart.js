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
                const labels = data.map((item) =>
                    new Date(item.timestamp).toLocaleTimeString()
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
