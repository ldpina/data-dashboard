import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../components/css/pageDetails.css';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );
        const data = await response.json();
        setRecipeDetails(data);

        const nutritionResponse = await fetch(
          `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${API_KEY}`
        );
        const nutritionInfo = await nutritionResponse.json();
        setNutritionData(nutritionInfo);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipeDetails || !nutritionData) return <p>Loading...</p>;

  // Convert mg to g where necessary
  const convertToGrams = (amount, unit) => {
    if (unit === "mg") {
      return amount / 1000;
    }
    return amount; 
  };

  const nutrientData = [
    'Protein',
    'Fat',
    'Carbohydrates',
    'Sugar',
    'Sodium',
    'Saturated Fat'
  ].map(nutrientName => {
    const nutrient = nutritionData.nutrients.find(n => n.name === nutrientName);
    return {
      name: nutrientName,
      amount: nutrient ? convertToGrams(nutrient.amount, nutrient.unit) : 0
    };
  });

  const truncateSummary = (summary) => {
    //remove all html elements
    const cleanSummary = summary.replace(/<[^>]*>/g, '');
    //cut off at these terms
    const match = cleanSummary.match(/spoonacular score of \d+%/i);
    if (match) {
      //Returns everything from the start of the summary (position 0) up to the end of the matched phrase
      return cleanSummary.substring(0, cleanSummary.indexOf(match[0]) + match[0].length);
    }
    return cleanSummary;
  };

  return (
    <div className='mainArea'>
      <button id = "backButton" onClick={() => navigate(-1)}>🔙 Back</button>
      <h1>{recipeDetails.title}</h1>
      <h2>Ready in: {recipeDetails.readyInMinutes} Mins</h2>
      <h2>Serves: {recipeDetails.servings}</h2>
      <img src={recipeDetails.image} alt={recipeDetails.title} />
      <p id = "summaryDetails" dangerouslySetInnerHTML={{ __html: truncateSummary(recipeDetails.summary) }}/>
      
      <div>
        <h3>Nutritional Information Bar Chart (g)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={nutrientData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecipeDetails;
