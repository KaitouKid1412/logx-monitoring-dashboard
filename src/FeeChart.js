import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import styled from "styled-components"

const ChartContainer = styled.div`
    width: 750px;
    height: 500px;
`

const URL = "https://linea-odp-endpoints-amw4lppwda-uc.a.run.app"

const TokenMetricChart = ({ metricName, chainId, dates, setDates }) => {
    const [values, setValues] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [defaultStartDate, setDefaultStartDate] = useState(null)
    const [defaultEndDate, setDefaultEndDate] = useState(null)
    const [timeZoneDiff] = useState(new Date().getTimezoneOffset() * 60 * 1000)

    useEffect(() => {
        const apiUrl = `${URL}/${metricName}?chainId=${chainId}`

        axios
            .get(apiUrl)
            .then((response) => {
                let data = response.data

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
                setStartDate(data[0].timestamp)
                setDefaultStartDate(data[0].timestamp)
                if (data.length >= 30)
                    setStartDate(data[data.length - 30].timestamp)
                    setDefaultStartDate(data[data.length - 30].timestamp)
                setEndDate(data[data.length - 1].timestamp)
                setDefaultEndDate(data[data.length - 1].timestamp)
                let chartData = []
                let total = 0
                data.forEach((item) => {
                    total += Number(item[metricName])
                    chartData.push({
                        timestamp: item.timestamp,
                        data: total,
                    })
                })
                console.log(metricName, chartData)
                setValues(() => chartData)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
            })
    }, [metricName, chainId])

    const handleStartDateChange = (newValues) => {
        if(!newValues.target.valueAsDate){
            setStartDate(defaultStartDate)
            return
        }
        setStartDate(
            new Date(newValues.target.valueAsDate.getTime() + timeZoneDiff)
        )
        console.log(
            new Date(newValues.target.valueAsDate.getTime() + timeZoneDiff)
        )
    }

    const handleEndDateChange = (newValues) => {
        if(!newValues.target.valueAsDate){
            setEndDate(defaultEndDate)
            return
        }
        setEndDate(
            new Date(newValues.target.valueAsDate.getTime() + timeZoneDiff)
        )
        console.log(
            new Date(newValues.target.valueAsDate.getTime() + timeZoneDiff)
        )
        
    }

    const filterTime = (item) =>
        ((startDate && item.timestamp >= startDate) || (!startDate && true)) &&
        ((endDate && item.timestamp <= endDate) || (!endDate && true))

    const findStartingValue = (timestamp, array) => {
        const index = array.findIndex((item) => item.timestamp === timestamp)
        if (index > 0) return array[index - 1].data
        else return 0
    }

    const filteredValues = values.filter(filterTime)
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
                style={{ width: "100%", textAlign: "center", fontSize: "15px" }}
            >
                {`${metricName} (Total from ${filteredValues[0]?.timestamp.toLocaleDateString()} to ${filteredValues[
                    filteredValues.length - 1
                ]?.timestamp.toLocaleDateString()}):`}
            </div>
            <ChartContainer>
                <Line
                    data={{
                        labels: filteredValues.map((item) => item.timestamp.toLocaleTimeString()),
                        datasets: [
                            {
                                label: metricName,
                                data: filteredValues.map(
                                    (item, index, array) =>
                                        item.data -
                                        findStartingValue(
                                            array[0].timestamp,
                                            values
                                        )
                                ),
                                fill: false,
                                borderColor: "rgb(75, 192, 192)",
                                tension: 0.1,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: `$${
                                    (filteredValues[filteredValues.length - 1]
                                        ?.data - filteredValues[0]?.data).toFixed(4)
                                }`,
                                font: {
                                    size: 18,
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30,
                                },
                                color: "#333",
                            },
                        },
                    }}
                />
                <div
                    style={{
                        height: "50px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                    }}
                >
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 8,
                        height: "max-content"
                    }}>
                        <h2>Enter start date</h2>
                        <input
                            aria-label="Date"
                            type="date"
                            onChange={handleStartDateChange}
                            // value={startDate ?? new Date()}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 8,
                        height: "max-content",
                        alignItems: "flex-end"
                    }}>
                        <h2>Enter end date</h2>
                        <input
                            aria-label="Date"
                            type="date"
                            onChange={handleEndDateChange}
                            // value={endDate ?? new Date()}
                        />
                    </div>
                </div>
            </ChartContainer>
        </div>
    )
}

export default TokenMetricChart
