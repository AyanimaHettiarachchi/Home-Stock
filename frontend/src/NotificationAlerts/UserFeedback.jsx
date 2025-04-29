import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

function UserFeedback() {
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    feedbackMessage: '',
    rating: 0,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID (e.g., from auth)

  // Fetch feedback entries on mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/feedback/${userId}`);
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to fetch feedback: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.userName || formData.userName.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    // New validation: Name should only contain letters and spaces (no numbers or special characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.userName)) {
      setError('Name can only contain letters and spaces (no numbers or special characters).');
      return;
    }

    if (!formData.phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number (e.g., +1234567890).');
      return;
    }
    // New validation: Phone number should only contain numbers and an optional leading '+' (no letters or special characters)
    const phoneRegex = /^\+?\d+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Phone number can only contain numbers and an optional leading "+" (no letters or special characters).');
      return;
    }

    if (!formData.feedbackMessage || formData.feedbackMessage.length < 10) {
      setError('Feedback message must be at least 10 characters long.');
      return;
    }
    // New validation: Feedback message should not contain special characters (only letters, numbers, and spaces)
    const feedbackRegex = /^[A-Za-z0-9\s]+$/;
    if (!feedbackRegex.test(formData.feedbackMessage)) {
      setError('Feedback message can only contain letters, numbers, and spaces (no special characters).');
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      if (editingFeedback) {
        // Update existing feedback
        const response = await axios.put(`http://localhost:7001/api/feedback/${editingFeedback._id}`, {
          ...formData,
          userId,
        });
        setFeedbackList(feedbackList.map((item) => (item._id === editingFeedback._id ? response.data : item)));
        setEditingFeedback(null);
      } else {
        // Create new feedback
        const response = await axios.post('http://localhost:7001/api/feedback', {
          ...formData,
          userId,
        });
        setFeedbackList([response.data, ...feedbackList]);
      }
      setSuccess(true);
      setError(null);
      setFormData({ userName: '', phoneNumber: '', feedbackMessage: '', rating: 0 }); // Reset form
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback: ' + error.message);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      userName: feedback.userName,
      phoneNumber: feedback.phoneNumber,
      feedbackMessage: feedback.feedbackMessage,
      rating: feedback.rating,
    });
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:7001/api/feedback/${feedbackId}`);
        setFeedbackList(feedbackList.filter((item) => item._id !== feedbackId));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        setError('Failed to delete feedback: ' + error.message);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
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
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:space-x-16">
              {/* Left Side: Feedback Form */}
              <motion.div
                className="w-full lg:w-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 z-10 lg:-mr-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                    {editingFeedback ? 'Edit Feedback' : 'Share Your Feedback'}
                  </h1>
                  <Link to="/notification-and-expiry-alerts" className="text-teal-300 hover:text-teal-200 text-sm font-medium transition-colors duration-300">
                    Back
                  </Link>
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
                {success && (
                  <motion.p
                    className="text-green-300 bg-green-900/30 p-3 rounded-lg mb-6 font-medium border border-green-500/40 shadow-sm"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {editingFeedback ? 'Feedback updated successfully!' : 'Feedback submitted successfully!'}
                  </motion.p>
                )}

                {/* Feedback Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter your phone number (e.g., +1234567890)"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Feedback Message</label>
                    <textarea
                      value={formData.feedbackMessage}
                      onChange={(e) => setFormData({ ...formData, feedbackMessage: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 text-white placeholder-gray-400 shadow-sm"
                      placeholder="Enter your feedback"
                      rows="4"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-100 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={24}
                          className={`cursor-pointer transition-colors duration-200 ${
                            star <= formData.rating ? 'text-yellow-300' : 'text-gray-500'
                          } hover:text-yellow-200`}
                          onClick={() => setFormData({ ...formData, rating: star })}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                  </motion.button>
                  {editingFeedback && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingFeedback(null);
                        setFormData({ userName: '', phoneNumber: '', feedbackMessage: '', rating: 0 });
                      }}
                      className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel Edit
                    </motion.button>
                  )}
                </form>
              </motion.div>

              {/* Right Side: Feedback List */}
              <div className="w-full lg:w-2/3 bg-gradient-to-br from-gray-900/30 to-gray-900/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 lg:ml-32 mt-8 lg:mt-0">
                {feedbackList.length > 0 && (
                  <motion.div
                    className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-900"
                    variants={containerVariants}
                  >
                    <div className="sticky top-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 backdrop-blur-md p-4 rounded-t-lg shadow-md z-10">
                      <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 drop-shadow-lg">
                        What Users Are Saying
                      </h2>
                    </div>
                    <div className="space-y-4 p-4">
                      {feedbackList.map((feedback) => (
                        <motion.div
                          key={feedback._id}
                          className="bg-gray-900/50 backdrop-blur-md p-4 rounded-lg shadow-md border border-gray-700/40 hover:shadow-xl hover:bg-gray-900/70 transition-all duration-300"
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
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEdit(feedback)}
                                className="text-teal-300 hover:text-teal-200 text-sm font-medium transition-colors duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(feedback._id)}
                                className="text-red-300 hover:text-red-200 text-sm font-medium transition-colors duration-300"
                              >
                                Delete
                              </button>
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
                    {/* Generate Report Button Moved Here */}
                    <motion.div className="p-4" variants={itemVariants}>
                      <Link
                        to="/feedback-report"
                        className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg"
                      >
                        Generate Report
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
                {feedbackList.length === 0 && (
                  <motion.div
                    className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/40 text-center"
                    variants={itemVariants}
                  >
                    <p className="text-gray-300 text-lg">No feedback yet. Share your thoughts to get started!</p>
                    {/* Generate Report Button for Empty State */}
                    <motion.div className="mt-4" variants={itemVariants}>
                      <Link
                        to="/feedback-report"
                        className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg"
                      >
                        Generate Report
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
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

export default UserFeedback;