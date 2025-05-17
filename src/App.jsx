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
    <div className="min-h-screen bg-gray-900 sm:py-4 sm:px-6 flex items-center justify-center">
      <div className="bg-gray-800 shadow-2xl rounded-none sm:rounded-2xl p-4 sm:p-6 w-full h-full sm:h-auto sm:max-w-md">
        {/* Header and Reset */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-400">Calorie Tracker</h1>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors active:bg-red-700"
          >
            Reset All
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          <div>
            <label className="block font-medium text-amber-400 mb-1 text-sm">Calories Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium text-amber-400 mb-1 text-sm">Calories Burned</label>
            <input
              type="number"
              value={burned}
              onChange={(e) => setBurned(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium text-amber-400 mb-1 text-sm">Meal Calories</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                placeholder="e.g. 600"
                className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
              />
              <button
                onClick={handleAddMeal}
                className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700 min-w-[80px]"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div className="mt-4">
          <h2 className="text-base font-semibold mb-2 text-red-400">Meals</h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {meals.map((m, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
                <span className="text-white">{m} KCAL</span>
                <button
                  onClick={() => handleRemoveMeal(index)}
                  className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors active:bg-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary Sections */}
        <div className="mt-4 space-y-3">
          {/* With burned */}
          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
            <h3 className="text-blue-400 font-medium text-sm mb-2">With Calories Burned</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-300"><span className="text-gray-400">Total:</span> {totalCalories} KCAL</p>
              <p className="text-gray-300"><span className="text-gray-400">Target:</span> {target || 0} KCAL</p>
              <p className="text-gray-300"><span className="text-gray-400">Burned:</span> {burned || 0} KCAL</p>
              <p className="text-gray-300"><span className="text-gray-400">Net:</span> {netCalories} KCAL</p>
              <p className="text-gray-300 col-span-2"><span className="text-gray-400">Left:</span> {caloriesLeft} KCAL</p>
            </div>
          </div>

          {/* Without burned */}
          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
            <h3 className="text-purple-400 font-medium text-sm mb-2">Without Calories Burned</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-300"><span className="text-gray-400">Total:</span> {totalCalories} KCAL</p>
              <p className="text-gray-300"><span className="text-gray-400">Target:</span> {target || 0} KCAL</p>
              <p className="text-gray-300 col-span-2"><span className="text-gray-400">Left:</span> {caloriesLeftWithoutBurned} KCAL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
