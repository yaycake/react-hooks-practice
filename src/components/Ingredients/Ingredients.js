import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http'

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': 
      return action.ingredients;
    case 'ADD': 
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get here')
  }
};

// const httpReducer = (curHttpState, action) => {
//   switch (action.type) {
//     case 'SEND': 
//       return { ...curHttpState, loading: true }
//     case 'RESPONSE':
//       return { ...curHttpState, loading: false}
//     case 'ERROR':
//       return { loading: false, error: action.errorMessage };
//     case'CLEAR':
//     return{...curHttpState, error:null }
//     default:
//       throw new Error('Should not be reached')
//   }
// };



const Ingredients = () => {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])

  const { 
    isLoading, 
    error, 
    data, 
    sendRequest, 
    reqExtra, 
    reqIdentifier, 
    clear } = useHttp();

  // const [ httpState, dispatchHttp ] = useReducer(httpReducer, {loading: false, error: null})
  // const [ userIngredients, setUserIngredients ] = useState([])
  // const [ isLoading, setIsLoading] = useState(false)
  // const [ error, setError ] = useState();


  //useEffect runs after every render cycle
  useEffect(()=> {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error &&reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({  type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
    } 
    
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS")
  }, [userIngredients])
  
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({
      type: 'SET', 
      ingredients: filteredIngredients 
    })
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-update-438f7.firebaseio.com/ingredients.json', 
      'POST', 
      JSON.stringify(ingredient), 
      ingredient, 
      'ADD_INGREDIENT');
    // dispatchHttp({type: 'SEND'});

    // fetch('https://react-hooks-update-438f7.firebaseio.com/ingredients.json', {
    //   method: 'POST', 
    //   body: JSON.stringify(ingredient), 
    //   headers: { 'Content-Type': 'application/json'}
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'})
    //   return response.json();
    // }).then(responseData => {
      // setUserIngredients(prevIngredients => [...prevIngredients, { id: responseData.name, ...ingredient }])

    //   dispatch({type: 'ADD', ingredient: {
    //     id: responseData.name, ...ingredient
    //   }})
    // }).catch(error => {
    //   dispatchHttp({type: 'ERROR', errorMessage: error.message})
    // })
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-update-438f7.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE', null, ingredientId, 'REMOVE_INGREDIENT')

    // dispatchHttp({type: 'SEND'})
    // fetch(`https://react-hooks-update-438f7.firebaseio.com/ingredients/${ingredientId}.json`, {
    //   method: 'DELETE'
    // })
    // .then(response => {
    //   dispatchHttp({type: 'RESPONSE'})
    //   // setUserIngredients(prevIngredients => 
    //   //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    //   // )
    //   dispatch({
    //     type: 'DELETE', 
    //     id: ingredientId
    //   })
    // }).catch(error => {
    //   dispatchHttp({type: 'ERROR', errorMessage: error.message})
    // })
  },[sendRequest]);

  const ingredientList = useMemo(()=>{
    return (
      <IngredientList ingredients ={userIngredients} onRemoveItem={removeIngredientHandler}/>
    )
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients = {filteredIngredientsHandler}/>
          {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
