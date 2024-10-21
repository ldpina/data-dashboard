import React, { useState, useEffect } from 'react';
import './css/List.css';

const API_KEY = import.meta.env.VITE_APP_API_KEY; 

const List = (props) => {

  const [tableData, setTableData] = useState([]);   
  const [filteredData, setFilteredData] = useState([]); 
  const [protein, setProtein] = useState('');  
  const [cuisine, setCuisine] = useState('');  

  useEffect(() => {
    setTableData(props.data);
    setFilteredData(props.data);
  }, [props.data]);  // Make sure to depend on props.data

  const fetchRecipes = async (searchQuery) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchQuery}`
      );
      const json = await response.json();
      setFilteredData(json.results);  // Update filteredData with the fetched results
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSearch = () => {
    let searchQuery = '';
    
    // Create a search query based on the user input
    if (protein) {
      searchQuery += protein;
    }
    if (cuisine) {
      searchQuery += cuisine ? (searchQuery ? `+${cuisine}` : cuisine) : '';
    }

    if (searchQuery.trim()) {
      fetchRecipes(searchQuery);  // Fetch data from API based on search input
    } else {
      setFilteredData(tableData);  // Reset to original data if no search input
    }
  };

  return (
    <div className='List'>

      <div className='filters'>

        {/* Protein Filter */}
        <div className='proteinFilter'>
          <input 
            type='text' 
            placeholder="Enter Type of Protein" 
            value={protein}
            onChange={(e) => setProtein(e.target.value)}  // Update protein state
          />
        </div>

        {/* Cuisine Filter */}
        <div className='cuisineFilter'>
          <input 
            type='text' 
            placeholder="Enter Type of Cuisine" 
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}  // Update cuisine state
          />
        </div>

        <button className='btn' onClick={handleSearch}>Search</button>
      </div>

      {/* Table for Displaying Results */}
      <div className='table'>
        <table>
          <thead>
            <tr>
              <th>Dish</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData && filteredData.length > 0 ?
              filteredData.map((item, index) => 
                <tr key={'item-' + index}>
                  <td>{item.title}</td>
                  <td><img src={item.image} alt={item.title} /></td>
                </tr>
              ) : 
              <tr><td>No Data</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;