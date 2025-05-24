import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [target, setTarget] = useState('');
  const [burned, setBurned] = useState('');
  const [meal, setMeal] = useState('');
  const [mealCategory, setMealCategory] = useState('other');
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' or 'history'

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const netCalories = totalCalories - Number(burned || 0);
  const caloriesLeft = Number(target || 0) - netCalories;
  const progressPercentage = target ? Math.min(100, (totalCalories / Number(target)) * 100) : 0;

  // Load data from localStorage on first mount
  useEffect(() => {
    const savedTarget = localStorage.getItem('target');
    const savedBurned = localStorage.getItem('burned');
    const savedMeals = localStorage.getItem('meals');

    if (savedTarget) setTarget(savedTarget);
    if (savedBurned) setBurned(savedBurned);
    if (savedMeals) {
      try {
        const parsedMeals = JSON.parse(savedMeals);
        if (Array.isArray(parsedMeals)) {
          setMeals(parsedMeals);
        }
      } catch (err) {
        console.error("Failed to parse meals:", err);
        setMeals([]);
      }
    }
  }, []);

  // Save updates to localStorage
  useEffect(() => {
    if (target !== '' || burned !== '' || meals.length > 0) {
      localStorage.setItem('target', target);
      localStorage.setItem('burned', burned);
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  }, [target, burned, meals]);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (meal && !isNaN(meal) && Number(meal) > 0) {
      const newMeal = {
        calories: Number(meal),
        category: mealCategory,
        date: selectedDate,
        id: Date.now()
      };
      setMeals([...meals, newMeal]);
      setMeal('');
    }
  };

  const handleRemoveMeal = (idToRemove) => {
    setMeals(meals.filter(meal => meal.id !== idToRemove));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setTarget('');
      setBurned('');
      setMeal('');
      setMeals([]);
      localStorage.removeItem('target');
      localStorage.removeItem('burned');
      localStorage.removeItem('meals');
    }
  };

  const filteredMeals = meals.filter(m => m.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Calorie Tracker
          </h1>
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 active:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-4 pb-20">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Target</p>
              <p className="text-lg font-medium text-white">{target || 0} KCAL</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Remaining</p>
              <p className={`text-lg font-medium ${caloriesLeft < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {caloriesLeft} KCAL
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'tracker' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Tracker
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'history' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              History
            </button>
          </div>

          {activeTab === 'tracker' ? (
            <>
              {/* Input Section */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block font-medium text-amber-400 mb-1 text-sm">Calories Target</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-amber-400 mb-1 text-sm">Calories Burned</label>
                  <input
                    type="number"
                    value={burned}
                    onChange={(e) => setBurned(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Meal Input */}
              <div className="mb-4">
                <label className="block font-medium text-amber-400 mb-1 text-sm">Add Meal</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    placeholder="Calories"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
                  />
                  <select
                    value={mealCategory}
                    onChange={(e) => setMealCategory(e.target.value)}
                    className="w-24 px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white text-sm"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="other">Other</option>
                  </select>
                  <br />
                  <button
                    onClick={handleAddMeal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 active:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Date Selector */}
              <div className="mb-4">
                <label className="block font-medium text-amber-400 mb-1 text-sm">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 text-white"
                />
              </div>

              {/* Meal List */}
              <div className="mb-4">
                <h2 className="text-base font-semibold text-red-400 mb-2">Today's Meals</h2>
                <ul className="space-y-2">
                  {filteredMeals.map((m) => (
                    <li 
                      key={m.id} 
                      className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600"
                    >
                      <div>
                        <span className="text-white font-medium">{m.calories} KCAL</span>
                        <span className="text-gray-400 text-xs ml-2 capitalize">({m.category})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMeal(m.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 active:bg-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                meals.reduce((acc, meal) => {
                  if (!acc[meal.date]) acc[meal.date] = [];
                  acc[meal.date].push(meal);
                  return acc;
                }, {})
              )
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, dayMeals]) => (
                  <div key={date} className="bg-gray-700/50 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">{date}</h3>
                    <div className="space-y-2">
                      {dayMeals.map((meal) => (
                        <div key={meal.id} className="flex justify-between items-center text-sm">
                          <span className="text-white">{meal.calories} KCAL</span>
                          <span className="text-gray-400 capitalize">({meal.category})</span>
                        </div>
                      ))}
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-600">
                        Total: {dayMeals.reduce((sum, meal) => sum + meal.calories, 0)} KCAL
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
