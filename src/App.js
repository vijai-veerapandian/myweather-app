import React from 'react';
import Search from './components/search/search';

function App() {

  const handleOnSearchChange = (searchData) => {
    console.log(searchData);
  }

  return (
    <div className="App">
      <Search onSearchChange={handleOnSearchChange} />
    </div>
  );
}

export default App;
