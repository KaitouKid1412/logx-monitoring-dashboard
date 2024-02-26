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
        BTC: "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2",
        ETH: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
        USDT: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    },
    //Mainnet Linea
    59144: {
        BTC: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
        ETH: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
        USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    },
    //Mainnet Kroma
    255: {
        USDT: "0x0Cf7c2A584988871b654Bd79f96899e4cd6C41C0",
        USDC: "0x0257e4d92C00C9EfcCa1d641b224d7d09cfa4522",
        BTC: "0x2104E3BD1cC8551EeC0c7ad10dE13da29136B19C",
        ETH: "0x4200000000000000000000000000000000000001",
    },
    // Telos mainnet
    40: {
        BTC: "0x7627b27594bc71e6Ab0fCE755aE8931EB1E12DAC",
        ETH: "0xA0fB8cd450c8Fd3a11901876cD5f17eB47C6bc50",
    },
    // Manta Pacific mainnet
    169: {
        BTC: "0x305E88d809c9DC03179554BFbf85Ac05Ce8F18d6",
        ETH: "0x0Dc808adcE2099A9F62AA87D9670745AbA741746",
    },
    // fuse mainnet
    122: {
        BTC: "0x33284f95ccb7B948d9D352e1439561CF83d8d00d",
        ETH: "0x5622F6dC93e08a8b717B149677930C38d5d50682",
        USDT: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
    },
}

const TokenMetricChart = ({ metricName, symbol, chainId, dates, setDates }) => {
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

    const tokenAddress = symbolToTokenAddressMapping[chainId][symbol]

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
                data = data
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
                const labels = data.map((item) =>
                    item.timestamp.toLocaleTimeString()
                )
                let chartData
                if (metricName === "LongPnl" || metricName === "ShortPnl") {
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
