import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import jsPDF from 'jspdf';

function FeedbackReport() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID (e.g., from auth)

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/feedback/${userId}`);
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback for report:', error);
      setError('Failed to fetch feedback: ' + error.message);
    }
  };

  const totalFeedback = feedbackList.length;
  const averageRating =
    totalFeedback > 0
      ? (feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedback).toFixed(1)
      : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedbackList.filter((feedback) => feedback.rating === star).length,
  }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 15;

    // Header with Logo
    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/5968/5968817.png';
    doc.addImage(logoUrl, 'PNG', 10, yOffset - 10, 20, 20);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 139); // Blue
    doc.text('Home Stock', 35, yOffset);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80); // Dark gray
    doc.text('Feedback Report', 35, yOffset + 8), { align: 'center' };
    doc.setLineWidth(0.5);
    doc.setDrawColor(150); // Medium gray line
    doc.line(10, yOffset + 12, 200, yOffset + 12);
    yOffset += 25;

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Summary', 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.setFillColor(230, 240, 255); // Very light blue
    doc.rect(10, yOffset, 50, 25, 'F'); // Total Feedback
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Feedback', 12, yOffset + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${totalFeedback}`, 12, yOffset + 18);

    doc.setFillColor(230, 240, 255);
    doc.rect(70, yOffset, 50, 25, 'F'); // Average Rating
    doc.setFont('helvetica', 'normal');
    doc.text('Average Rating', 72, yOffset + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${averageRating} / 5`, 72, yOffset + 18);

    doc.setFont('helvetica', 'normal');
    doc.text('Rating Breakdown:', 130, yOffset + 8);
    ratingBreakdown.forEach(({ star, count }, index) => {
      doc.text(`${star} Star: ${count}`, 132, yOffset + 16 + index * 6);
    });
    yOffset += 35;

    // Feedback Entries Table
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('All Feedback Entries', 10, yOffset);
    yOffset += 10;

    // Table Headers
    doc.setFontSize(10);
    doc.setFillColor(0, 102, 204); // Blue header
    doc.rect(10, yOffset, 190, 10, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.text('Name', 12, yOffset + 7);
    doc.text('Rating', 50, yOffset + 7);
    doc.text('Phone', 70, yOffset + 7);
    doc.text('Message', 110, yOffset + 7);
    doc.text('Submitted On', 150, yOffset + 7);
    yOffset += 10;

    // Table Rows with Increased Spacing
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    feedbackList.forEach((feedback, index) => {
      if (yOffset > 230) { // Adjusted for footer space
        doc.addPage();
        yOffset = 15;
        doc.addImage(logoUrl, 'PNG', 10, yOffset - 10, 20, 20);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Home Stock', 35, yOffset);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        doc.text('Feedback Report', 35, yOffset + 8);
        doc.setLineWidth(0.5);
        doc.setDrawColor(150);
        doc.line(10, yOffset + 12, 200, yOffset + 12);
        yOffset += 25;
        doc.setFontSize(10);
        doc.setFillColor(0, 102, 204);
        doc.rect(10, yOffset, 190, 10, 'F');
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
        doc.text('Name', 12, yOffset + 7);
        doc.text('Rating', 50, yOffset + 7);
        doc.text('Phone', 70, yOffset + 7);
        doc.text('Message', 110, yOffset + 7);
        doc.text('Submitted On', 150, yOffset + 7);
        yOffset += 10;
      }
      const rowHeight = 18; // Increased from 12 to 18 for more space
      doc.setFillColor(index % 2 === 0 ? (245, 245, 245) : (255, 255, 255)); // Alternating colors
      doc.rect(10, yOffset, 190, rowHeight, 'F');
      doc.setTextColor(0);
      // Split text for multi-line support
      const nameLines = doc.splitTextToSize(feedback.userName, 35);
      const messageLines = doc.splitTextToSize(feedback.feedbackMessage, 35);
      const submittedLines = doc.splitTextToSize(new Date(feedback.createdAt).toLocaleString(), 45);
      doc.text(nameLines, 12, yOffset + 6);
      doc.text(`${feedback.rating} / 5`, 50, yOffset + 6);
      doc.text(feedback.phoneNumber, 70, yOffset + 6, { maxWidth: 35 });
      doc.text(messageLines, 110, yOffset + 6);
      doc.text(submittedLines, 150, yOffset + 6);
      doc.setDrawColor(180); // Softer gray grid lines
      doc.line(10, yOffset, 200, yOffset); // Top border
      doc.line(10, yOffset + rowHeight, 200, yOffset + rowHeight); // Bottom border
      doc.line(45, yOffset, 45, yOffset + rowHeight); // Vertical lines
      doc.line(65, yOffset, 65, yOffset + rowHeight);
      doc.line(105, yOffset, 105, yOffset + rowHeight);
      doc.line(145, yOffset, 145, yOffset + rowHeight);
      yOffset += rowHeight;
    });

    // Footer with Download Date Below Website
    const pageCount = doc.internal.getNumberOfPages();
    const downloadDate = new Date().toLocaleString(); // Current date and time
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(150);
      doc.line(10, 265, 200, 265); // Footer line
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('Home Stock', 10, 272);
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.setFont('helvetica', 'normal');
      doc.text('Address: 64/ Main Street , colombo - 10', 10, 278);
      doc.text('Phone: +94 (70) 5346902  |  Email: support@homestock.com', 10, 284);
      doc.text('Website: www.homestock.com', 10, 290);
      doc.text(`Downloaded on: ${downloadDate}`, 10, 296); // Download date below website
      doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
    }

    doc.save('Feedback_Report.pdf');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/female-person-with-shopping-cart-opening-fridge-take-food-grocery-store-while-talking-phone_342744-1141.jpg?t=st=1742825680~exp=1742829280~hmac=069d2747559d435ac9927c67e8ae0b79f5a3fa5f15e4add9a52f8828ac097e47&w=996)`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 lg:bg-black/30"></div>

      <div className="relative min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
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

        <main className="flex-1 px-4 md:px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                  Feedback Report
                </h1>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadPDF}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Download Report
                  </button>
                  <Link to="/user-message-form" className="text-teal-300 hover:text-teal-200 text-sm font-medium transition-colors duration-300 self-center">
                    Back to Feedback
                  </Link>
                </div>
              </motion.div>

              {error && (
                <motion.p
                  className="text-red-300 bg-red-900/30 p-3 rounded-lg mb-6 font-medium border border-red-500/40 shadow-sm"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
                <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700/40">
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">Total Feedback</h3>
                  <p className="text-3xl font-bold text-white">{totalFeedback}</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700/40">
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">Average Rating</h3>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-white mr-2">{averageRating}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          className={star <= Math.round(averageRating) ? 'text-yellow-300' : 'text-gray-500'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700/40">
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {ratingBreakdown.map(({ star, count }) => (
                      <div key={star} className="flex items-center">
                        <span className="text-gray-200 w-8">{star} Star</span>
                        <div className="flex mr-2">
                          {[...Array(star)].map((_, i) => (
                            <FaStar key={i} size={16} className="text-yellow-300" />
                          ))}
                        </div>
                        <span className="text-white font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {feedbackList.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="sticky top-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 backdrop-blur-md p-4 rounded-t-lg shadow-md z-10">
                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 drop-shadow-lg">
                      All Feedback Entries
                    </h2>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-900 p-4">
                    {feedbackList.map((feedback) => (
                      <motion.div
                        key={feedback._id}
                        className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 mb-4"
                        variants={itemVariants}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="font-semibold text-teal-100 mr-2">{feedback.userName}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  size={16}
                                  className={star <= feedback.rating ? 'text-yellow-300' : 'text-gray-500'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Phone: {feedback.phoneNumber}</p>
                        <p className="text-gray-200">{feedback.feedbackMessage}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          Submitted on: {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {feedbackList.length === 0 && (
                <motion.div
                  className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/40 text-center"
                  variants={itemVariants}
                >
                  <p className="text-gray-300 text-lg">No feedback available to generate a report.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>

        <footer className="w-full bg-gradient-to-r from-gray-900/80 to-gray-900/80 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 md:px-6 text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968817.png"
                alt="Footer Logo"
                className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300"
              />
              <p className="text-white text-sm md:text-base">© 2025 Home Stock. All rights reserved.</p>
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
    </div>
  );
}

export default FeedbackReport;