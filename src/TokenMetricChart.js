import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import styled from "styled-components"
import { BigNumber } from "bignumber.js"

const ChartContainer = styled.div`
    width: 750px;
    height: 500px;
`

const URL = "https://logx-monitoring-linea-u2cbkjcpkq-uc.a.run.app"
const RATE_PRECISION = 1000000000
const symbolToTokenAddressMapping = {
    //Mainnet Mantle
    5000: {
        "BTC": "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2",
        "ETH": "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
        "USDT": "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    },
    //Mainnet Linea
    59144: {
        "BTC": "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
        "ETH": "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
        "USDC": "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    },
    //Mainnet Kroma
    255: {
        "USDT": "0x0Cf7c2A584988871b654Bd79f96899e4cd6C41C0",
        "USDC": "0x0257e4d92C00C9EfcCa1d641b224d7d09cfa4522",
        "BTC": "0x2104E3BD1cC8551EeC0c7ad10dE13da29136B19C",
        "ETH": "0x4200000000000000000000000000000000000001",
    },
}

const TokenMetricChart = ({
    metricName,
    symbol,
    chainId,
    dates,
    setDates,
}) => {
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

    const tokenAddress =
        symbolToTokenAddressMapping[chainId][symbol]

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: metricName + " " + symbol,
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
        const apiUrl = `${URL}/metrics/${metricName}/${tokenAddress}/${chainId}`

        axios
            .get(apiUrl)
            .then((response) => {
                let data = response.data
                // @dev madhav-madhusoodanan
                // @notice adding the filter here to filter out the time points
                if (
                    setDates &&
                    !dates.get("startDate") &&
                    !dates.get("endDate")
                ) {
                    setDates((dates) => {
                        new Map(dates)
                            .set(
                                "startDate",
                                new Date(data[data.length - 1].timestamp)
                            )
                            .set("endDate", new Date(data[0].timestamp))
                    })
                }

                if (dates.get("startDate")) {
                    data = data.filter(
                        (item) =>
                            dates.get("startDate") <= new Date(item.timestamp)
                    )
                }
                if (dates.get("endDate")) {
                    data = data.filter(
                        (item) =>
                            dates.get("endDate") >= new Date(item.timestamp)
                    )
                }
                const labels = data.map((item) =>
                    new Date(item.timestamp).toLocaleTimeString()
                )
                let chartData
                if (
                    metricName === "LongFundingRate" ||
                    metricName === "ShortFundingRate" ||
                    metricName === "LongBorrowingRate" ||
                    metricName === "ShortBorrowingRate"
                ) {
                    chartData = data.map(
                        (item) => parseFloat(item.metricValue) / RATE_PRECISION
                    )
                } else if (
                    metricName === "LongPnl" ||
                    metricName === "ShortPnl"
                ) {
                    chartData = data.map((item) =>
                        new BigNumber(item.metricValue)
                            .dividedBy(new BigNumber(10).pow(30))
                            .toFixed()
                    )
                } else {
                    chartData = data.map((item) => parseFloat(item.metricValue))
                }
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
    }, [metricName, tokenAddress, dates, chainId])

    return (
        <ChartContainer>
            <Line data={chartData} options={chartOptions} />
        </ChartContainer>
    )
}

export default TokenMetricChart
