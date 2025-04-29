const generateReport = () => {
  if (!searchQuery || filteredMeals.length === 0) {
    setFormError("No meals found for the searched user name. Please search for a valid user.");
    return;
  }

  const userName = filteredMeals[0].userName;
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + Number(meal.calories), 0);
  const averageCalories = filteredMeals.length > 0 ? (totalCalories / filteredMeals.length).toFixed(1) : 0;

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

  const doc = new jsPDF();

  // Modern Header with Sleek Design
  doc.setFillColor(26, 32, 44); // Dark slate background
  doc.rect(0, 0, 210, 40, "F");
  
  // Logo simulation (circle with initials)
  doc.setFillColor(59, 130, 246); // Blue accent
  doc.circle(20, 20, 10, "F");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("HS", 15, 23);
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Meal Report", 40, 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(156, 163, 175); // Light gray
  doc.text(`Generated for ${userName}`, 40, 30);

  // Summary Section with Card Design
  doc.setFontSize(18);
  doc.setTextColor(26, 32, 44);
  doc.setFont("helvetica", "bold");
  doc.text("Overview", 20, 60);

  // Summary Cards with Shadow Effect
  const drawCard = (x, title, value, unit = "") => {
    doc.setFillColor(255, 255, 255);
    doc.rect(x, 70, 55, 40, "F");
    // Shadow effect
    doc.setFillColor(229, 231, 235); // Light gray shadow
    doc.rect(x + 2, 72, 55, 40, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(x, 70, 55, 40, "F");
    
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128); // Gray text
    doc.setFont("helvetica", "normal");
    doc.text(title, x + 5, 85);
    doc.setFontSize(16);
    doc.setTextColor(26, 32, 44);
    doc.setFont("helvetica", "bold");
    doc.text(`${value}${unit}`, x + 5, 100);
  };

  drawCard(20, "Total Meals", filteredMeals.length);
  drawCard(85, "Avg Calories", averageCalories, " cal");
  
  // Calorie Distribution Card
  doc.setFillColor(255, 255, 255);
  doc.rect(150, 70, 40, 40, "F");
  doc.setFillColor(229, 231, 235);
  doc.rect(152, 72, 40, 40, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(150, 70, 40, 40, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text("Calorie Ranges", 155, 80);
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44);
  let yCal = 87;
  for (const [range, count] of Object.entries(calorieRanges)) {
    doc.text(`${range}: ${count}`, 155, yCal);
    yCal += 5;
  }

  // Table Section
  doc.setFontSize(18);
  doc.setTextColor(26, 32, 44);
  doc.setFont("helvetica", "bold");
  doc.text("Meal Details", 20, 130);

  // Table Headers with Modern Styling
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.rect(20, 135, 170, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81); // Dark gray
  doc.setFont("helvetica", "bold");
  let yPos = 142;
  doc.text("ID", 22, yPos);
  doc.text("User", 40, yPos);
  doc.text("Email", 65, yPos);
  doc.text("Meal", 95, yPos);
  doc.text("Type", 125, yPos);
  doc.text("Cal", 145, yPos);
  doc.text("Ingredients", 160, yPos);

  // Table Rows with Modern Styling
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  let rowIndex = 0;
  yPos = 150;
  filteredMeals.forEach((meal) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
      rowIndex = 0;
    }
    if (rowIndex % 2 === 0) {
      doc.setFillColor(243, 244, 246); // Subtle alternating color
      doc.rect(20, yPos - 4, 170, 10, "F");
    }
    doc.text(meal.mealId?.slice(0, 6) || "N/A", 22, yPos);
    doc.text(meal.userName?.slice(0, 10) || "N/A", 40, yPos);
    doc.text(meal.email?.slice(0, 12) || "N/A", 65, yPos);
    doc.text(meal.mealName.slice(0, 12), 95, yPos);
    doc.text(meal.mealType.slice(0, 8), 125, yPos);
    doc.text(meal.calories.toString(), 145, yPos);
    doc.text(meal.ingredients.slice(0, 20), 160, yPos);
    yPos += 10;
    rowIndex++;
  });

  // Modern Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(26, 32, 44);
    doc.rect(0, doc.internal.pageSize.height - 20, 210, 20, "F");
    
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.text("Home Stock • 64/ Main Street, Colombo - 10 • support@homestock.com", 
      20, doc.internal.pageSize.height - 10);
    doc.text(`Page ${i}/${pageCount}`, 
      doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }

  doc.save(`Meal_Report_${userName}_${todayFormatted}.pdf`);
  setFormError("");
};