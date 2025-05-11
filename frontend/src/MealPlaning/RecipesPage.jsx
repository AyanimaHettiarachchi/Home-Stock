import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants for fade-in
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function RecipesPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState(null);
  const userId = '507f1f77bcf86cd799439011'; // Consistent with Inventory.jsx

  // Sample recipe data with images
  const recipes = [
    {
      name: 'Strawberry Yogurt Parfait',
      image: 'https://i.pinimg.com/736x/35/7b/de/357bde3bf22efb15ae4459557ddb9ba7.jpg',
      ingredients: ['yogurt', 'strawberries', 'apples', 'dairy milk'],
      instructions: [
        'In a glass or bowl, layer half the yogurt.',
        'Add a layer of sliced strawberries and diced apples.',
        'Drizzle 1 tbsp dairy milk over the fruit.',
        'Repeat layers with remaining yogurt, fruit, and dairy milk.',
        'Serve immediately or chill for 10 minutes for a refreshing start.',
      ],
    },
    {
      name: 'Scrambled Eggs with Cheese',
      image: 'https://i.pinimg.com/736x/08/b9/b7/08b9b76f2ff4ef8a42f4a8f611facb90.jpg',
      ingredients: ['eggs', 'cheese', 'butter', 'cucumber'],
      instructions: [
        'Heat a non-stick pan over medium heat and melt butter.',
        'Whisk eggs in a bowl and pour into the pan.',
        'Stir gently until eggs begin to set, then add shredded cheese.',
        'Cook until eggs are fully set but soft, about 2-3 minutes.',
        'Serve with cucumber slices on the side for a fresh crunch.',
      ],
    },
    {
      name: 'Chicken Drumstick Salad',
      image: 'https://i.pinimg.com/736x/5f/0e/05/5f0e056ab4116682d3e4e903c63abd9e.jpg',
      ingredients: ['chicken drumsticks', 'cucumber', 'yogurt', 'soya sauce', 'cheese'],
      instructions: [
        'Remove meat from cooked drumsticks and shred into bite-sized pieces.',
        'In a bowl, mix shredded chicken, cucumber slices, and cheese cubes.',
        'Combine yogurt and soya sauce to make a creamy dressing.',
        'Toss the salad with the dressing and serve chilled or at room temperature.',
      ],
    },
    {
      name: 'Pizza Slice Melt with Apple Side',
      image: 'https://i.pinimg.com/736x/55/2a/65/552a656e0f9777c6ca318d209b8ae113.jpg',
      ingredients: ['pizza slices', 'cheese', 'apples', 'fruit juice'],
      instructions: [
        'Preheat oven to 350°F (175°C).',
        'Place pizza slices on a baking sheet and sprinkle extra shredded cheese on top.',
        'Bake for 5-7 minutes until cheese is melted and bubbly.',
        'Serve with apple slices and a glass of fruit juice for a balanced meal.',
      ],
    },
    {
      name: 'Tofu Stir-Fry with Soya Sauce',
      image: 'https://i.pinimg.com/736x/d5/d3/c1/d5d3c1ec911825c8135b9c0d34a7110f.jpg',
      ingredients: ['tofu', 'cucumber', 'soya sauce', 'butter', 'eggs'],
      instructions: [
        'Heat butter in a pan over medium heat.',
        'Add cubed tofu and stir-fry until golden, about 5 minutes.',
        'Pour in soya sauce and toss to coat tofu evenly.',
        'Add scrambled egg pieces and cucumber slices, cooking for 1-2 minutes to warm through.',
        'Serve hot as a flavorful, protein-packed dinner.',
      ],
    },
    {
      name: 'Baked Chicken Drumsticks with Strawberry Sauce',
      image: 'https://i.pinimg.com/736x/a4/46/00/a446005ac7e3113929414321cc914e28.jpg',
      ingredients: ['chicken drumsticks', 'butter', 'strawberries', 'yogurt', 'cheese'],
      instructions: [
        'Preheat oven to 400°F (200°C).',
        'Rub drumsticks with melted butter and place on a baking tray.',
        'Bake for 35-40 minutes until golden and cooked through.',
        'In a small pan, heat mashed strawberries with yogurt to make a tangy sauce.',
        'Serve drumsticks topped with strawberry sauce and a sprinkle of grated cheese.',
      ],
    },
    {
      name: 'Apple and Cheese Bites',
      image: 'https://i.pinimg.com/736x/7a/7e/11/7a7e11c7def11e472f2a5181982ca17e.jpg',
      ingredients: ['apples', 'cheese', 'dairy milk'],
      instructions: [
        'Arrange apple slices on a plate.',
        'Place a slice of cheese on each apple slice.',
        'Drizzle a small amount of dairy milk over the top for a creamy touch.',
        'Enjoy as a quick, sweet-savory snack.',
      ],
    },
    {
      name: 'Ice Cream and Strawberry Sundae',
      image: 'https://i.pinimg.com/736x/4c/ce/cb/4ccecbda1a3804d2b65b90b862b3ca4c.jpg',
      ingredients: ['ice cream', 'strawberries', 'dairy milk', 'yogurt'],
      instructions: [
        'Place a scoop of ice cream in a bowl.',
        'Top with sliced strawberries.',
        'Mix dairy milk and yogurt to create a creamy drizzle.',
        'Pour the drizzle over the ice cream and strawberries.',
        'Serve immediately for a refreshing, indulgent snack.',
      ],
    },
    {
      name: 'Grilled Chicken Salad',
      image: 'https://img.freepik.com/free-photo/fresh-vegetable-salad-with-grilled-chicken-breast_2829-14119.jpg?t=st=1742822575~exp=1742826175~hmac=5dd4d0d9b3e21578dd6f3936a5dfb5b757ce57ebe35ae5b204d683566c4e16cd&w=1380',
      ingredients: [
        'chicken breast',
        'mixed greens',
        'cherry tomatoes',
        'cucumber',
        'olive oil',
        'balsamic vinegar',
      ],
      instructions: [
        'Season the chicken breast with salt, pepper, and a drizzle of olive oil.',
        'Grill the chicken on medium heat for 5-7 minutes per side, until fully cooked. Let it rest, then slice.',
        'In a large bowl, combine mixed greens, cherry tomatoes, and cucumber.',
        'Add the sliced chicken on top. Drizzle with olive oil and balsamic vinegar. Toss and serve.',
      ],
    },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/inventory/${userId}`);
        setInventory(response.data);
        // Filter recipes based on inventory
        const inventoryNames = response.data
          .map(item => item.name.toLowerCase().trim())
          .filter(name => name);
        const filtered = recipes.filter(recipe =>
          recipe.ingredients.some(ingredient =>
            inventoryNames.includes(ingredient.toLowerCase().trim())
          )
        );
        setFilteredRecipes(filtered);
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Failed to fetch inventory items.');
      }
    };

    fetchInventory();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/top-view-food-ingredients-with-vegetable-soup-bowl-notebook_23-2148834720.jpg?t=st=1742823423~exp=1742827023~hmac=0f312c2205df077924eaa965d0009d1d208de688f6b48ee28c0a6d9b6931da53&w=1380')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-gray-900/30 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <NavLink to="/">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Header Logo"
                className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-300"
              />
            </NavLink>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
              Home Stock
            </h1>
          </div>
          <nav className="flex space-x-4 md:space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/notification-and-expiry-alerts"
              className={({ isActive }) =>
                `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Notifications
            </NavLink>
            <NavLink
              to="/meal-planning-dashboard"
              className={({ isActive }) =>
                `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Meal Planning
            </NavLink>
            <NavLink
              to="/notification-settings"
              className={({ isActive }) =>
                `text-white text-sm md:text-lg hover:text-purple-300 transition-colors duration-300 ${isActive ? 'underline underline-offset-4' : ''}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-8 text-center">
            Recipes
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-10 text-center drop-shadow-md">
            Discover recipes you can make with your current inventory
          </p>

          {error && (
            <motion.p
              className="text-red-300 bg-red-900/30 p-3 rounded-lg mb-6 font-medium border border-red-500/40 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.p>
          )}

          {/* Recipes Grid */}
          {filteredRecipes.length === 0 && !error ? (
            <motion.div
              className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/40 text-center"
              variants={cardVariants}
            >
              <p className="text-gray-200 text-lg">
                No recipes can be made with your current inventory. Add more items to your inventory!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05 }}
                  className="bg-orange-500/30 backdrop-blur-md rounded-2xl shadow-lg p-6"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">{recipe.name}</h3>
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-white mb-2">Ingredients:</h4>
                    <ul className="list-disc list-inside text-white">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i}>
                          {ingredient}
                          {inventory.some(
                            item => item.name.toLowerCase().trim() === ingredient.toLowerCase().trim()
                          ) && (
                            <span className="text-green-300 ml-2">(In Stock)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside text-white">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900/30 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
              alt="Footer Logo"
              className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
            />
            <p className="text-white text-sm md:text-base">© 2025 Home Stock Manager. All rights reserved.</p>
          </div>
          <div className="flex justify-center space-x-4 md:space-x-6 mb-4">
            <a href="#about" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
              About
            </a>
            <a href="#contact" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
              Contact
            </a>
            <a href="#privacy" className="text-gray-300 text-sm md:text-base hover:text-purple-300 transition-colors duration-300">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}