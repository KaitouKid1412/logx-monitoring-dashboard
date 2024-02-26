import React, { useState } from "react"
import TokenMetricChart from "./TokenMetricChart"
import GlobalMetricChart from "./GlobalMetricChart"
import FeeChart from "./FeeChart"
import styled from "styled-components"

const ChartDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const StyledSelect = styled.select`
    width: 200px; // Adjust width as needed
    height: 40px; // Adjust height as needed
    padding: 2.5px 5px;
    margin: 10px;
    font-size: 16px; // Adjust font size as needed
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    cursor: pointer;

    &:hover {
        border-color: #888;
    }

    &:focus {
        outline: none;
        border-color: #555;
    }
`

const StyledHeader = styled.h2`
    font-size: 18px;
    font-weight: bold;
    margin: 20px;
`

function App() {
    const [selectedChainId, setSelectedChainId] = useState("5000")
    
    const [dates, setDates] = useState(new Map())

    const handleChainChange = (event) => {
        setSelectedChainId(event.target.value)
    }

    return (
        <div className="App">
            <StyledSelect onChange={handleChainChange} defaultValue="5000">
                <option value="5000">Mantle</option>
                <option value="59144">Linea</option>
                <option value="255">Kroma</option>
                <option value="169">Manta</option>
                <option value="40">Telos</option>
                <option value="122">Fuse</option>
            </StyledSelect>
            <StyledHeader>fee Metrics</StyledHeader>
            <ChartDiv>
                <FeeChart
                    metricName="fundingfee"
                    chainId={selectedChainId}
                    dates={dates}
                />
                <FeeChart
                    metricName="tradingFee"
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <FeeChart
                    metricName="borrowingFee"
                    chainId={selectedChainId}
                    dates={dates}
                />
                <FeeChart
                    metricName="realisedPnl"
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <StyledHeader>Token Metrics</StyledHeader>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongFundingRate"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortFundingRate"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongFundingRate"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortFundingRate"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongBorrowingRate"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortBorrowingRate"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongBorrowingRate"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortBorrowingRate"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongPnl"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortPnl"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="LongPnl"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="ShortPnl"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="TotalLongOiToOiThresholdRatio"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="TotalShortOiToOiThresholdRatio"
                    symbol={"ETH"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <ChartDiv>
                <TokenMetricChart
                    metricName="TotalLongOiToOiThresholdRatio"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
                <TokenMetricChart
                    metricName="TotalShortOiToOiThresholdRatio"
                    symbol={"BTC"}
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
            <StyledHeader>Global Metrics</StyledHeader>
            <ChartDiv>
                <GlobalMetricChart
                    metricName="TotalOiByPoolAmount"
                    chainId={selectedChainId}
                    dates={dates}
                />
                <GlobalMetricChart
                    metricName="LlpPrice"
                    chainId={selectedChainId}
                    dates={dates}
                />
            </ChartDiv>
        </div>
    )
}

export default App
