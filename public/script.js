let exerciseChart;

async function loadMuscles() {
  await fetch('/muscles')
    .then((result) => result.json())
    .then((resultJson) => {
      const muscleSelect = document.getElementById('muscleSelect');

      if (!muscleSelect) {
        return;
      }

      muscleSelect.innerHTML = '';

      resultJson.results.forEach((muscle) => {
        const option = document.createElement('option');
        option.value = muscle.id;
        option.innerHTML = muscle.name;
        muscleSelect.appendChild(option);
      });
    });
}

function getExerciseName(exercise) {
  let exerciseName = 'Exercise ' + exercise.id;

  exercise.translations.forEach((translation) => {
    if (translation.language === 2) {
      exerciseName = translation.name;
    }
  });

  return exerciseName;
}

function getExerciseDescription(exercise) {
  let exerciseDescription = '';

  exercise.translations.forEach((translation) => {
    if (translation.language === 2) {
      exerciseDescription = translation.description;
    }
  });

  return exerciseDescription;
}

function getNames(list) {
  let names = '';

  list.forEach((item) => {
    names = names + item.name + ', ';
  });

  return names;
}

async function loadExercises(event) {
  if (event) {
    event.preventDefault();
  }

  await fetch('/exercises')
    .then((result) => result.json())
    .then((resultJson) => {
      const exerciseResults = document.getElementById('exerciseResults');
      const exerciseSlides = document.getElementById('exerciseSlides');
      const muscleSelect = document.getElementById('muscleSelect');

      exerciseResults.innerHTML = '';

      if (exerciseSlides) {
        exerciseSlides.innerHTML = '';
      }

      const selectedMuscle = Number(muscleSelect.value);
      const exercises = [];

      resultJson.results.forEach((exercise) => {
        let foundMuscle = false;

        exercise.muscles.forEach((muscle) => {
          if (muscle.id === selectedMuscle) {
            foundMuscle = true;
          }
        });

        exercise.muscles_secondary.forEach((muscle) => {
          if (muscle.id === selectedMuscle) {
            foundMuscle = true;
          }
        });

        if (foundMuscle) {
          exercises.push(exercise);
        }
      });

      const categoryCounts = {};

      exercises.slice(0, 10).forEach((exercise) => {
        const exerciseName = getExerciseName(exercise);
        const exerciseDescription = getExerciseDescription(exercise);
        const mainMuscles = getNames(exercise.muscles);
        const secondaryMuscles = getNames(exercise.muscles_secondary);
        const equipmentNames = getNames(exercise.equipment);

        let category = 'Unknown';

        if (exercise.category) {
          category = exercise.category.name;
        }

        if (categoryCounts[category]) {
          categoryCounts[category] = categoryCounts[category] + 1;
        } else {
          categoryCounts[category] = 1;
        }

        const exerciseCard = document.createElement('div');
        exerciseCard.setAttribute('class', 'exerciseCard');

        const exerciseTitle = document.createElement('h3');
        exerciseTitle.innerHTML = exerciseName;

        const exerciseCategory = document.createElement('p');
        exerciseCategory.innerHTML = 'Category: ' + category;

        const muscleText = document.createElement('p');
        muscleText.innerHTML = 'Main Muscles: ' + mainMuscles;

        const secondaryMuscleText = document.createElement('p');
        secondaryMuscleText.innerHTML = 'Secondary Muscles: ' + secondaryMuscles;

        const equipmentText = document.createElement('p');
        equipmentText.innerHTML = 'Equipment: ' + equipmentNames;

        const descriptionText = document.createElement('p');
        descriptionText.innerHTML = 'Description: ' + exerciseDescription;

        const saveButton = document.createElement('button');
        saveButton.setAttribute('class', 'mainButton');
        saveButton.innerHTML = 'Save to Favorites';

        saveButton.onclick = function () {
          saveFavorite(exercise);
        };

        exerciseCard.appendChild(exerciseTitle);
        exerciseCard.appendChild(exerciseCategory);
        exerciseCard.appendChild(muscleText);
        exerciseCard.appendChild(secondaryMuscleText);
        exerciseCard.appendChild(equipmentText);
        exerciseCard.appendChild(descriptionText);
        exerciseCard.appendChild(saveButton);

        exerciseResults.appendChild(exerciseCard);

        if (exerciseSlides) {
          const slide = document.createElement('div');
          slide.setAttribute('class', 'swiper-slide');
          slide.innerHTML = exerciseName;
          exerciseSlides.appendChild(slide);
        }
      });

      createChart(categoryCounts);

      if (exerciseSlides) {
        new Swiper('.swiper', {
          loop: true,
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        });
      }
    });
}

async function saveFavorite(exercise) {
  let category = 'Unknown';

  if (exercise.category) {
    category = exercise.category.name;
  }

  await fetch('/favorite', {
    method: 'POST',
    body: JSON.stringify({
      exercise_id: exercise.id,
      exercise_name: getExerciseName(exercise),
      muscle_group: getNames(exercise.muscles),
      equipment: getNames(exercise.equipment),
      category: category,
      image_url: ''
    }),
    headers: {
      'content-type': 'application/json'
    }
  }).then((result) => result.json());

  alert('Exercise saved to favorites.');
}

async function loadFavorites() {
  await fetch('/favorites')
    .then((result) => result.json())
    .then((resultJson) => {
      const favoritesResults = document.getElementById('favoritesResults');

      if (!favoritesResults) {
        return;
      }

      favoritesResults.innerHTML = '';

      resultJson.forEach((favorite) => {
        const exerciseCard = document.createElement('div');
        exerciseCard.setAttribute('class', 'exerciseCard');

        exerciseCard.innerHTML =
          '<h3>' + favorite.exercise_name + '</h3>' +
          '<p>Category: ' + favorite.category + '</p>' +
          '<p>Muscle Group: ' + favorite.muscle_group + '</p>' +
          '<p>Equipment: ' + favorite.equipment + '</p>';

        favoritesResults.appendChild(exerciseCard);
      });
    });
}

function createChart(categoryCounts) {
  const chartCanvas = document.getElementById('exerciseChart');

  if (!chartCanvas) {
    return;
  }

  if (exerciseChart) {
    exerciseChart.destroy();
  }

  exerciseChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: 'Exercises Found Per Category',
          data: Object.values(categoryCounts)
        }
      ]
    }
  });
}

window.onload = function () {
  const exerciseForm = document.getElementById('exerciseForm');

  if (document.getElementById('muscleSelect')) {
    loadMuscles();
  }

  if (exerciseForm) {
    exerciseForm.addEventListener('submit', loadExercises);
  }
};