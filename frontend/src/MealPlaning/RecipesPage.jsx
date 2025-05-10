import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  // Sample recipe data with images
  const recipes = [
    {
      name: 'Oatmeal with Berries',
      image: 'https://img.freepik.com/free-photo/natural-healthy-desserts-with-yogurt-fruit-copy-space_23-2148650291.jpg?t=st=1742822204~exp=1742825804~hmac=c7b6ea99a7ef3702b48b833caa30efd6c739431506b1a07ed2ec5051f5fff5e9&w=1380',
      ingredients: [
        '1/2 cup rolled oats',
        '1 cup water or milk',
        '1/2 cup mixed berries (strawberries, blueberries, raspberries)',
        '1 tbsp honey',
        '1 tbsp chia seeds (optional)',
      ],
      instructions: [
        'In a small pot, bring water or milk to a boil.',
        'Add rolled oats and reduce heat to a simmer. Cook for 5 minutes, stirring occasionally.',
        'Remove from heat and transfer to a bowl.',
        'Top with mixed berries, honey, and chia seeds. Serve warm.',
      ],
    },
    {
      name: 'Avocado Toast',
      image: 'https://img.freepik.com/free-photo/avocado-open-toast-with-avocado-slices-lemon-flax-seeds-sesame-seeds-black-bread-slices-top-view_2831-797.jpg?t=st=1742822477~exp=1742826077~hmac=62f06c1e96670a531c7f65c3670997bd18d2f32978186c3d89f40a29fa8e43d6&w=1380',
      ingredients: [
        '1 slice whole-grain bread',
        '1/2 ripe avocado',
        '1 tsp lemon juice',
        'Salt and pepper to taste',
        'Optional: cherry tomatoes, red pepper flakes, or a poached egg',
      ],
      instructions: [
        'Toast the slice of whole-grain bread.',
        'Mash the avocado in a small bowl with lemon juice, salt, and pepper.',
        'Spread the avocado mixture on the toasted bread.',
        'Add optional toppings like cherry tomatoes, red pepper flakes, or a poached egg. Serve immediately.',
      ],
    },
    {
      name: 'Greek Yogurt with Honey',
      image: 'https://img.freepik.com/free-photo/close-up-breakfast-with-cereals_23-2148604165.jpg?t=st=1742822584~exp=1742826184~hmac=d2ebfb9648a35e9af5f434c20dd1832812fe911ad5306e08aafb58c479ac40ee&w=1380',
      ingredients: [
        '1 cup Greek yogurt',
        '1 tbsp honey',
        '1/4 cup granola (optional)',
        'A handful of fresh fruit (e.g., berries, banana slices)',
      ],
      instructions: [
        'Scoop Greek yogurt into a bowl.',
        'Drizzle honey over the yogurt.',
        'Top with granola and fresh fruit, if desired.',
        'Serve immediately as a healthy breakfast or snack.',
      ],
    },
    {
      name: 'Grilled Chicken Salad',
      image: 'https://img.freepik.com/free-photo/fresh-vegetable-salad-with-grilled-chicken-breast_2829-14119.jpg?t=st=1742822575~exp=1742826175~hmac=5dd4d0d9b3e21578dd6f3936a5dfb5b757ce57ebe35ae5b204d683566c4e16cd&w=1380',
      ingredients: [
        '1 chicken breast',
        '2 cups mixed greens (spinach, arugula, lettuce)',
        '1/2 cup cherry tomatoes, halved',
        '1/4 cucumber, sliced',
        '1 tbsp olive oil',
        '1 tbsp balsamic vinegar',
        'Salt and pepper to taste',
      ],
      instructions: [
        'Season the chicken breast with salt, pepper, and a drizzle of olive oil.',
        'Grill the chicken on medium heat for 5-7 minutes per side, until fully cooked. Let it rest, then slice.',
        'In a large bowl, combine mixed greens, cherry tomatoes, and cucumber.',
        'Add the sliced chicken on top. Drizzle with olive oil and balsamic vinegar. Toss and serve.',
      ],
    },
    {
      name: 'Turkey Sandwich',
      image: 'https://img.freepik.com/free-photo/grilled-sandwich-with-bacon-fried-egg-tomato-lettuce-served-wooden-cutting-board_1150-42571.jpg?t=st=1742822829~exp=1742826429~hmac=ba1e5afdbb2d486d1cdaa68dbcc576e8111950b637a711ea09ee9869fc3e9de9&w=1380',
      ingredients: [
        '2 slices whole-grain bread',
        '3-4 slices turkey breast',
        '1 slice cheddar cheese',
        'Lettuce leaves',
        '1 tbsp mustard or mayo',
        'Optional: tomato slices, avocado',
      ],
      instructions: [
        'Toast the bread slices if desired.',
        'Spread mustard or mayo on one side of each bread slice.',
        'Layer turkey slices, cheddar cheese, lettuce, and any optional ingredients on one slice.',
        'Top with the second slice of bread. Cut in half and serve.',
      ],
    },
    {
      name: 'Spaghetti Bolognese',
      image: 'https://img.freepik.com/free-photo/delicious-pasta-plate_23-2150690703.jpg?t=st=1742822924~exp=1742826524~hmac=3730d7cca905eb4f0a5d06bbb75ba1e4d32e76baca20e99cabf2b51a462ba853&w=1060',
      ingredients: [
        '200g spaghetti',
        '200g ground beef',
        '1 can (400g) crushed tomatoes',
        '1 small onion, finely chopped',
        '2 garlic cloves, minced',
        '1 tbsp olive oil',
        '1 tsp dried oregano',
        'Salt and pepper to taste',
        'Grated Parmesan cheese (optional)',
      ],
      instructions: [
        'Cook spaghetti in salted boiling water according to package instructions. Drain and set aside.',
        'In a large pan, heat olive oil over medium heat. Add onion and garlic, sauté until softened.',
        'Add ground beef and cook until browned, breaking it up with a spoon.',
        'Stir in crushed tomatoes, oregano, salt, and pepper. Simmer for 15-20 minutes.',
        'Toss the cooked spaghetti with the sauce. Serve with grated Parmesan cheese, if desired.',
      ],
    },
    
    {
      name: 'Grilled Steak with Veggies',
      image: 'https://img.freepik.com/free-photo/roasted-pork-steak-vegetables-plate_1150-45291.jpg?t=st=1742823140~exp=1742826740~hmac=6d792eef7b9bc8fdecead56bea5b5342d478924fa3e2773953c49de941176c10&w=1380',
      ingredients: [
        '1 steak (e.g., ribeye or sirloin, about 200g)',
        '1 cup mixed vegetables (zucchini, bell peppers, asparagus)',
        '1 tbsp olive oil',
        'Salt and pepper to taste',
        '1 tsp garlic powder',
      ],
      instructions: [
        'Season the steak with salt, pepper, and garlic powder. Let it sit at room temperature for 15 minutes.',
        'Heat a grill pan over medium-high heat. Brush with olive oil.',
        'Grill the steak for 4-5 minutes per side for medium-rare, or to your desired doneness. Let it rest.',
        'Toss the mixed vegetables with olive oil, salt, and pepper. Grill for 5-7 minutes until tender.',
        'Slice the steak and serve with the grilled veggies.',
      ],
    },
    {
      name: 'Mixed Nuts',
      image: 'https://img.freepik.com/free-photo/pile-bowls-filled-with-organic-nuts-top-view_23-2148675552.jpg?t=st=1742823216~exp=1742826816~hmac=cbe80bc75b459c34747272459dcfc8040bf674a4b16078f21670032cf5f11b4e&w=1380',
      ingredients: [
        '1/4 cup almonds',
        '1/4 cup walnuts',
        '1/4 cup cashews',
        '1/4 cup pistachios',
        'Optional: a pinch of sea salt or a drizzle of honey',
      ],
      instructions: [
        'Combine all nuts in a bowl.',
        'If desired, lightly toast the nuts in a dry pan over medium heat for 3-5 minutes, stirring frequently.',
        'Add a pinch of sea salt or a drizzle of honey for extra flavor.',
        'Let cool slightly and serve as a healthy snack.',
      ],
    },
  ];

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
            Discover healthy and delicious recipes tailored to your diet
          </p>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
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
                      <li key={i}>{ingredient}</li>
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