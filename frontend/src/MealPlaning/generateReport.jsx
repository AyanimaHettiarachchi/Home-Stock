// frontend/src/MealPlaning/generateMealReport.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateMealReport = (filteredMeals, setFormError) => {
  if (!filteredMeals || filteredMeals.length === 0) {
    setFormError("No meals found for the searched user name. Please search for a valid user.");
    return;
  }

  const userName = filteredMeals[0]?.userName || "Unknown";
  
  const doc = new jsPDF();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Home Stock", 20, 20);
  
  doc.setFontSize(16);
  doc.text("Meal Report", 20, 30);
  
  doc.setFontSize(14);
  doc.text("Summary", 20, 40);
  
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + Number(meal.calories), 0);
  const averageCalories = filteredMeals.length > 0 ? 
    (totalCalories / filteredMeals.length).toFixed(1) : 0;
  
  const calorieRanges = {
    "0-200": 0,
    "201-400": 0,
    "401-600": 0,
    "601-800": 0,
    "801+": 0,
  };
  
  filteredMeals.forEach((meal) => {
    const calories = Number(meal.calories);
    if (calories <= 200) calorieRanges["0-200"]++;
    else if (calories <= 400) calorieRanges["201-400"]++;
    else if (calories <= 600) calorieRanges["401-600"]++;
    else if (calories <= 800) calorieRanges["601-800"]++;
    else calorieRanges["801+"]++;
  });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Total Meals: ${filteredMeals.length}`, 25, 50);
  doc.text(`Average Calories: ${averageCalories}`, 25, 57);
  doc.text("Calories Breakdown:", 25, 64);
  doc.text(`0-200: ${calorieRanges["0-200"]}`, 30, 71);
  doc.text(`201-400: ${calorieRanges["201-400"]}`, 30, 78);
  doc.text(`401-600: ${calorieRanges["401-600"]}`, 30, 85);
  doc.text(`601-800: ${calorieRanges["601-800"]}`, 30, 92);
  doc.text(`801+: ${calorieRanges["801+"]}`, 30, 99);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("All Meal Entries", 20, 114);
  
  const tableColumns = [
    { header: 'Meal ID', dataKey: 'mealId' },
    { header: 'User Name', dataKey: 'userName' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Meal Name', dataKey: 'mealName' },
    { header: 'Meal Type', dataKey: 'mealType' },
    { header: 'Calories', dataKey: 'calories' },
    { header: 'Ingredients', dataKey: 'ingredients' },
    { header: 'Date', dataKey: 'day' }
  ];
  
  const tableRows = filteredMeals.map(meal => ({
    mealId: meal.mealId || "N/A",
    userName: meal.userName || "N/A",
    email: meal.email || "N/A",
    mealName: meal.mealName,
    mealType: meal.mealType,
    calories: meal.calories.toString(),
    ingredients: meal.ingredients,
    day: meal.day
  }));
  
  doc.autoTable({
    startY: 120,
    head: [tableColumns.map(col => col.header)],
    body: tableRows.map(row => tableColumns.map(col => row[col.dataKey])),
    theme: 'grid',
    headStyles: {
      fillColor: [242, 242, 242],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    styles: {
      cellPadding: 2,
      fontSize: 9,
      overflow: 'linebreak'
    },
    columnStyles: {
      ingredients: { cellWidth: 40 }
    }
  });
  
  const finalY = doc.autoTable.previous.finalY + 20;
  
  const now = new Date();
  const generatedOn = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(85, 85, 85);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(20, finalY, 190, finalY);
  
  doc.text("Home Stock", 20, finalY + 10);
  doc.text("Address: 64/ Main Street, Colombo - 10", 20, finalY + 16);
  doc.text("Phone: +94 (70) 5346902 | Email: support@homestock.com", 20, finalY + 22);
  doc.text("Website: www.homestock.com", 20, finalY + 28);
  doc.text(`Generated On: ${generatedOn}`, 20, finalY + 34);
  doc.text("Page 1 of 1", 170, finalY + 34);
  
  doc.save(`HomeStock_MealReport_${userName}_${now.toISOString().split('T')[0]}.pdf`);
  
  setFormError("");
  
  return true;
};