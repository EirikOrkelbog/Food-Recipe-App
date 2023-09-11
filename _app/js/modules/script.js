const searchButton = document.querySelector('.search_button');
const mealList = document.querySelector('.meal');
const mealDetailsContent = document.querySelector('.meals_details-content');
const mealDetailsContainer = document.querySelector('.meal_details');
const recipeCloseButton = document.querySelector('.recipe_close-button');
const searchInput = document.querySelector('#search_input');


export default async function fetchData(searchInput) {
	const result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`);
	const data = await result.json();
	return data;
}

searchButton.addEventListener('click', handleClickMealList);
searchInput.addEventListener('keyup', handleMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseButton.addEventListener('click', handleCloseRecipe);

async function handleClickMealList() {
	let searchInputText = document.getElementById('search_input').value.trim();
	const data = await fetchData(searchInputText);
	getMealList(data);
}

async function handleMealList(event) {
	if (event.key == 'Enter') {
		let searchInputText = document.getElementById('search_input').value.trim();
		const data = await fetchData(searchInputText);
		getMealList(data);
	}
}

function handleCloseRecipe() {
	mealDetailsContainer.classList.add('hide_meal-details');
}

function getMealList(data) {
	let html = "";
	if (data.meals) {
		data.meals.forEach(meal => {
			html += `
			<div class="meal_item" data-id="${meal.idMeal}">
			<div class="meal_image">
			<img src="${meal.strMealThumb}" alt="food">
			</div>
			
			<div class="meal_name">
			<h3>${meal.strMeal}</h3>
			<a href="#" class="recipe_button">Get Recipe</a>
			</div>
			</div>
			`;
		});
		mealList.classList.remove('no_meal');
	} else {
		html = "Sorry, we didn't find any meal";
		mealList.classList.add('no_meal');
	}
	mealList.innerHTML = html;
}

async function getMealRecipe(event) {
	event.preventDefault();
	if (event.target.classList.contains('recipe_button')) {
		let mealItem = event.target.parentElement.parentElement;
		await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
			.then(response => response.json())
			.then(data => mealRecipeModal(data.meals));
	}
}
function mealRecipeModal(meal) {
	meal = meal[0];
	console.log(meal.strInstructions);
	let html = `
		<h2 class="recipe_title">${meal.strMeal}</h2>
		<p class="recipe_category">${meal.strCategory}</p>

		<div class="recipe_instructions">
			<h3>Instructions:</h3>
			<p>${meal.strInstructions}</p>
		</div>

		<div class="recipe_meal-image">
			<img src="${meal.strMealThumb}" alt="">
		</div>

		<div class="recipe_link">
			<a href="${meal.strYoutube}" target="_blank">Watch Video</a>
		</div>
	`;
	mealDetailsContent.innerHTML = html;
	mealDetailsContent.parentElement.classList.remove('hide_meal-details');
}
