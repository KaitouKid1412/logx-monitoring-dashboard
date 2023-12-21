import React, { useState } from 'react';
import TokenMetricChart from './TokenMetricChart';
import GlobalMetricChart from './GlobalMetricChart';
import styled from 'styled-components';

const ChartDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const StyledSelect = styled.select`
  width: 200px; // Adjust width as needed
  height: 40px; // Adjust height as needed
  padding: 2.5px 5px;
  margin:10px;
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
`;

const SytledHeader = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 20px;
`;

function App() {
  const [selectedChainId, setSelectedChainId] = useState('5000');
  const [ethAddress, setEthAddress] = useState('0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111');
  const [btcAddress, setBtcAddress] = useState('0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2');

  const handleChainChange = (event) => {
    setSelectedChainId(event.target.value);
    if (event.target.value === '5000') {
      setEthAddress("0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111");
      setBtcAddress("0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2");
    } else {
      setEthAddress("0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f");
      setBtcAddress("0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4");
    }
  };

  return (
    <div className="App">
      <StyledSelect onChange={handleChainChange} defaultValue="5000">
        <option value="5000">Mantle</option>
        <option value="59144">Linea</option>
      </StyledSelect>
      <SytledHeader>Token Metrics</SytledHeader>
      <ChartDiv>
        <TokenMetricChart metricName="LongFundingRate" tokenAddress={ethAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortFundingRate" tokenAddress={ethAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="LongFundingRate" tokenAddress={btcAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortFundingRate" tokenAddress={btcAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="LongBorrowingRate" tokenAddress={ethAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortBorrowingRate" tokenAddress={ethAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="LongBorrowingRate" tokenAddress={btcAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortBorrowingRate" tokenAddress={btcAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="LongPnl" tokenAddress={ethAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortPnl" tokenAddress={ethAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="LongPnl" tokenAddress={btcAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="ShortPnl" tokenAddress={btcAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="TotalLongOiToOiThresholdRatio" tokenAddress={ethAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="TotalShortOiToOiThresholdRatio" tokenAddress={ethAddress} chainId={selectedChainId} />
      </ChartDiv>
      <ChartDiv>
        <TokenMetricChart metricName="TotalLongOiToOiThresholdRatio" tokenAddress={btcAddress} chainId={selectedChainId} />
        <TokenMetricChart metricName="TotalShortOiToOiThresholdRatio" tokenAddress={btcAddress} chainId={selectedChainId} />
      </ChartDiv>
      <SytledHeader>Global Metrics</SytledHeader>
      <ChartDiv>
        <GlobalMetricChart metricName="TotalOiByPoolAmount" chainId={selectedChainId} />
        <GlobalMetricChart metricName="LlpPrice" chainId={selectedChainId} />
      </ChartDiv>
    </div>
  );
}

export default App;
