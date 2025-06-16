import React, { useState, useEffect } from 'react';
import './css/List.css';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

const List = (props) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [protein, setProtein] = useState('');
  const [cuisine, setCuisine] = useState('');

  useEffect(() => {
    setTableData(props.data);
    setFilteredData(props.data);
  }, [props.data]);

  // Default fetch on initial load
  useEffect(() => {
    if (!protein && !cuisine) {
      fetchRecipes('');  // Empty searchQuery for default fetch
    }
  }, []); // Empty dependency array so it only runs once on mount

  const fetchRecipes = async (searchQuery) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchQuery}`
      );
      const json = await response.json();
      setFilteredData(json.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = () => {
    let searchQuery = '';

    if (protein) searchQuery += protein;
    if (cuisine) searchQuery += cuisine ? (searchQuery ? `+${cuisine}` : cuisine) : '';

    if (searchQuery.trim()) {
      fetchRecipes(searchQuery);
    } else {
      fetchRecipes('');
    }
  };

  return (
    <div className='List'>
      <div className='filters'>
        <div className='proteinFilter'>
          <input
            type='text'
            placeholder='Enter Type of Protein'
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>

        <div className='cuisineFilter'>
          <input
            type='text'
            placeholder='Enter Type of Cuisine'
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>

        <button className='btn' onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className='table'>
        <table>
          <thead>
            <tr>
              <th>Dish</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={'item-' + index}>
                  <td>
                    <Link to={`/recipe/${item.id}`}>{item.title}</Link>
                  </td>
                  <td>
                    <img src={item.image} alt={item.title} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
