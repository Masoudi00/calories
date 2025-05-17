import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [target, setTarget] = useState('');
  const [burned, setBurned] = useState('');
  const [meal, setMeal] = useState('');
  const [meals, setMeals] = useState([]);

  const totalCalories = meals.reduce((acc, curr) => acc + curr, 0);
  const netCalories = totalCalories - Number(burned || 0);
  const caloriesLeft = Number(target || 0) - netCalories;
  const caloriesLeftWithoutBurned = Number(target || 0) - totalCalories;

  // Load data from localStorage on first mount
  useEffect(() => {
    const savedTarget = localStorage.getItem('target');
    const savedBurned = localStorage.getItem('burned');
    const savedMeals = localStorage.getItem('meals');

    console.log('Loading from localStorage:', { savedTarget, savedBurned, savedMeals });

    if (savedTarget) setTarget(savedTarget);
    if (savedBurned) setBurned(savedBurned);
    if (savedMeals) {
      try {
        const parsedMeals = JSON.parse(savedMeals);
        console.log('Parsed meals:', parsedMeals);
        if (Array.isArray(parsedMeals)) {
          setMeals(parsedMeals);
          console.log('Setting meals to:', parsedMeals);
        }
      } catch (err) {
        console.error("Failed to parse meals:", err);
        setMeals([]);
      }
    }
  }, []);

  // Save updates to localStorage (all at once)
  useEffect(() => {
    // Only save if at least one value is not empty
    if (target !== '' || burned !== '' || meals.length > 0) {
      localStorage.setItem('target', target);
      localStorage.setItem('burned', burned);
      localStorage.setItem('meals', JSON.stringify(meals));
      console.log('Saving all to localStorage:', { target, burned, meals });
    }
  }, [target, burned, meals]);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (meal) {
      setMeals([...meals, Number(meal)]);
      setMeal('');
    }
  };

  const handleRemoveMeal = (indexToRemove) => {
    setMeals(meals.filter((_, i) => i !== indexToRemove));
  };

  const handleReset = () => {
    setTarget('');
    setBurned('');
    setMeal('');
    setMeals([]);
    // Only remove this app's keys
    localStorage.removeItem('target');
    localStorage.removeItem('burned');
    localStorage.removeItem('meals');
  };

  return (
      <div className="bg-black shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg">
        {/* Header and Reset */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Calorie Tracker</h1>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Reset All
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-amber-600 mb-1">Calories Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-amber-600 mb-1">Calories Burned</label>
            <input
              type="number"
              value={burned}
              onChange={(e) => setBurned(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-amber-600 mb-1">Meal Calories</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                placeholder="e.g. 600"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddMeal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Meals</h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {meals.map((m, index) => (
              <li key={index} className="flex justify-between items-center text-black bg-green-50 p-2 rounded border">
                <span>{m} KCAL</span>
                <button
                  onClick={() => handleRemoveMeal(index)}
                  className="text-xs px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary (with burned) */}
        <div className="mt-6 border-t pt-4 text-sm space-y-1">
          <h3 className="text-blue-600 font-semibold">With Calories Burned</h3>
          <p><strong>Total Consumed:</strong> {totalCalories} KCAL</p>
          <p><strong>Target:</strong> {target || 0} KCAL</p>
          <p><strong>Burned:</strong> {burned || 0} KCAL</p>
          <p><strong>Net Calories:</strong> {netCalories} KCAL</p>
          <p><strong>Calories Left:</strong> {caloriesLeft} KCAL</p>
        </div>

        {/* Summary (without burned) */}
        <div className="mt-4 border-t pt-4 text-sm space-y-1">
          <h3 className="text-purple-600 font-semibold">Without Calories Burned</h3>
          <p><strong>Total Consumed:</strong> {totalCalories} KCAL</p>
          <p><strong>Target:</strong> {target || 0} KCAL</p>
          <p><strong>Calories Left:</strong> {caloriesLeftWithoutBurned} KCAL</p>
        </div>
      </div>
  );
}

export default App;
