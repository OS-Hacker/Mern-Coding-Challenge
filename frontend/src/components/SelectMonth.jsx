import styled from "styled-components";

const SelectMonth = ({ selectedMonth, setSelectedMonth }) => {

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
  };

  return (
    <>
      <Wrapper className="controls">
        <label htmlFor="month-select"> Select Month </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </Wrapper>
    </>
  );
};

export default SelectMonth;

const Wrapper = styled.section`
  #month-select {
    padding: 5px;
    font-size: 15px;
    font-family: sans-serif;
    cursor: pointer;
  }
`;
