import React, { useState, useEffect } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([])

  //useEffect runs after every render cycle
  useEffect(()=> {

  });

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-438f7.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient), 
      headers: { 'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [...prevIngredients, { id: responseData.name, ...ingredient }])
    })
    
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => 
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    )
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients ={userIngredients} onRemoveItem={removeIngredientHandler}/>
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
