const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const LOOKUP_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipesGrid = document.getElementById("recipesGrid");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");
const loadingIndicator = document.getElementById("loading-indicator");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  searchRecipes(searchTerm);
});

async function searchRecipes(query) {
  loadingIndicator.classList.remove("hidden");
  recipesGrid.innerHTML = "";
  const response = await fetch(`${SEARCH_API_URL}${query}`);
  const data = await response.json();
  console.log("data: ", data);
  displayRecipes(data.meals);
}

function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    recipesGrid.innerHTML = `<h3 class="recipe-title">No recipes found</h3>`;
    loadingIndicator.classList.add("hidden");
    return;
  }

  recipes.forEach((recipe) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-card");
    recipeDiv.dataset.id = recipe.idMeal;

    recipeDiv.innerHTML = `<img class="recipe-image" src="${recipe.strMealThumb}" alt="card" />
    <div class="recipe-content">
        <h3 class="recipe-title">${recipe.strMeal}</h3>
        <p class="recipe-description">${recipe.strInstructions}</p>
        <button class="view-details-btn" data-recipe-id="${recipe.idMeal}">View Details
        </button>
    </div>`;

    recipesGrid.appendChild(recipeDiv);
    loadingIndicator.classList.add("hidden");
  });
}

function showModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

recipesGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-card");

  if (card) {
    const recipeId = card.dataset.id;
    getRecipeDetails(recipeId);
  }
});

async function getRecipeDetails(id) {
  showModal();
  const response = await fetch(`${LOOKUP_API_URL}${id}`);

  const data = await response.json();

  console.log("details: ", data);
  if (data.meals && data.meals.length > 0) {
    displayRecipeDetails(data.meals[0]);
  } else {
    modalContent.innerHTML =
      '<p class="message error">Could not load recipe details.</p>';
  }
}

modalCloseBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function displayRecipeDetails(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push(`<li>${measure ? `${measure} ` : ""}${ingredient}</li>`);
    } else {
      break;
    }
  }

  modalContent.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
    <h3>Category: ${recipe.strCategory}</h3>
    <h3>Area: ${recipe.strArea}</h3>
    <h3>Ingredients</h3>
    <ul>${ingredients.join("")}</ul>
    <h3>Instructions</h3>
    <p>${recipe.strInstructions}</p>
    <a href="${
      recipe.strYoutube
    }" target="_blank" class="view-details-btn" style="display: inline-block; text-decoration: none; text-align: center; color: white; margin-top:20px;">Watch on YouTube</a>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  searchRecipes("");
});

const scrollBtn = document.querySelector(".scroll-to-top-btn");
console.dir(scrollBtn);
window.onscroll = function () {
  if (document.documentElement.scrollTop > 100) {
    scrollBtn.style.cssText = "opacity:1; visibility:visible";
  } else {
    scrollBtn.style.cssText = "opacity:0; visibility:hidden";
  }
};
scrollBtn.addEventListener("click", function () {
  document.documentElement.scrollTop = 0;
});
